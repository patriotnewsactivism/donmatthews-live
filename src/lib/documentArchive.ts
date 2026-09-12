const PDF_REPOSITORY = "patriotnewsactivism/PDFs";
const PDF_BRANCH = "main";
const TREE_URL = `https://api.github.com/repos/${PDF_REPOSITORY}/git/trees/${PDF_BRANCH}?recursive=1`;

type GitTreeEntry = {
  path: string;
  type: "blob" | "tree";
  size?: number;
};

type GitTreeResponse = {
  tree?: GitTreeEntry[];
  truncated?: boolean;
};

export type PublicDocument = {
  path: string;
  fileName: string;
  title: string;
  date: string | null;
  year: number | null;
  collection: string;
  size: number | null;
  href: string;
};

function encodeRepositoryPath(path: string) {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

function parseDocument(entry: GitTreeEntry): PublicDocument {
  const parts = entry.path.split("/");
  const fileName = parts.at(-1) ?? entry.path;
  const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})\s*-\s*(.+)\.pdf$/i);
  const fallbackTitle = fileName.replace(/\.pdf$/i, "").replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, "").trim();
  const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : null;
  const title = dateMatch?.[4]?.trim() || fallbackTitle;

  return {
    path: entry.path,
    fileName,
    title,
    date,
    year: date ? Number(date.slice(0, 4)) : null,
    collection: parts.length > 1 ? parts[0] : "Chronological Archive",
    size: typeof entry.size === "number" ? entry.size : null,
    href: `https://github.com/${PDF_REPOSITORY}/blob/${PDF_BRANCH}/${encodeRepositoryPath(entry.path)}`,
  };
}

export async function getPublicDocuments(): Promise<PublicDocument[]> {
  const response = await fetch(TREE_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`PDF archive request failed (${response.status})`);
  }

  const payload = (await response.json()) as GitTreeResponse;
  const entries = (payload.tree ?? []).filter(
    (entry) => entry.type === "blob" && entry.path.toLowerCase().endsWith(".pdf"),
  );

  return entries
    .map(parseDocument)
    .sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
      if (a.date) return -1;
      if (b.date) return 1;
      return a.fileName.localeCompare(b.fileName);
    });
}

export const publicPdfRepositoryUrl = `https://github.com/${PDF_REPOSITORY}`;
