import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service — Don Matthews",
  description: "Terms of Service for purchases and use of digital products from Don Matthews.",
};

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "products", label: "Products & Services" },
  { id: "accounts", label: "Accounts" },
  { id: "purchases", label: "Purchases & Payment" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "license", label: "Digital Product License" },
  { id: "restrictions", label: "Restrictions" },
  { id: "refunds", label: "Refunds" },
  { id: "conduct", label: "User Conduct" },
  { id: "ip", label: "Intellectual Property" },
  { id: "dmca", label: "DMCA / Copyright" },
  { id: "warranties", label: "Disclaimer of Warranties" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "termination", label: "Termination" },
  { id: "governing", label: "Governing Law" },
  { id: "disputes", label: "Dispute Resolution" },
  { id: "changes", label: "Changes to Terms" },
  { id: "general", label: "General Provisions" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-3">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last updated: August 3, 2026</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Table of Contents — sticky sidebar on large screens */}
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
                Please read these Terms of Service carefully before using donmatthews.live or purchasing any digital product. By accessing or using our site and products, you agree to be bound by these terms.
              </div>

              <section id="acceptance">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">01</span> Acceptance of Terms
                </h2>
                <p>
                  By purchasing, downloading, or otherwise using any digital product from Don Matthews (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), or by accessing donmatthews.live (the &quot;Site&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you must not use our Site or purchase our products.
                </p>
                <p className="mt-3">
                  These Terms constitute a legally binding agreement between you and Don Matthews. You represent that you are at least 18 years of age or have the consent of a parent or guardian to use the Site and purchase products.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="products">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">02</span> Products & Services
                </h2>
                <p>
                  We offer digital products including but not limited to music albums and tracks, eBooks and written content, software applications and tools, and bundled packages combining multiple products. All products are delivered electronically — no physical goods are shipped.
                </p>
                <p className="mt-3">
                  Product descriptions, features, and specifications are provided on the respective product pages and are incorporated into these Terms by reference. We reserve the right to modify, discontinue, or limit the availability of any product at any time without prior notice.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="accounts">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">03</span> Accounts
                </h2>
                <p>
                  If you create an account on our Site, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                <p className="mt-3">
                  We reserve the right to suspend or terminate accounts that violate these Terms, remain inactive for an extended period, or are used for fraudulent purposes.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="purchases">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">04</span> Purchases & Payment
                </h2>
                <p>
                  All purchases are processed through our third-party payment provider. You are responsible for providing accurate, current, and complete payment information. We accept major credit cards and other payment methods as displayed at checkout.
                </p>
                <p className="mt-3">
                  All prices are listed in U.S. dollars unless otherwise stated and are subject to change without notice. We reserve the right to correct pricing errors, including the right to cancel orders placed at incorrect prices and to issue a refund where payment has already been collected. Applicable taxes may be added to the purchase price depending on your jurisdiction.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="subscriptions">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">05</span> Subscriptions
                </h2>
                <p>
                  Certain products or services may be offered on a subscription basis (e.g., monthly or annual All-Access Bundles). By subscribing, you authorize us to charge the recurring fee at the stated interval until you cancel. Subscription fees are billed in advance at the beginning of each billing cycle.
                </p>
                <p className="mt-3">
                  You may cancel your subscription at any time through your account settings or by contacting us. Cancellation takes effect at the end of the current billing period — no partial refunds are issued for unused portions of a subscription. We reserve the right to change subscription pricing with at least 30 days&apos; notice before the next billing cycle.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="license">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">06</span> Digital Product License
                </h2>
                <p>
                  Upon purchase, you receive a <strong className="text-white">non-exclusive, non-transferable, perpetual, personal-use license</strong> to use the digital product. This license permits you to:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Download and install the product on devices you own or control</li>
                  <li>Use music and written content for personal, non-commercial listening and reading</li>
                  <li>Use software tools for personal or internal business purposes as described in the product listing</li>
                </ul>
                <p className="mt-3">
                  This license does not permit you to sublicense, redistribute, resell, lease, rent, or otherwise make the product available to any third party.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="restrictions">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">07</span> Restrictions
                </h2>
                <p className="mb-3">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Redistribute, share, upload, or publicly distribute purchased digital products</li>
                  <li>Reverse engineer, decompile, disassemble, or derive source code from any software product</li>
                  <li>Remove, alter, or obscure any proprietary notices, labels, or marks on the product</li>
                  <li>Use the product to develop a competing product or service</li>
                  <li>Circumvent or attempt to circumvent any license-key or activation mechanisms</li>
                  <li>Use the product in any manner that violates applicable local, state, national, or international law</li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="refunds">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">08</span> Refunds
                </h2>
                <p>
                  Because digital products are delivered instantly and cannot be &quot;returned,&quot; <strong className="text-white">all sales are final</strong>. Please review product descriptions and system requirements carefully before purchasing.
                </p>
                <p className="mt-3">
                  Limited exceptions apply — see our{" "}
                  <a href="/refund-policy" className="text-gold hover:text-gold-light underline">
                    Refund Policy
                  </a>{" "}
                  for details on defective products, duplicate charges, and unauthorized purchases.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="conduct">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">09</span> User Conduct
                </h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Use our products or Site for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Infringe upon the intellectual property rights of Don Matthews or any third party</li>
                  <li>Transmit any viruses, malware, or other harmful code through or in connection with our products</li>
                  <li>Attempt to gain unauthorized access to our systems, servers, or other users&apos; accounts</li>
                  <li>Harass, abuse, or harm another person through use of our products or Site</li>
                </ul>
                <p className="mt-3">
                  We reserve the right to investigate and take appropriate legal action against anyone who violates these provisions, including terminating your access to the Site and products and reporting you to law enforcement.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="ip">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">10</span> Intellectual Property
                </h2>
                <p>
                  All content on the Site and within our digital products — including but not limited to music, lyrics, text, software code, graphics, logos, icons, images, audio clips, and video — is the property of Don Matthews or its content suppliers and is protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="mt-3">
                  The &quot;Don Matthews&quot; name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Don Matthews. You must not use such marks without the prior written permission of Don Matthews.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="dmca">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">11</span> DMCA / Copyright
                </h2>
                <p>
                  We respect the intellectual property rights of others and comply with the Digital Millennium Copyright Act (DMCA). If you believe that any content on our Site or within our products infringes a copyright you own or control, please send a written notice to:
                </p>
                <div className="mt-3 border border-white/10 rounded-lg p-4 bg-white/[0.02] text-sm">
                  <p className="text-white font-medium">Copyright Agent</p>
                  <p>
                    <a href="mailto:patriotnewsactivism@gmail.com" className="text-gold hover:text-gold-light underline">
                      patriotnewsactivism@gmail.com
                    </a>
                  </p>
                </div>
                <p className="mt-3 text-sm">
                  Your notice must include: (a) identification of the copyrighted work claimed to be infringed; (b) identification of the allegedly infringing material and its location; (c) your contact information; (d) a statement of good faith belief that the use is not authorized; and (e) a statement under penalty of perjury that you are the copyright owner or authorized to act on the owner&apos;s behalf.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="warranties">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">12</span> Disclaimer of Warranties
                </h2>
                <p>
                  Our Site and all digital products are provided on an <strong className="text-white">&quot;as is&quot; and &quot;as available&quot;</strong> basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
                </p>
                <p className="mt-3">
                  We do not warrant that: (a) the Site or products will be uninterrupted, secure, or error-free; (b) the results obtained from use of the products will be accurate or reliable; or (c) any errors in the products will be corrected. No oral or written information or advice given by us shall create a warranty not expressly stated in these Terms.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="liability">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">13</span> Limitation of Liability
                </h2>
                <p>
                  To the maximum extent permitted by applicable law, in no event shall Don Matthews, its affiliates, directors, employees, partners, or licensors be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages — including but not limited to loss of profits, data, use, goodwill, or other intangible losses — resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-3">
                  <li>Your access to or use of (or inability to access or use) the Site or products</li>
                  <li>Any conduct or content of any third party on the Site</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
                <p className="mt-3">
                  Our total aggregate liability for all claims arising from or related to these Terms or our products shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="indemnification">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">14</span> Indemnification
                </h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Don Matthews and its affiliates, officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney&apos;s fees) arising from: (a) your use of and access to the Site and products; (b) your violation of these Terms; or (c) your violation of any third-party right, including any intellectual property right.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="termination">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">15</span> Termination
                </h2>
                <p>
                  We may terminate or suspend your access to the Site and revoke your license to use any product immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the products will immediately cease.
                </p>
                <p className="mt-3">
                  All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="governing">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">16</span> Governing Law
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in the United States.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="disputes">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">17</span> Dispute Resolution
                </h2>
                <p>
                  In the event of any dispute, controversy, or claim arising out of or relating to these Terms or the breach thereof, the parties agree to first attempt to resolve the dispute informally through good-faith negotiation. If the dispute cannot be resolved informally within thirty (30) days, either party may pursue other remedies available under applicable law.
                </p>
                <p className="mt-3">
                  You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="changes">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">18</span> Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="mt-3">
                  By continuing to access or use our Site and products after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Site or products.
                </p>
              </section>

              <div className="border-t border-white/5" />

              <section id="general">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">19</span> General Provisions
                </h2>
                <ul className="list-none space-y-3">
                  <li>
                    <strong className="text-white">Severability.</strong> If any provision of these Terms is held to be unenforceable or invalid, that provision will be changed and interpreted to accomplish the objectives of that provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
                  </li>
                  <li>
                    <strong className="text-white">Waiver.</strong> No waiver of any term, provision, or condition of these Terms, whether by conduct or otherwise, will be deemed a further or continuing waiver of any such term, provision, or condition.
                  </li>
                  <li>
                    <strong className="text-white">Assignment.</strong> These Terms, and any rights and licenses granted hereunder, may not be transferred or assigned by you, but may be assigned without restriction by Don Matthews.
                  </li>
                  <li>
                    <strong className="text-white">Entire Agreement.</strong> These Terms, together with the Privacy Policy and Refund Policy, constitute the entire agreement between you and Don Matthews regarding the Site and products, and supersede any prior agreements or understandings.
                  </li>
                  <li>
                    <strong className="text-white">Force Majeure.</strong> We shall not be liable for any failure or delay in performance due to causes beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, government actions, terrorism, war, internet outages, or third-party service failures.
                  </li>
                </ul>
              </section>

              <div className="border-t border-white/5" />

              <section id="contact">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-gold font-mono text-sm">20</span> Contact
                </h2>
                <p>
                  Questions about these Terms of Service? Reach out:
                </p>
                <div className="mt-3 border border-white/10 rounded-lg p-4 bg-white/[0.02] text-sm">
                  <p className="text-white font-medium">Don Matthews</p>
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
                  <a href="/privacy-policy" className="text-sm px-4 py-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-lg text-gray-400 hover:text-gold transition-all">
                    Privacy Policy
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
