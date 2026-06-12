import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Affiliate Disclosure - Home Smart Products",
  description:
    "Affiliate Disclosure for Home Smart Products. Learn about our affiliate relationships and partnerships.",
  alternates: {
    canonical: `${SITE_URL}/affiliate-disclosure`,
  },
  openGraph: {
    title: "Affiliate Disclosure - Home Smart Products",
    description:
      "Affiliate Disclosure for Home Smart Products. Learn about our affiliate relationships and partnerships.",
    url: `${SITE_URL}/affiliate-disclosure`,
    type: "website",
  },
};

export default function AffiliateDisclosure() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Affiliate Disclosure</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-gray-600">
              Last Updated: June 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
              <p>
                {SITE_NAME} believes in transparency and honesty in all our business relationships. This Affiliate Disclosure explains our affiliate partnerships and compensations. We are committed to providing honest, unbiased reviews and recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. What is Affiliate Marketing?</h2>
              <p>
                Affiliate marketing is a performance-based advertising program where websites like ours earn commissions by promoting third-party products and services. When you click on an affiliate link and make a purchase, we receive a small commission at no additional cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Our Affiliate Partnerships</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 AliExpress Affiliate Program</h3>
              <p>
                {SITE_NAME} participates in the AliExpress Affiliate Program (Admitad Network). We earn commissions by promoting a wide range of smart home devices, gadgets, and IoT products available on AliExpress.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Products Promoted:</strong> Smart home devices, connected gadgets, IoT sensors, and home automation products</li>
                <li><strong>Commission Rate:</strong> Typically 2-10% depending on product category and performance</li>
                <li><strong>How It Works:</strong> When you click our AliExpress affiliate link and make a purchase, we receive a small commission at no extra cost to you</li>
                <li><strong>Tracking Period:</strong> Standard cookie-based tracking for purchase verification</li>
                <li><strong>Availability:</strong> AliExpress products ship worldwide with standard shipping options</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Amazon Associates Program</h3>
              <p>
                {SITE_NAME} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and related sites.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Products Promoted:</strong> Smart home devices, IoT products, and related accessories</li>
                <li><strong>Commission Rate:</strong> Variable, typically 1-10% depending on product category</li>
                <li><strong>How It Works:</strong> You pay the same price as visiting Amazon directly. We earn a commission.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Other Affiliate Programs</h3>
              <p>
                We may participate in affiliate programs with other retailers and brands that offer smart home products and services. These include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Best Buy Affiliate Program</li>
                <li>Home Depot Affiliate Program</li>
                <li>eBay Partner Network</li>
                <li>ClickBank (for digital products and courses)</li>
                <li>Other smart home device manufacturers and retailers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Select Products</h2>
              <p>
                Our product selections and recommendations are based on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product quality and performance</li>
                <li>Customer reviews and ratings</li>
                <li>Value for money</li>
                <li>Innovation and features</li>
                <li>Compatibility with other smart home systems</li>
              </ul>
              <p className="mt-4">
                We only promote products we genuinely believe provide value to our readers. Affiliate commissions do not influence our editorial independence or recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. How Affiliate Links Are Marked</h2>
              <p>
                We clearly identify affiliate links in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>"*Affiliate Link" notation near the link</li>
                <li>Disclosure at the beginning of articles with affiliate links</li>
                <li>Distinctive styling or highlighting of affiliate links</li>
                <li>Clear statements about affiliate relationships</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Cost Does Not Change</h2>
              <p>
                <strong>Important:</strong> Using our affiliate links does not cost you anything extra. You pay the same price whether you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Click through our link to Amazon or another retailer</li>
                <li>Visit the retailer directly and find the product yourself</li>
              </ul>
              <p className="mt-4">
                The only difference is that we receive a small commission when you purchase through our links, which helps support our website and content creation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. How Affiliate Commissions Support Our Website</h2>
              <p>
                Affiliate commissions help us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keep our website free for all visitors</li>
                <li>Invest in high-quality, original content</li>
                <li>Conduct thorough product research and testing</li>
                <li>Maintain and improve our website infrastructure</li>
                <li>Hire experienced writers and editors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Editorial Independence</h2>
              <p>
                Our editorial team maintains complete independence in all content decisions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We select products based on merit, not affiliate potential</li>
                <li>Negative reviews are published when warranted</li>
                <li>We don't feature inferior products for higher commissions</li>
                <li>Our honest opinions are never compromised by financial relationships</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Non-Affiliate Recommendations</h2>
              <p>
                We also recommend products without affiliate links when appropriate. These recommendations are equally valuable and may be better suited for certain readers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Sponsored Content</h2>
              <p>
                If we publish sponsored content or partner with brands, we clearly disclose the relationship. Sponsored content is always clearly labeled as "Sponsored," "Advertisement," or "Promotional Content."
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Legal Compliance</h2>
              <p>
                This affiliate disclosure complies with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>FTC Endorsement Guidelines</li>
                <li>FTC Affiliate Marketing Guidelines</li>
                <li>Amazon Associates Operating Agreement</li>
                <li>Local and international advertising regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Questions and Feedback</h2>
              <p>
                If you have questions about our affiliate relationships or disclosures, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> support@smarthomeproducts.com
              </p>
              <p>
                <strong>Website:</strong> {SITE_URL}
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2 className="text-xl font-bold mb-4">Thank You</h2>
              <p>
                We appreciate your support and trust. By using our affiliate links, you're helping us continue to provide free, high-quality content about smart home products. Thank you for being part of our community!
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
