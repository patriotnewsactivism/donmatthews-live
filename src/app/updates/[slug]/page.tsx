import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { FlagshipPage } from "@/components/FlagshipShell";
import {
  getAllPosts,
  getCategoryNames,
  getCleanPostContent,
  getPostBySlug,
  getPostExcerpt,
  getPostImage,
} from "@/lib/wordpress";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const image = getPostImage(post);
  const description = getPostExcerpt(post);

  return {
    title: `${post.title} | Don Matthews`,
    description,
    alternates: { canonical: `/updates/${post.slug}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const categories = getCategoryNames(post);
  const content = getCleanPostContent(post);
  const allPosts = await getAllPosts();
  const related = allPosts.filter((candidate) => candidate.ID !== post.ID).slice(0, 3);

  return (
    <FlagshipPage>
      <article>
        <header className="relative isolate overflow-hidden border-b border-[#c9a84c]/15 bg-[#090909]">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_18%,rgba(201,168,76,0.15),transparent_34%),radial-gradient(circle_at_8%_95%,rgba(201,168,76,0.05),transparent_28%)]" />
          <div className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
            <Link href="/updates" className="text-xs font-black uppercase tracking-[0.18em] text-[#c9a84c]">← Articles & Updates</Link>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category} className="rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/[0.05] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#c9a84c]">
                  {category}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-[2.25rem] font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl sm:tracking-[-0.025em]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/58">{getPostExcerpt(post)}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/35">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>Republished from the WordPress editorial library</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
          <div className="wordpress-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-white/10 bg-[#0d0d0d]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">MORE TO READ</p>
                <h2 className="mt-3 text-3xl font-black sm:text-5xl">Keep going without the endless scroll.</h2>
              </div>
              <Link href="/updates" className="font-bold text-[#c9a84c]">Browse all articles →</Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((candidate) => <ArticleCard key={candidate.ID} post={candidate} compact />)}
            </div>
          </div>
        </section>
      ) : null}
    </FlagshipPage>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  }).format(new Date(value));
}
