import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund Policy — Don Matthews",
  description: "Refund and return policy for digital products purchased from Don Matthews.",
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "all-sales-final", label: "All Sales Final" },
  { id: "exceptions", label: "Refund Exceptions" },
  { id: "subscriptions", label: "Subscription Cancellations" },
  { id: "how-to-request", label: "How to Request a Refund" },
  { id: "processing", label: "Processing Time" },
  { id: "software", label: "Software-Specific Terms" },
  { id: "bundles", label: "Bundle Purchases" },
  { id: "chargebacks", label: "Chargebacks & Disputes" },
  { id: "exchanges", label: "Exchanges" },
  { id: "contact", label: "Contact" },
];

export default function RefundPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-3">Refund Policy</h1>
            <p className="text-sm text-gray-500">Last updated: August 3, 2026</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Table of Contents — sticky sidebar */}
            <aside className="lg:w-64 shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold/70 mb-4">On This Page</p>
                <nav className="space-y-1.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-sm text-gray-500 hover:text-gold transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0 max-w-3xl space-y-10 text-gray-300 leading-relaxed">
              {/* Intro callout */}
              <div className="border border-gold/20 bg-gold/5 rounded-lg p-5 text-sm text-gray-400">
                We want you to be happy with your purchase. Because digital products can&apos;t be &quot;returned&quot; the way physical goods can, our refund policy is more limited — but we&apos;re fair. Read on to understand when refunds apply and how to request one.
              </div>

              <section id="overview">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">01</span> Overview
                </h2>
                <p>
                  This Refund Policy applies to all digital products purchased through donmatthews.live, including individual music tracks, albums, eBooks, software applications, and bundled packages. By making a purchase, you acknowledge that you have read and understood this policy.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="all-sales-final">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">02</span> All Sales Final
                </h2>
                <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-5">
                  <p>
                    Because digital products (music, books, software, bundles) are delivered instantly upon purchase and the files can be copied immediately, <strong className="text-white">all sales are final</strong>. Once you have received access to a digital product, it cannot be returned.
                  </p>
                </div>
                <p className="mt-4">
                  We strongly encourage you to review product descriptions, system requirements, track listings, and any available previews carefully before completing your purchase. If you have questions about a product before buying, contact us first.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="exceptions">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">03</span> Refund Exceptions
                </h2>
                <p>We may issue a full or partial refund in the following limited circumstances:</p>

                <div className="mt-4 space-y-4">
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                    <h3 className="text-white font-medium mb-1">Defective or Corrupted Product</h3>
                    <p className="text-sm">
                      The downloaded file is corrupted, incomplete, contains malware, or is fundamentally different from what was described on the product page. We will first attempt to provide a working replacement. If a replacement cannot be provided, a full refund will be issued.
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                    <h3 className="text-white font-medium mb-1">Duplicate Charge</h3>
                    <p className="text-sm">
                      You were charged more than once for the same order due to a technical error. We will refund the duplicate charge(s) in full.
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                    <h3 className="text-white font-medium mb-1">Unauthorized Purchase</h3>
                    <p className="text-sm">
                      A purchase was made using your payment method without your knowledge or consent. We will investigate and, if confirmed, issue a full refund and revoke any associated licenses or access.
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                    <h3 className="text-white font-medium mb-1">Material Misrepresentation</h3>
                    <p className="text-sm">
                      The product is materially different from its description on the product page (e.g., missing major features, wrong format, significantly less content than advertised). We will evaluate each case individually.
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-t border-white/5" />

              <section id="subscriptions">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">04</span> Subscription Cancellations
                </h2>
                <p>
                  For subscription-based products (e.g., monthly or annual All-Access Bundles):
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>You may cancel your subscription at any time — cancellation takes effect at the <strong className="text-white">end of the current billing period</strong></li>
                  <li>No partial refunds are issued for unused portions of a billing cycle</li>
                  <li>If you are charged for a renewal and did not intend to, contact us within <strong className="text-white">48 hours</strong> of the charge — we may issue a courtesy refund if you have not accessed any products during the new billing period</li>
                  <li>After 48 hours of a renewal charge, the standard &quot;all sales final&quot; policy applies</li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="how-to-request">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">05</span> How to Request a Refund
                </h2>
                <p>
                  To request a refund, email us at{" "}
                  <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                    patriotnewsactivism@gmail.com
                  </a>{" "}
                  within <strong className="text-white">14 days</strong> of your purchase date. Include the following information:
                </p>
                <div className="mt-4 border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><strong className="text-white">Order confirmation email</strong> or order number</li>
                    <li><strong className="text-white">Product name</strong> and date of purchase</li>
                    <li><strong className="text-white">Detailed description</strong> of the issue (defective file, duplicate charge, etc.)</li>
                    <li><strong className="text-white">Your preferred resolution:</strong> full refund, partial refund, or replacement product</li>
                    <li><strong className="text-white">Supporting evidence</strong> if applicable (e.g., screenshots of error messages, proof of duplicate charge)</li>
                  </ul>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Requests received after the 14-day window may not be eligible for a refund. We reserve the right to deny refund requests that do not meet the criteria outlined in this policy.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="processing">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">06</span> Processing Time
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02] text-center">
                    <p className="text-2xl font-bold text-gold">5</p>
                    <p className="text-sm text-gray-400 mt-1">Business days to review your request</p>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02] text-center">
                    <p className="text-2xl font-bold text-gold">1–2</p>
                    <p className="text-sm text-gray-400 mt-1">Business days to issue refund after approval</p>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02] text-center">
                    <p className="text-2xl font-bold text-gold">5–10</p>
                    <p className="text-sm text-gray-400 mt-1">Business days for funds to appear (varies by bank)</p>
                  </div>
                </div>
                <p className="mt-4">
                  Refunds are issued to the <strong className="text-white">original payment method</strong>. We cannot issue refunds to a different account, card, or payment method. If the original payment method is no longer available, contact us to discuss alternatives.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="software">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">07</span> Software-Specific Terms
                </h2>
                <p>For software products (e.g., CodeForge, TubeScribe, ChatScream, RepoFinisher):</p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>We will first offer <strong className="text-white">troubleshooting support</strong> to resolve the issue — many problems can be fixed quickly</li>
                  <li>If troubleshooting fails, we may offer a <strong className="text-white">replacement license key</strong> or updated build</li>
                  <li>If the software does not function as described on your supported platform after reasonable troubleshooting (typically 5 business days), a <strong className="text-white">full refund</strong> will be provided</li>
                  <li>Refunds are not available for issues caused by: unsupported operating systems, modified/unofficial versions, user misconfiguration, or failure to meet published system requirements</li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="bundles">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">08</span> Bundle Purchases
                </h2>
                <p>
                  For bundled packages (e.g., the All-Access Bundle):
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>If any individual product within a bundle is defective, we will replace that product first</li>
                  <li>Bundle refunds follow the same criteria as individual product refunds</li>
                  <li>If a bundle refund is approved, <strong className="text-white">all products and access from the bundle must be returned/revoked</strong> — partial bundle refunds are not available</li>
                  <li>The refund amount will be the price actually paid for the bundle, not the sum of individual product prices</li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="chargebacks">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">09</span> Chargebacks & Disputes
                </h2>
                <p>
                  We strongly encourage you to <strong className="text-white">contact us first</strong> if you have any issue with your purchase. Filing a chargeback or payment dispute without first contacting us:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Delays resolution — chargeback investigations take weeks, while we can often resolve issues in days</li>
                  <li>Incurs additional fees for us, which we may pass on if the chargeback is found in our favor</li>
                  <li>May result in immediate termination of your account and revocation of all product licenses</li>
                </ul>
                <p className="mt-3">
                  If you have already filed a chargeback, please also email us so we can respond to the dispute promptly.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="exchanges">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">10</span> Exchanges
                </h2>
                <p>
                  If you purchased the wrong product (e.g., wrong software tier, wrong bundle), we may be able to offer an exchange or credit toward the correct product instead of a refund. Contact us within 14 days of purchase to discuss exchange options.
                </p>
                <p className="mt-3">
                  Exchanges are handled on a case-by-case basis and are at our sole discretion. If the price difference favors us, we will credit the difference. If it favors you, you may need to pay the difference.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="contact">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">11</span> Contact
                </h2>
                <p>
                  Questions about this Refund Policy or need to request a refund? Reach out:
                </p>
                <div className="mt-3 border border-white/10 rounded-lg p-4 bg-white/[0.02] text-sm">
                  <p className="text-white font-medium">Don Matthews — Refunds & Support</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                      patriotnewsactivism@gmail.com
                    </a>
                  </p>
                  <p>
                    Web:{" "}
                    <a href="https://donmatthews.live" className="text-gold hover:text-gold-light underline">
                      donmatthews.live
                    </a>
                  </p>
                </div>
              </section>

              {/* Cross-links */}
              <div className="border-t border-white/5 pt-8">
                <p className="text-sm text-gray-500 mb-3">Related policies:</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/terms" className="text-sm px-4 py-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-lg text-gray-400 hover:text-gold transition-all">
                    Terms of Service
                  </a>
                  <a href="/privacy-policy" className="text-sm px-4 py-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-lg text-gray-400 hover:text-gold transition-all">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
