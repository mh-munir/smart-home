import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SITE_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: `Terms & Conditions - ${SITE_NAME}`,
  description: `Terms & Conditions for ${SITE_NAME}. Read our terms of service and user agreement.`,
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: `Terms & Conditions - ${SITE_NAME}`,
    description: `Terms & Conditions for ${SITE_NAME}. Read our terms of service and user agreement.`,
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

const prohibitedConduct = [
  "Use the website for any illegal purpose",
  "Copy, republish, or resell our content without permission",
  "Attempt to gain unauthorized access to the website",
  "Interfere with normal website operation",
  "Submit abusive, misleading, or harmful content",
];

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 mb-10">Last Updated: June 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using {SITE_NAME}, you agree to these Terms &
                Conditions. If you do not agree, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Website Content</h2>
              <p>
                Our articles, guides, product comparisons, and recommendations
                are provided for general information. Product details, prices,
                availability, and features may change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Affiliate Links</h2>
              <p>
                {SITE_NAME} may earn commissions when visitors buy products
                through affiliate links. This does not change the price you pay
                and does not guarantee that a product is suitable for every user.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Use of This Website</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                {prohibitedConduct.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Websites</h2>
              <p>
                We link to retailers, affiliate partners, and other third-party
                websites. We are not responsible for their content, policies,
                pricing, security, shipping, or customer service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. No Warranties</h2>
              <p>
                This website is provided on an &quot;as is&quot; basis. We do
                not guarantee that the website will be uninterrupted, error-free,
                or always current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p>
                {SITE_NAME} is not liable for losses, damages, product issues,
                installation problems, or decisions made based on information
                published on this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Changes to These Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of
                the website after changes are posted means you accept the
                updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a href={`mailto:${SITE_EMAIL}`} className="text-teal-600 hover:underline">
                  {SITE_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
