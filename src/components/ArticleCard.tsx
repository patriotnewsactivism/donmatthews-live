/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
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
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] transition hover:-translate-y-0.5 hover:border-[#c9a84c]/35">
      {image ? (
        <Link href={`/updates/${post.slug}`} className={`block overflow-hidden bg-[#111] ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
      ) : null}

      <div className={compact ? "p-5" : "p-6 sm:p-7"}>
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

        <Link href={`/updates/${post.slug}`} className="mt-5 inline-flex text-sm font-black text-[#c9a84c]">
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
