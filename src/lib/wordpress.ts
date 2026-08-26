const WORDPRESS_SITE = "donmatthewslive.wordpress.com";
const WORDPRESS_API = `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_SITE}`;

export type WordPressTerm = {
  ID: number;
  name: string;
  slug: string;
  description?: string;
};

export type WordPressPost = {
  ID: number;
  date: string;
  modified: string;
  title: string;
  URL: string;
  content: string;
  excerpt: string;
  slug: string;
  status: string;
  featured_image?: string;
  categories?: Record<string, WordPressTerm>;
};

type PostsResponse = {
  found: number;
  posts: WordPressPost[];
};

async function wordpressFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${WORDPRESS_API}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`WordPress API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getAllPosts(): Promise<WordPressPost[]> {
  const data = await wordpressFetch<PostsResponse>(
    "/posts/?number=100&order_by=date&order=DESC&status=publish",
  );
  return data.posts ?? [];
}

export async function getLatestPosts(count = 3): Promise<WordPressPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/**
 * Titles arrive entity-encoded from the API for the same reason category names
 * do, so an undecoded title renders as "Don&#8217;s Case" in the article grid
 * and in the <title> tag.
 */
export function getPostTitle(post: WordPressPost): string {
  return decodeHtmlEntities(post.title);
}

export function getCategoryNames(post: WordPressPost): string[] {
  return Object.values(post.categories ?? {}).map((category) => decodeHtmlEntities(category.name));
}

export function getPostImage(post: WordPressPost): string | null {
  const candidate = post.featured_image || post.content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  if (!candidate) return null;

  try {
    const image = new URL(decodeHtmlEntities(candidate));
    if (image.protocol !== "https:") return null;

    // YouTube's max-resolution endpoint is not guaranteed to exist. A missing
    // thumbnail otherwise leaves a broken image icon in every article grid.
    if (image.hostname === "i.ytimg.com" && image.pathname.endsWith("/maxresdefault.jpg")) {
      return null;
    }

    return image.toString();
  } catch {
    return null;
  }
}

export function stripHtml(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

export function getPostExcerpt(post: WordPressPost): string {
  const excerpt = stripHtml(post.excerpt || "");
  if (excerpt) return excerpt;

  const content = stripHtml(post.content || "");
  return content.length > 320 ? `${content.slice(0, 317).trim()}…` : content;
}

export function getCleanPostContent(post: WordPressPost): string {
  return post.content
    .replace(/<span id=["']more-\d+["']><\/span>/gi, "")
    .replace(/<a class=["']more-link["'][\s\S]*?<\/a>/gi, "");
}

function decodeHtmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
    hellip: "…",
    mdash: "—",
    ndash: "–",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
  };

  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => named[name.toLowerCase()] ?? match);
}
