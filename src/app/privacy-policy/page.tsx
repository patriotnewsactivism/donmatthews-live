import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Don Matthews",
  description: "Privacy Policy for purchases and use of digital products from Don Matthews.",
};

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "legal-basis", label: "Legal Basis for Processing" },
  { id: "third-parties", label: "Third-Party Services" },
  { id: "retention", label: "Data Retention" },
  { id: "security", label: "Data Security" },
  { id: "transfers", label: "International Transfers" },
  { id: "rights", label: "Your Rights" },
  { id: "ccpa", label: "California Privacy Rights" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-3">Privacy Policy</h1>
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
                Your privacy matters to us. This policy explains what data we collect, why we collect it, and what you can do about it. We keep things simple: we collect only what we need, we never sell your data, and we don&apos;t track you for advertising.
              </div>

              <section id="intro">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">01</span> Introduction
                </h2>
                <p>
                  Don Matthews (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have when you visit donmatthews.live (the &quot;Site&quot;) or purchase our digital products.
                </p>
                <p className="mt-3">
                  If you have questions or concerns about this policy or our data practices, please contact us at{" "}
                  <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                    patriotnewsactivism@gmail.com
                  </a>.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="collect">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">02</span> Information We Collect
                </h2>

                <h3 className="text-base font-medium text-white mt-4 mb-2">Personal Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong className="text-white">Identity data:</strong> name, email address</li>
                  <li><strong className="text-white">Payment data:</strong> billing address and payment details (processed by our third-party payment provider — we never store full credit card numbers)</li>
                  <li><strong className="text-white">Communication data:</strong> any messages, support requests, or feedback you send us</li>
                  <li><strong className="text-white">Account data:</strong> username, password hash, and purchase history (if you create an account)</li>
                </ul>

                <h3 className="text-base font-medium text-white mt-6 mb-2">Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong className="text-white">Device data:</strong> browser type and version, operating system, device type, screen resolution</li>
                  <li><strong className="text-white">Usage data:</strong> pages visited, time spent on pages, referring URL, click patterns</li>
                  <li><strong className="text-white">Network data:</strong> IP address, approximate geographic location (country/region level)</li>
                </ul>

                <h3 className="text-base font-medium text-white mt-6 mb-2">Information from Third Parties</h3>
                <p>
                  We may receive information about you from payment processors (e.g., transaction confirmations), analytics providers, and social media platforms if you interact with our content through those services.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="how-we-use">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">03</span> How We Use Your Information
                </h2>
                <p className="mb-3">We use the information we collect for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong className="text-white">Order fulfillment:</strong> process payments, deliver digital products and license keys, send order confirmations</li>
                  <li><strong className="text-white">Customer support:</strong> respond to inquiries, troubleshoot issues, process refund requests</li>
                  <li><strong className="text-white">Site improvement:</strong> analyze usage patterns to improve site performance, content, and user experience</li>
                  <li><strong className="text-white">Security:</strong> detect and prevent fraud, unauthorized access, and other harmful activities</li>
                  <li><strong className="text-white">Legal compliance:</strong> comply with applicable laws, tax obligations, and legal processes</li>
                  <li><strong className="text-white">Communications:</strong> send product updates, security notices, and administrative messages (we do not send marketing emails unless you opt in)</li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="legal-basis">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">04</span> Legal Basis for Processing (EEA/UK)
                </h2>
                <p>If you are located in the European Economic Area or the United Kingdom, we process your personal data under the following legal bases:</p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li><strong className="text-white">Contract performance:</strong> processing necessary to fulfill your order and deliver purchased products</li>
                  <li><strong className="text-white">Legitimate interests:</strong> improving our products, preventing fraud, and maintaining site security — where these interests are not overridden by your rights</li>
                  <li><strong className="text-white">Legal obligation:</strong> complying with tax, accounting, and regulatory requirements</li>
                  <li><strong className="text-white">Consent:</strong> where you have given explicit consent (e.g., opting in to marketing emails) — you may withdraw consent at any time</li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="third-parties">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">05</span> Third-Party Services
                </h2>
                <p>We use the following categories of third-party services:</p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li><strong className="text-white">Payment processing:</strong> secure payment gateways handle all financial transactions — we never see or store complete payment credentials</li>
                  <li><strong className="text-white">Hosting & infrastructure:</strong> cloud hosting providers store and serve our Site and digital products</li>
                  <li><strong className="text-white">Analytics:</strong> privacy-respecting analytics tools help us understand site usage</li>
                  <li><strong className="text-white">Email delivery:</strong> transactional email services deliver order confirmations and support communications</li>
                </ul>
                <p className="mt-3">
                  Each third-party provider has its own privacy policy. We share only the minimum information necessary for them to provide their services. <strong className="text-white">We do not sell, rent, or trade your personal data to any third party.</strong>
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="retention">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">06</span> Data Retention
                </h2>
                <p>
                  We retain personal information only as long as necessary to fulfill the purposes for which it was collected:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li><strong className="text-white">Purchase records:</strong> retained for the life of your account plus applicable tax/legal retention periods (typically 7 years)</li>
                  <li><strong className="text-white">Support communications:</strong> retained for 3 years after the last interaction</li>
                  <li><strong className="text-white">Analytics data:</strong> retained for up to 24 months</li>
                  <li><strong className="text-white">Marketing opt-in records:</strong> retained until you withdraw consent</li>
                </ul>
                <p className="mt-3">
                  When data is no longer needed, it is securely deleted or anonymized.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="security">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">07</span> Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                  <li>Access controls limiting data access to authorized personnel only</li>
                  <li>Regular security reviews and updates</li>
                  <li>Secure password storage using industry-standard hashing</li>
                </ul>
                <p className="mt-3">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="transfers">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">08</span> International Data Transfers
                </h2>
                <p>
                  Our Site is operated from the United States. If you are accessing our Site from outside the U.S., please be aware that your personal data may be transferred to and processed in the United States, which may have different data protection laws than your jurisdiction.
                </p>
                <p className="mt-3">
                  By using our Site or providing your information, you consent to such transfers. We take appropriate safeguards to ensure your data remains protected in accordance with this Privacy Policy.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="rights">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">09</span> Your Rights
                </h2>
                <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li><strong className="text-white">Access:</strong> request a copy of the personal data we hold about you</li>
                  <li><strong className="text-white">Correction:</strong> request correction of inaccurate or incomplete data</li>
                  <li><strong className="text-white">Deletion:</strong> request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
                  <li><strong className="text-white">Portability:</strong> request a machine-readable copy of your data for transfer to another service</li>
                  <li><strong className="text-white">Restriction:</strong> request that we limit processing of your data in certain circumstances</li>
                  <li><strong className="text-white">Objection:</strong> object to processing based on legitimate interests or for direct marketing</li>
                  <li><strong className="text-white">Withdraw consent:</strong> withdraw consent at any time where processing is based on consent</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                    patriotnewsactivism@gmail.com
                  </a>. We will respond within 30 days.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="ccpa">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">10</span> California Privacy Rights (CCPA)
                </h2>
                <p>
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li><strong className="text-white">Right to know:</strong> what personal information we collect, use, and disclose about you</li>
                  <li><strong className="text-white">Right to delete:</strong> request deletion of personal information collected from you</li>
                  <li><strong className="text-white">Right to opt out:</strong> we do not sell personal information — this right is not applicable</li>
                  <li><strong className="text-white">Non-discrimination:</strong> we will not discriminate against you for exercising your CCPA rights</li>
                </ul>
                <p className="mt-3">
                  California residents may exercise these rights by contacting us at the email above. We will verify your identity before processing your request.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="cookies">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">11</span> Cookies & Tracking Technologies
                </h2>
                <p>
                  Our Site may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our Site.
                </p>
                <h3 className="text-base font-medium text-white mt-4 mb-2">Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong className="text-white">Essential cookies:</strong> required for the Site to function (e.g., session management, security)</li>
                  <li><strong className="text-white">Analytics cookies:</strong> help us understand how visitors interact with the Site</li>
                </ul>
                <p className="mt-3">
                  You can control and manage cookies through your browser settings. Note that disabling cookies may affect Site functionality. We do not use cookies for advertising or cross-site tracking purposes.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="children">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">12</span> Children&apos;s Privacy
                </h2>
                <p>
                  Our Site and products are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal data from a child without parental consent, we will take steps to delete that information promptly.
                </p>
                <p className="mt-3">
                  If you believe we may have collected information from a child under 18, please contact us immediately.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="changes">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">13</span> Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Update the &quot;Last updated&quot; date at the top of this page</li>
                  <li>Provide prominent notice on our Site (e.g., a banner or email notification)</li>
                </ul>
                <p className="mt-3">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of the Site after changes take effect constitutes acceptance of the updated policy.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="contact">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">14</span> Contact
                </h2>
                <p>
                  Questions, concerns, or requests regarding this Privacy Policy or our data practices? Reach out:
                </p>
                <div className="mt-3 border border-white/10 rounded-lg p-4 bg-white/[0.02] text-sm">
                  <p className="text-white font-medium">Don Matthews — Privacy</p>
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
                <p className="mt-3 text-sm text-gray-500">
                  If you are unsatisfied with our response to a privacy concern, you may have the right to lodge a complaint with your local data protection authority.
                </p>
              </section>

              {/* Cross-links */}
              <div className="border-t border-white/5 pt-8">
                <p className="text-sm text-gray-500 mb-3">Related policies:</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/terms" className="text-sm px-4 py-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-lg text-gray-400 hover:text-gold transition-all">
                    Terms of Service
                  </a>
                  <a href="/refund-policy" className="text-sm px-4 py-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-lg text-gray-400 hover:text-gold transition-all">
                    Refund Policy
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
