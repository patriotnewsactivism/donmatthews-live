import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getLatestPosts, type WordPressPost } from "@/lib/wordpress";

export async function LatestArticlesSection() {
  let posts: WordPressPost[] = [];

  try {
    posts = await getLatestPosts(3);
  } catch {
    return null;
  }

  if (!posts.length) return null;

  return (
    <section className="border-y border-white/10 bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">LATEST ARTICLES</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-5xl">Read enough to get hooked. Then go deeper.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/50">Three recent stories from the WordPress editorial library, presented in the same Don Matthews flagship design.</p>
          </div>
          <Link href="/updates" className="shrink-0 font-bold text-[#c9a84c]">View all articles →</Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3 sm:mt-10">
          {posts.map((post) => <ArticleCard key={post.ID} post={post} compact />)}
        </div>
      </div>
    </section>
  );
}
