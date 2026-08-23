import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { FlagshipPage, PageHero } from "@/components/FlagshipShell";
import { getAllPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Articles & Updates | Don Matthews",
  description: "Investigative reporting, legal updates, technology, music, and public-record work from Don Matthews.",
  alternates: { canonical: "/updates" },
};

const PER_PAGE = 6;

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  let posts = [];

  try {
    posts = await getAllPosts();
  } catch {
    posts = [];
  }

  const requestedPage = Number(searchParams?.page ?? "1");
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), totalPages)
    : 1;
  const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <FlagshipPage>
      <PageHero
        eyebrow="ARTICLES & UPDATES"
        title="Reporting without the endless scroll."
        intro="Six stories at a time. Each card gives you the scene, the headline, and enough context to decide whether to open the full article."
      />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        {visible.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {visible.map((post) => <ArticleCard key={post.ID} post={post} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#101010] p-8 text-white/55">
            The article feed is temporarily unavailable. Please try again shortly.
          </div>
        )}

        {posts.length > PER_PAGE ? (
          <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7" aria-label="Article pagination">
            <div>
              {page > 1 ? (
                <Link href={page === 2 ? "/updates" : `/updates?page=${page - 1}`} className="font-bold text-[#c9a84c]">← Newer</Link>
              ) : <span />}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                <Link
                  key={number}
                  href={number === 1 ? "/updates" : `/updates?page=${number}`}
                  aria-current={number === page ? "page" : undefined}
                  className={`grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm font-bold transition ${
                    number === page
                      ? "bg-[#c9a84c] text-black"
                      : "border border-white/10 text-white/50 hover:border-[#c9a84c]/40 hover:text-white"
                  }`}
                >
                  {number}
                </Link>
              ))}
            </div>

            <div>
              {page < totalPages ? (
                <Link href={`/updates?page=${page + 1}`} className="font-bold text-[#c9a84c]">Older →</Link>
              ) : <span />}
            </div>
          </nav>
        ) : null}
      </section>
    </FlagshipPage>
  );
}
