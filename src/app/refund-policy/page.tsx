import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund Policy — Don Matthews",
  description: "Refund and return policy for digital products purchased from Don Matthews.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-gold mb-2">Refund Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: August 3, 2026</p>

          <div className="prose prose-invert prose-gold max-w-none space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Digital Products — All Sales Final</h2>
              <p>
                Because digital products (music, books, software, bundles) are delivered instantly upon purchase and cannot be returned, <strong className="text-white">all sales are final</strong>. Please review product descriptions carefully before purchasing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Exceptions</h2>
              <p>We may issue a refund in the following limited circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-white">Defective product:</strong> The downloaded file is corrupted, incomplete, or fundamentally not as described.</li>
                <li><strong className="text-white">Duplicate charge:</strong> You were charged more than once for the same order.</li>
                <li><strong className="text-white">Unauthorized purchase:</strong> A purchase was made without your consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How to Request a Refund</h2>
              <p>
                To request a refund, email us at{" "}
                <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                  patriotnewsactivism@gmail.com
                </a>{" "}
                within <strong className="text-white">14 days</strong> of your purchase. Include:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your order confirmation email or order number</li>
                <li>A description of the issue</li>
                <li>Your preferred resolution (refund or replacement)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Processing Time</h2>
              <p>
                Refund requests are reviewed within 5 business days. If approved, refunds are issued to the original payment method and may take 5–10 business days to appear depending on your financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Software-Specific Terms</h2>
              <p>
                For software products, we may offer troubleshooting support or a replacement license key before issuing a refund. If the software does not function as described on your supported platform after reasonable troubleshooting, a refund will be provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
              <p>
                Questions about this Refund Policy? Contact us at{" "}
                <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                  patriotnewsactivism@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
