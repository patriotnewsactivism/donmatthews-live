export interface ArticleSource {
  name: string;
  home: string;
}

export const SOURCES: ArticleSource[] = [
  { name: "We The People News", home: "https://www.wtpnews.org" },
  { name: "Civil Rights Hub", home: "https://civilrightshub.org" },
];

const FEED_CANDIDATES = [
  (home: string) => `${home}/feed/`,
  (home: string) => `${home}/feed`,
  (home: string) => `${home}/rss`,
  (home: string) => `${home}/?feed=rss2`,
  (home: string) => `${home}/wp-json/wp/v2/posts?per_page=25`,
  (home: string) => `${home}/index.xml`,
];

const ALLOWED_FETCH_HOSTS = new Set(["wtpnews.org", "www.wtpnews.org", "civilrightshub.org", "donmatthews.live", "www.donmatthews.live"]);

export function isAllowedPageFetch(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return ALLOWED_FETCH_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#8220;|&#8216;/g, "\u201c")
    .replace(/&#8221;|&#8217;/g, "\u201d")
    .replace(/&ldquo;|&lsquo;/g, "\u201c")
    .replace(/&rdquo;|&rsquo;/g, "\u201d")
    .replace(/&#8212;|&mdash;/g, "\u2014")
    .replace(/&#8230;|&hellip;/g, "\u2026")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function decodeEntities(text: string): string {
  return stripHtml(text);
}

function tryExtractRssItems(xml: string): Array<{ title: string; link: string; pubDate: string | null; summary: string }> | null {
  if (!/<rss/i.test(xml) && !/<feed/i.test(xml)) return null;
  const items: Array<{ title: string; link: string; pubDate: string | null; summary: string }> = [];
  const itemRe = /<(?:item|entry)[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml)) !== null) {
    const body = match[1];
    const title = decodeEntities(/(?:<title[^>]*>)([\s\S]*?)(?:<\/title>)/i.exec(body)?.[1] ?? "");
    const link = /<link[^>]*href=["']([^"']+)["']/i.exec(body)?.[1]
      ?? /<link[^>]*>([^<]+)<\/link>/i.exec(body)?.[1]
      ?? "";
    const pubDate = /<pubDate[^>]*>([^<]+)<\/pubDate>/i.exec(body)?.[1]
      ?? /<published[^>]*>([^<]+)<\/published>/i.exec(body)?.[1]
      ?? null;
    const summary = decodeEntities(
      /<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i.exec(body)?.[1]
        ?? /<description[^>]*>([\s\S]*?)<\/description>/i.exec(body)?.[1]
        ?? "",
    );
    if (!title || !link) continue;
    items.push({
      title,
      link,
      pubDate: pubDate ? new Date(pubDate).toISOString() : null,
      summary: summary.slice(0, 8000),
    });
  }
  return items.length > 0 ? items : null;
}

function tryExtractWpJson(json: unknown): Array<{ title: string; link: string; pubDate: string | null; summary: string }> | null {
  if (!Array.isArray(json)) return null;
  const items: Array<{ title: string; link: string; pubDate: string | null; summary: string }> = [];
  for (const post of json) {
    const title = stripHtml(String(post?.title?.rendered ?? "")).trim();
    const link = String(post?.link ?? "").trim();
    const pubDate = post?.date ? new Date(String(post.date)).toISOString() : null;
    const summary = stripHtml(String(post?.excerpt?.rendered ?? "")).trim();
    if (!title || !link) continue;
    items.push({ title, link, pubDate, summary: summary.slice(0, 8000) });
  }
  return items.length > 0 ? items : null;
}

export async function fetchFeed(source: ArticleSource): Promise<Array<{ title: string; link: string; pubDate: string | null; summary: string }>> {
  const lastError: string[] = [];
  for (const candidate of FEED_CANDIDATES) {
    const url = candidate(source.home);
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "DonVoiceAgent/1.0 (+https://donmatthews.live)" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.length === 0) continue;
      const rss = tryExtractRssItems(text);
      if (rss) return rss;
      let json: unknown = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
      const wp = tryExtractWpJson(json);
      if (wp) return wp;
    } catch (error) {
      lastError.push(String(error));
    }
  }
  throw new Error(`No usable feed found for ${source.name}: ${lastError.join(" | ") || "all candidates failed"}`);
}

export async function fetchFeedAll(): Promise<{
  rows: Array<{ source: string; url: string; title: string; summary: string; publishedAt: string | null }>;
  errors: string[];
}> {
  const rows: Array<{ source: string; url: string; title: string; summary: string; publishedAt: string | null }> = [];
  const errors: string[] = [];
  for (const source of SOURCES) {
    try {
      const items = await fetchFeed(source);
      for (const item of items) {
        rows.push({
          source: source.name,
          url: item.link,
          title: item.title,
          summary: item.summary,
          publishedAt: item.pubDate,
        });
      }
    } catch (error) {
      errors.push(String(error));
    }
  }
  return { rows, errors };
}

export async function fetchPageText(url: string, maxChars = 8000): Promise<string> {
  if (!isAllowedPageFetch(url)) {
    throw new Error("Only wtpnews.org, civilrightshub.org, and donmatthews.live pages can be fetched.");
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "DonVoiceAgent/1.0 (+https://donmatthews.live)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`Fetch failed with status ${res.status}`);
  }
  const html = await res.text();
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  return text.slice(0, maxChars);
}