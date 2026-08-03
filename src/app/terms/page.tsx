import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service — Don Matthews",
  description: "Terms of Service for purchases and use of digital products from Don Matthews.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-gold mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: August 3, 2026</p>

          <div className="prose prose-invert prose-gold max-w-none space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By purchasing or using any digital product from Don Matthews (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to these Terms of Service. If you do not agree, do not purchase or use our products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Products and Services</h2>
              <p>
                We sell digital products including but not limited to music, books, software, and bundled packages. All products are delivered electronically. Descriptions of products are provided on the product page and are incorporated into these terms by reference.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Purchases and Payment</h2>
              <p>
                All sales are processed through our third-party payment provider. You are responsible for providing accurate payment information. Prices are listed in U.S. dollars unless otherwise stated and are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Digital Product License</h2>
              <p>
                Upon purchase, you receive a non-exclusive, non-transferable, personal license to use the digital product for your own personal use. You may not redistribute, resell, share, or make the product available to third parties. Reverse engineering, decompiling, or disassembling any software product is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Refund Policy</h2>
              <p>
                Because digital products are delivered instantly and cannot be &quot;returned,&quot; all sales are final. Please review our{" "}
                <a href="/refund-policy" className="text-gold hover:text-gold-light underline">
                  Refund Policy
                </a>{" "}
                for limited exceptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. User Conduct</h2>
              <p>
                You agree not to use our products for any unlawful purpose, to violate any laws in your jurisdiction, or to infringe upon the rights of others. We reserve the right to terminate access to any product if these terms are violated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Intellectual Property</h2>
              <p>
                All content, including music, text, software, graphics, and logos, is the intellectual property of Don Matthews or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
              <p>
                Products are provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that products will be error-free, uninterrupted, or meet your specific requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Don Matthews shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of our products after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
              <p>
                Questions about these Terms of Service? Contact us at{" "}
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
