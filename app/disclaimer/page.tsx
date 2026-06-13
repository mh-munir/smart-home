import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { SITE_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: `Disclaimer - ${SITE_NAME}`,
  description:
    `Disclaimer for ${SITE_NAME}. Important information about product reviews and recommendations.`,
  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },
  openGraph: {
    title: `Disclaimer - ${SITE_NAME}`,
    description:
      `Disclaimer for ${SITE_NAME}. Important information about product reviews and recommendations.`,
    url: `${SITE_URL}/disclaimer`,
    type: "website",
  },
};

export default function Disclaimer() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Disclaimer</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-gray-600">
              Last Updated: June 2026
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mb-8">
              <p className="font-bold text-lg mb-2">Please Read Carefully</p>
              <p>
                This disclaimer contains important information about how you should use the content on {SITE_NAME}. By accessing and using this website, you agree to comply with all terms and conditions outlined below.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. General Disclaimer</h2>
              <p>
                The content provided on {SITE_NAME} is for informational purposes only. We make no representations or warranties of any kind regarding the accuracy, completeness, timeliness, or fitness of any information on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Product Information</h2>
              <p>
                All product information, reviews, specifications, and recommendations are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Based on research and analysis at the time of publication</li>
                <li>Subject to change without notice</li>
                <li>Not guaranteed to be 100% accurate or complete</li>
                <li>Provided &quot;as is&quot; without warranties</li>
              </ul>
              <p className="mt-4">
                We recommend verifying all product information directly with manufacturers before making purchasing decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Product Reviews and Ratings</h2>
              <p>
                Our product reviews are subjective opinions based on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our research and analysis</li>
                <li>Customer feedback and reviews</li>
                <li>Technical specifications</li>
                <li>Value for money assessment</li>
              </ul>
              <p className="mt-4">
                Individual experiences may vary. What works well for us or other users may not be suitable for your specific needs. We encourage you to conduct your own research before purchasing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Affiliate Links and Commissions</h2>
              <p>
                {SITE_NAME} participates in affiliate marketing programs. We may earn commissions from purchases made through our links. However, this does not influence our product selections or recommendations. We only promote products we genuinely believe provide value.
              </p>
              <p className="mt-4">
                Please see our <Link href="/affiliate-disclosure" className="text-teal-600 hover:underline">Affiliate Disclosure</Link> page for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. No Professional Advice</h2>
              <p>
                The content on {SITE_NAME} is NOT:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Professional advice (legal, medical, financial, technical)</li>
                <li>Substitution for consultation with qualified professionals</li>
                <li>Guaranteed to provide specific results</li>
                <li>A representation of expert endorsement</li>
              </ul>
              <p className="mt-4">
                For technical, legal, medical, or financial matters, please consult with qualified professionals. Do not rely solely on our content for important decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Installation and Safety</h2>
              <p>
                When installing or using smart home devices:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Follow manufacturer instructions carefully</li>
                <li>Consult professional installers if needed</li>
                <li>Ensure proper electrical safety</li>
                <li>Check local regulations and building codes</li>
              </ul>
              <p className="mt-4">
                {SITE_NAME} is not responsible for improper installation, configuration, or use of products. Always prioritize safety.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Prices and Availability</h2>
              <p>
                Product prices and availability information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are subject to change without notice</li>
                <li>Vary by location and retailer</li>
                <li>May not be accurate in real-time</li>
              </ul>
              <p className="mt-4">
                Always verify current prices and availability on the retailer&apos;s website before making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Third-Party Links</h2>
              <p>
                {SITE_NAME} contains links to third-party websites. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Content on external websites</li>
                <li>Quality or accuracy of information</li>
                <li>Privacy practices of other sites</li>
                <li>Technical issues with external links</li>
              </ul>
              <p className="mt-4">
                Use third-party websites at your own risk. Please review their privacy policies and terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Technical Issues</h2>
              <p>
                While we strive to maintain accurate and functional website content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The website is provided &quot;as is&quot;</li>
                <li>We don&apos;t guarantee uninterrupted service</li>
                <li>Errors and omissions may occur</li>
                <li>We reserve the right to modify content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
              <p>
                {SITE_NAME} and its owners, operators, and employees shall not be liable for any damages, losses, or injuries resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use or misuse of content</li>
                <li>Product purchases or installations</li>
                <li>Technical errors or website failures</li>
                <li>Third-party content or services</li>
              </ul>
              <p className="mt-4">
                This includes indirect, incidental, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Product Recalls and Safety</h2>
              <p>
                While we strive to include information about product recalls and safety issues, we may not be aware of all recalls immediately. Always:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check manufacturer websites for recalls</li>
                <li>Monitor product safety alerts</li>
                <li>Register products with manufacturers</li>
                <li>Follow safety recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Changes to Disclaimer</h2>
              <p>
                We reserve the right to modify this disclaimer at any time. Changes are effective immediately upon posting. Your continued use of {SITE_NAME} constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
              <p>
                If you have questions about this disclaimer, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> {SITE_EMAIL}
              </p>
              <p>
                <strong>Website:</strong> {SITE_URL}
              </p>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-8 border-l-4 border-gray-300">
              <p className="font-semibold mb-2">Legal Notice:</p>
              <p className="text-sm">
                By using {SITE_NAME}, you acknowledge that you have read and understood this disclaimer and agree to be bound by its terms. If you do not agree with any portion of this disclaimer, please do not use this website.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
