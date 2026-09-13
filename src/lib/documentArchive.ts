const ARCHIVE_SOURCES = [
  {
    repository: "patriotnewsactivism/PDFs",
    branch: "main",
    includePrefix: "",
  },
  {
    repository: "patriotnewsactivism/American-Injustice",
    branch: "main",
    includePrefix: "evidence-organized/",
  },
] as const;

const PUBLIC_ARCHIVE_COLLECTION = "Public Source Archive";

export type DocumentStatus = "court-verified" | "source-document";

export type PublicDocument = {
  slug: string;
  fileName: string;
  canonicalFileName: string;
  title: string;
  date: string | null;
  year: number | null;
  filedAt: string | null;
  court: string | null;
  docket: string | null;
  collection: string;
  collections: string[];
  size: number;
  href: string;
  status: DocumentStatus;
};

export type InternalDocument = PublicDocument & {
  sourceRepository: string;
  sourceBranch: string;
  sourcePath: string;
  sourceSha: string;
};

type GitTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
};

type GitTreeResponse = {
  tree?: GitTreeItem[];
  truncated?: boolean;
};

/**
 * Fail-closed verification manifest.
 *
 * An item is marked "court-verified" only after visual review confirms that
 * the PDF itself displays a court-generated filed/entered mark containing a
 * date and time. All other PDFs may still be published as source documents,
 * but they are not presented as court-verified merely because of a filename,
 * signature date, fax header, or "filing ready" label.
 */
const VERIFIED_COURT_DOCUMENTS = [
  {
    path: "2021-09-20 - State Response To Peremptory Challenge.pdf",
    title: "State Response to Motion for Peremptory Reversal",
    date: "2021-09-20",
    filedAt: "Sep 20, 2021 at 16:52:40",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
  },
  {
    path: "2021-12-07 - AGO Motion For Time.pdf",
    title: "Attorney General Motion for Additional Time",
    date: "2021-12-07",
    filedAt: "Dec 7, 2021 at 10:05:31",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
  },
  {
    path: "2021-12-15 - Greenlee Grants COA Order.pdf",
    title: "Order Granting Additional Time",
    date: "2021-12-15",
    filedAt: "Dec 15, 2021 at 10:49:07",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
  },
  {
    path: "2022-01-05 - Appellee Brief Filed In COA.pdf",
    title: "Brief of Appellee",
    date: "2022-01-05",
    filedAt: "Jan 5, 2022 at 13:39:13",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
  },
  {
    path: "2024-12-23 - Order On Motion For Counsel.pdf",
    title: "Order on Motion for Appointment of Counsel",
    date: "2024-12-23",
    filedAt: "Dec 23, 2024 at 14:30:31",
    court: "Supreme Court of Mississippi",
    docket: "2024-TS-00839",
  },
  {
    path: "2023-08-11 - Motion For A Franks Hearing Ocr1.pdf",
    title: "Motion for a Franks Hearing",
    date: "2025-02-25",
    filedAt: "Feb 25, 2025 at 12:54 PM",
    court: "County Court No. 3, Galveston County, Texas",
    docket: "MD-0417962",
  },
] as const;

const CASE_COLLECTION_PREFIXES = [
  ["evidence-organized/02-Reardon-v-Osteen/", "Reardon v. Osteen"],
  ["evidence-organized/03-Reardon-Criminal-23-CR-2981/", "Galveston Criminal Record"],
  ["evidence-organized/04-Crowder-v-Reardon-Chancery/", "Crowder v. Reardon"],
  ["evidence-organized/06-Reardon-v-Layton/", "Reardon v. Layton"],
  ["evidence-organized/07-FBI-Beavers-East-Complaint/", "FBI / Beavers / East"],
  ["evidence-organized/08-MS-Court-of-Appeals/", "Mississippi Court of Appeals"],
  ["evidence-organized/10-NOLA-Records-Requests/", "New Orleans Records"],
] as const;

const VERIFIED_BY_FILE_NAME = new Map(
  VERIFIED_COURT_DOCUMENTS.map((document) => [fileNameFromPath(document.path).toLowerCase(), document] as const),
);

function fileNameFromPath(path: string) {
  return path.split("/").pop() ?? path;
}

function encodeRepositoryPath(path: string) {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

function extractFileDate(fileName: string) {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})\s*-\s*/);
  return match?.[1] ?? null;
}

function humanizeFileName(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+Ocr\d*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "document";
}

function sanitizeDownloadFileName(value: string) {
  return value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalFileName(date: string | null, title: string, docket: string | null) {
  const parts = [date, title, docket].filter((value): value is string => Boolean(value));
  return sanitizeDownloadFileName(`${parts.join(" - ")}.pdf`);
}

function collectionForPath(path: string, fileName: string, verifiedCourt?: string) {
  for (const [prefix, collection] of CASE_COLLECTION_PREFIXES) {
    if (path.startsWith(prefix)) return collection;
  }

  if (verifiedCourt?.toLowerCase().includes("mississippi court of appeals")) {
    return "Mississippi Court of Appeals";
  }

  const normalized = fileName.toLowerCase();
  if (normalized.includes("osteen")) return "Reardon v. Osteen";
  if (normalized.includes("crowder")) return "Crowder v. Reardon";
  if (normalized.includes("layton")) return "Reardon v. Layton";
  if (normalized.includes("new orleans") || normalized.includes("nola")) return "New Orleans Records";
  if (normalized.includes("court of appeals") || /(^|[^a-z])coa([^a-z]|$)/i.test(fileName)) return "Mississippi Court of Appeals";

  return PUBLIC_ARCHIVE_COLLECTION;
}

async function fetchSourceTree(source: (typeof ARCHIVE_SOURCES)[number]) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${source.repository}/git/trees/${source.branch}?recursive=1`,
    {
      headers,
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to index ${source.repository}: GitHub returned ${response.status}.`);
  }

  const payload = (await response.json()) as GitTreeResponse;
  if (payload.truncated) {
    throw new Error(`Unable to index ${source.repository}: repository tree response was truncated.`);
  }

  return (payload.tree ?? []).filter((item) => {
    if (item.type !== "blob" || !item.path.toLowerCase().endsWith(".pdf")) return false;
    if (!source.includePrefix) return true;
    return item.path.startsWith(source.includePrefix);
  });
}

function toInternalDocument(
  source: (typeof ARCHIVE_SOURCES)[number],
  item: GitTreeItem,
): InternalDocument {
  const fileName = fileNameFromPath(item.path);
  const verified = VERIFIED_BY_FILE_NAME.get(fileName.toLowerCase());
  const date = verified?.date ?? extractFileDate(fileName);
  const title = verified?.title ?? humanizeFileName(fileName);
  const court = verified?.court ?? null;
  const docket = verified?.docket ?? null;
  const collection = collectionForPath(item.path, fileName, court ?? undefined);
  const status: DocumentStatus = verified ? "court-verified" : "source-document";

  return {
    slug: "",
    fileName,
    canonicalFileName: canonicalFileName(date, title, docket),
    title,
    date,
    year: date ? Number(date.slice(0, 4)) : null,
    filedAt: verified?.filedAt ?? null,
    court,
    docket,
    collection,
    collections: [collection],
    size: item.size ?? 0,
    href: "",
    status,
    sourceRepository: source.repository,
    sourceBranch: source.branch,
    sourcePath: item.path,
    sourceSha: item.sha,
  };
}

async function getInternalDocuments(): Promise<InternalDocument[]> {
  const sourceResults = await Promise.allSettled(
    ARCHIVE_SOURCES.map(async (source) => ({ source, items: await fetchSourceTree(source) })),
  );

  const successful = sourceResults.filter(
    (result): result is PromiseFulfilledResult<{ source: (typeof ARCHIVE_SOURCES)[number]; items: GitTreeItem[] }> => result.status === "fulfilled",
  );

  if (!successful.length) {
    throw new Error("No document archive source could be indexed.");
  }

  const deduplicated = new Map<string, InternalDocument>();

  for (const { value } of successful) {
    for (const item of value.items) {
      const incoming = toInternalDocument(value.source, item);
      const existing = deduplicated.get(item.sha);

      if (existing) {
        for (const collection of incoming.collections) {
          if (!existing.collections.includes(collection)) existing.collections.push(collection);
        }
        if (existing.collection === PUBLIC_ARCHIVE_COLLECTION && incoming.collection !== PUBLIC_ARCHIVE_COLLECTION) {
          existing.collection = incoming.collection;
        }
        continue;
      }

      deduplicated.set(item.sha, incoming);
    }
  }

  const documents = Array.from(deduplicated.values()).sort((a, b) => {
    const dateComparison = (b.date ?? "").localeCompare(a.date ?? "");
    if (dateComparison) return dateComparison;
    return a.title.localeCompare(b.title);
  });

  const slugCounts = new Map<string, number>();
  for (const document of documents) {
    const base = slugify([document.date, document.title].filter(Boolean).join(" "));
    const seen = slugCounts.get(base) ?? 0;
    slugCounts.set(base, seen + 1);
    document.slug = seen ? `${base}-${seen + 1}` : base;
    document.href = `/record/document/${document.slug}`;
  }

  return documents;
}

function toPublicDocument(document: InternalDocument): PublicDocument {
  const {
    sourceRepository: _sourceRepository,
    sourceBranch: _sourceBranch,
    sourcePath: _sourcePath,
    sourceSha: _sourceSha,
    ...publicDocument
  } = document;
  return publicDocument;
}

export async function getPublicDocuments(): Promise<PublicDocument[]> {
  return (await getInternalDocuments()).map(toPublicDocument);
}

export async function getPublicDocumentBySlug(slug: string): Promise<PublicDocument | null> {
  const document = (await getInternalDocuments()).find((item) => item.slug === slug);
  return document ? toPublicDocument(document) : null;
}

export async function getInternalDocumentBySlug(slug: string): Promise<InternalDocument | null> {
  return (await getInternalDocuments()).find((item) => item.slug === slug) ?? null;
}

export function getDocumentOriginUrl(document: InternalDocument) {
  const cdnBase = process.env.DOCUMENT_CDN_BASE_URL?.replace(/\/+$/, "");
  if (cdnBase) {
    return `${cdnBase}/${encodeURIComponent(document.slug)}.pdf`;
  }

  return `https://raw.githubusercontent.com/${document.sourceRepository}/${document.sourceBranch}/${encodeRepositoryPath(document.sourcePath)}`;
}
