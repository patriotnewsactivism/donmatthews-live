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
    <section className="relative overflow-hidden border-y border-white/10 bg-[linear-gradient(180deg,#0d0d0d,#0a0a0a)]">
      <div className="absolute -right-28 top-16 h-72 w-72 rounded-full border border-[#c9a84c]/[0.055]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/25 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">FROM WE THE PEOPLE NEWS</p>
            <h2 className="display-serif mt-3 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.025em] sm:text-6xl">The reporting behind the record.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/50">Recent reporting pulled directly from the WTP News newsroom: investigations, civil-rights coverage, court filings, public records, and major case developments.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4 text-sm font-bold">
            <Link href="/updates" className="text-[#c9a84c]">Read on DonMatthews.live →</Link>
            <a href="https://www.wtpnews.org" target="_blank" rel="noopener noreferrer" className="text-white/45 transition hover:text-white">Open WTP News ↗</a>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3 sm:mt-10">
          {posts.map((post) => <ArticleCard key={post.ID} post={post} compact />)}
        </div>
      </div>
    </section>
  );
}
