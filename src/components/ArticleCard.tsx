import Link from "next/link";
import { ArticleMedia } from "@/components/ArticleMedia";
import {
  getCategoryNames,
  getPostExcerpt,
  getPostImage,
  type WordPressPost,
} from "@/lib/wordpress";

export function ArticleCard({ post, compact = false }: { post: WordPressPost; compact?: boolean }) {
  const image = getPostImage(post);
  const categories = getCategoryNames(post);
  const excerpt = getPostExcerpt(post);

  return (
    <article className="premium-card group flex min-h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.052),rgba(255,255,255,0.012))] transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40">
      <Link href={`/updates/${post.slug}`} className="block overflow-hidden bg-[#111]">
        <ArticleMedia src={image} alt={post.title} compact={compact} eyebrow={categories[0] ?? "THE RECORD"} />
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6 sm:p-7"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {categories.slice(0, 2).map((category) => (
            <span key={category} className="text-[#c9a84c]/75">{category}</span>
          ))}
        </div>

        <h2 className={`${compact ? "mt-3 text-xl sm:text-2xl" : "mt-4 text-2xl sm:text-3xl"} font-black leading-tight tracking-[-0.02em]`}>
          <Link href={`/updates/${post.slug}`} className="transition hover:text-[#c9a84c]">
            {post.title}
          </Link>
        </h2>

        <p className={`${compact ? "mt-3 line-clamp-3 text-sm leading-6" : "mt-4 line-clamp-4 leading-7"} text-white/52`}>
          {excerpt}
        </p>

        <Link href={`/updates/${post.slug}`} className="mt-auto inline-flex pt-5 text-sm font-black text-[#c9a84c] transition group-hover:text-[#e3ca77]">
          Read More →
        </Link>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  }).format(new Date(value));
}
