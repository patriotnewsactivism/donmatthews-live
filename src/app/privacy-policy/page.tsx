import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Don Matthews",
  description: "Privacy Policy for purchases and use of digital products from Don Matthews.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-gold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: August 3, 2026</p>

          <div className="prose prose-invert prose-gold max-w-none space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Don Matthews (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights when you visit donmatthews.live or purchase our digital products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="font-medium text-white">Personal Information</p>
              <p>
                When you make a purchase, we may collect your name, email address, and payment information. Payment processing is handled by our third-party payment provider — we do not store full credit card numbers on our servers.
              </p>
              <p className="font-medium text-white mt-4">Usage Data</p>
              <p>
                We may collect non-personal information such as browser type, device type, IP address, and pages visited through standard analytics tools. This data is used solely to improve the site experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and fulfill orders</li>
                <li>Deliver digital products and license keys</li>
                <li>Send order confirmations and support communications</li>
                <li>Improve our website, products, and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
              <p>
                We use third-party services for payment processing, hosting, and analytics. These services have their own privacy policies. We share only the information necessary to provide their services and do not sell your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
              <p>
                We retain personal information only as long as necessary to fulfill the purposes for which it was collected, including satisfying legal, accounting, or reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. To exercise these rights, contact us at the email below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
              <p>
                Our site may use cookies or similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
              <p>
                Our products and services are not directed to individuals under 18. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
              <p>
                Questions about this Privacy Policy? Contact us at{" "}
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
