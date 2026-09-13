import { NextRequest } from "next/server";
import { getDocumentOriginUrl, getInternalDocumentBySlug } from "@/lib/documentArchive";

export const runtime = "nodejs";

type RouteContext = {
  params: { slug: string };
};

function contentDisposition(fileName: string, download: boolean) {
  const ascii = fileName.replace(/[^\x20-\x7E]/g, "").replace(/["\\]/g, "-");
  const mode = download ? "attachment" : "inline";
  return `${mode}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const document = await getInternalDocumentBySlug(params.slug);
  if (!document) {
    return new Response("Document not found.", { status: 404 });
  }

  const upstreamHeaders: Record<string, string> = {};
  const range = request.headers.get("range");
  if (range) upstreamHeaders.Range = range;

  const upstream = await fetch(getDocumentOriginUrl(document), {
    headers: upstreamHeaders,
    redirect: "follow",
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("The document could not be loaded.", { status: upstream.status || 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", contentDisposition(document.canonicalFileName, request.nextUrl.searchParams.get("download") === "1"));
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  headers.set("Vary", "Range");

  for (const name of ["accept-ranges", "content-length", "content-range", "etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  if (!headers.has("Accept-Ranges")) headers.set("Accept-Ranges", "bytes");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
