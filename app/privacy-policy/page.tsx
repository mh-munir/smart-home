import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy - Home Smart Products",
  description:
    "Privacy Policy for Home Smart Products. Learn how we collect, use, and protect your personal data.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy - Home Smart Products",
    description:
      "Privacy Policy for Home Smart Products. Learn how we collect, use, and protect your personal data.",
    url: `${SITE_URL}/privacy-policy`,
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-gray-600">
              Last Updated: June 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to {SITE_NAME} ("we," "us," "our," or "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy outlines our practices regarding the collection, use, and safeguarding of your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (name, email, phone number)</li>
                <li>Information submitted through contact forms</li>
                <li>Newsletter subscription details</li>
                <li>Comments and feedback on articles</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and operating system</li>
                <li>IP address and location data</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring website information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Third-Party Information</h3>
              <p>
                We may receive information from third-party sources including analytics providers, advertising partners, and affiliate networks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our website and services</li>
                <li>To send newsletters and promotional content (with your consent)</li>
                <li>To respond to your inquiries and requests</li>
                <li>To analyze website usage and optimize user experience</li>
                <li>To prevent fraud and ensure security</li>
                <li>To comply with legal obligations</li>
                <li>To facilitate affiliate marketing and referral programs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies, web beacons, and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember user preferences</li>
                <li>Analyze website traffic and behavior</li>
                <li>Enable affiliate tracking and marketing</li>
                <li>Personalize content and advertisements</li>
              </ul>
              <p className="mt-4">
                Please refer to our Cookie Policy for more detailed information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Third-Party Services</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Google Analytics</h3>
              <p>
                We use Google Analytics to track website traffic and user behavior. Google Analytics may collect information about your visits using cookies.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Amazon Affiliate Program</h3>
              <p>
                This website is a participant in the Amazon Services LLC Associates Program. We may earn affiliate commissions from product links.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Advertising Partners</h3>
              <p>
                We work with advertising partners who may track your online activity across websites to display targeted advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. However, we may share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Affiliate marketing partners (for commission tracking)</li>
                <li>Analytics and service providers</li>
                <li>Legal authorities (when required by law)</li>
                <li>Business successors (in case of merger or acquisition)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights and Choices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Opt-out of marketing emails</li>
                <li>Disable cookies in your browser settings</li>
                <li>Request access to your personal information</li>
                <li>Request correction or deletion of information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Changes will be effective upon posting to the website. Your continued use of our site constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> support@smarthomeproducts.com
              </p>
              <p>
                <strong>Website:</strong> {SITE_URL}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
