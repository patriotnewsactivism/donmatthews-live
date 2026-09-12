import AmericanInjusticeBanner from "@/components/AmericanInjusticeBanner";

/**
 * Legacy compatibility wrapper.
 * The homepage now uses AmericanInjusticeBanner directly, but keeping this
 * component prevents stale imports from breaking builds while eliminating the
 * duplicated, outdated hero implementation.
 */
export default function Hero() {
  return <AmericanInjusticeBanner />;
}
