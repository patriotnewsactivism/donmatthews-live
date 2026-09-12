const PDF_REPOSITORY = "patriotnewsactivism/PDFs";
const PDF_BRANCH = "main";

export type PublicDocument = {
  path: string;
  fileName: string;
  title: string;
  date: string;
  year: number;
  filedAt: string;
  court: string;
  docket: string;
  collection: string;
  size: number;
  href: string;
};

/**
 * Fail-closed publication manifest.
 *
 * A PDF belongs here only after visual review confirms that the PDF itself
 * displays a court-generated filed/entered mark containing a date and time.
 * A filename date, signature date, fax header, or "filing ready" label is not
 * proof that a document was entered by a court.
 */
const VERIFIED_COURT_DOCUMENTS = [
  {
    path: "2021-09-20 - State Response To Peremptory Challenge.pdf",
    title: "State Response to Motion for Peremptory Reversal",
    date: "2021-09-20",
    filedAt: "Sep 20, 2021 at 16:52:40",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
    size: 144236,
  },
  {
    path: "2021-12-07 - AGO Motion For Time.pdf",
    title: "Attorney General Motion for Additional Time",
    date: "2021-12-07",
    filedAt: "Dec 7, 2021 at 10:05:31",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
    size: 72837,
  },
  {
    path: "2021-12-15 - Greenlee Grants COA Order.pdf",
    title: "Order Granting Additional Time",
    date: "2021-12-15",
    filedAt: "Dec 15, 2021 at 10:49:07",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
    size: 40334,
  },
  {
    path: "2022-01-05 - Appellee Brief Filed In COA.pdf",
    title: "Brief of Appellee",
    date: "2022-01-05",
    filedAt: "Jan 5, 2022 at 13:39:13",
    court: "Mississippi Court of Appeals",
    docket: "2020-CP-01259-COA",
    size: 207773,
  },
  {
    path: "2024-12-23 - Order On Motion For Counsel.pdf",
    title: "Order on Motion for Appointment of Counsel",
    date: "2024-12-23",
    filedAt: "Dec 23, 2024 at 14:30:31",
    court: "Supreme Court of Mississippi",
    docket: "2024-TS-00839",
    size: 56422,
  },
  {
    path: "2023-08-11 - Motion For A Franks Hearing Ocr1.pdf",
    title: "Motion for a Franks Hearing",
    date: "2025-02-25",
    filedAt: "Feb 25, 2025 at 12:54 PM",
    court: "County Court No. 3, Galveston County, Texas",
    docket: "MD-0417962",
    size: 4105963,
  },
] as const;

function encodeRepositoryPath(path: string) {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

export async function getPublicDocuments(): Promise<PublicDocument[]> {
  return VERIFIED_COURT_DOCUMENTS.map((document) => ({
    ...document,
    fileName: document.path,
    year: Number(document.date.slice(0, 4)),
    collection: "Court-Stamped Record",
    href: `https://github.com/${PDF_REPOSITORY}/blob/${PDF_BRANCH}/${encodeRepositoryPath(document.path)}`,
  })).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
