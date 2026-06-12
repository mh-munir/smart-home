import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "About Us - Home Smart Products | Smart Home Experts",
  description:
    "Learn about Home Smart Products. Our mission is to provide honest, expert reviews and guides for the best smart home devices. Trusted by thousands of readers.",
  keywords:
    "about us, smart home experts, product reviews, home automation guides",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us - Home Smart Products",
    description:
      "Learn about Home Smart Products. Our mission is to provide honest, expert reviews and guides for the best smart home devices.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About {SITE_NAME}</h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              Your trusted source for expert smart home reviews, guides, and recommendations
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                At {SITE_NAME}, our mission is to empower people to make informed decisions about smart home technology. We believe that everyone deserves access to honest, comprehensive information about the latest smart home devices, from budget-friendly options to premium systems.
              </p>
              <p className="text-gray-700">
                We're dedicated to simplifying the complex world of home automation and helping our readers find the perfect devices for their lifestyle and budget.
              </p>
            </div>
          </section>

          {/* Vision Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                We envision a world where smart home technology is accessible to everyone, regardless of their technical expertise. Our vision is to:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Provide the most comprehensive and honest smart home reviews on the internet</li>
                <li>Make complex technology easy to understand for beginners and experts alike</li>
                <li>Help people save time and money by finding the right devices for their needs</li>
                <li>Stay at the forefront of smart home innovation and trends</li>
                <li>Build a trusted community of smart home enthusiasts</li>
              </ul>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                {SITE_NAME} was founded with a simple goal: to help people navigate the rapidly growing world of smart home technology. What started as a passion project for smart home enthusiasts has evolved into a trusted resource for hundreds of thousands of readers worldwide.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we've reviewed countless smart home devices, tested integrations, and gathered feedback from our community. This experience has given us unique insights into what makes a great smart home product and what pitfalls to avoid.
              </p>
              <p className="text-gray-700">
                Today, {SITE_NAME} is committed to maintaining the highest standards of integrity, accuracy, and user-focused content.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Honesty & Integrity</h3>
                <p className="text-gray-700">
                  We provide unbiased reviews and honest opinions. Our affiliate relationships never influence our product selections or recommendations.
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expertise</h3>
                <p className="text-gray-700">
                  Our team consists of smart home professionals and tech enthusiasts who thoroughly research and test every product.
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">User-Focused</h3>
                <p className="text-gray-700">
                  We prioritize your needs and preferences in every review and guide we create, regardless of affiliate commissions.
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-700">
                  We clearly disclose affiliate relationships and conflicts of interest. Transparency is fundamental to everything we do.
                </p>
              </div>
            </div>
          </section>

          {/* What We Do */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What We Do</h2>
            <div className="prose prose-lg max-w-none">
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li><strong>In-Depth Product Reviews:</strong> We thoroughly test and review smart home devices, analyzing features, performance, and value.</li>
                <li><strong>Comprehensive Buying Guides:</strong> Our detailed guides help you choose the right product for your specific needs and budget.</li>
                <li><strong>Educational Content:</strong> We provide tutorials, tips, and guides to help you get the most out of your smart home setup.</li>
                <li><strong>Trend Analysis:</strong> We keep you updated on the latest smart home innovations and market trends.</li>
                <li><strong>Comparison Articles:</strong> Side-by-side comparisons help you evaluate different options easily.</li>
              </ul>
            </div>
          </section>

          {/* Team/Author Info */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Team</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                Our team consists of experienced technology writers, product reviewers, and smart home enthusiasts. Each team member brings unique expertise and perspectives to our content.
              </p>
              <p className="text-gray-700 mb-4">
                We're united by a common passion: making smart home technology accessible and understandable for everyone.
              </p>
              <p className="text-gray-700">
                Learn more about our team members on our <a href="/author" className="text-primary-600 hover:underline">Author Profile</a> page.
              </p>
            </div>
          </section>

          {/* Why Trust Us */}
          <section className="bg-gray-50 p-8 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Trust {SITE_NAME}?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">5000+</div>
                <p className="text-gray-700">Products Reviewed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500K+</div>
                <p className="text-gray-700">Monthly Readers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">20+</div>
                <p className="text-gray-700">Years Combined Experience</p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                Have questions, suggestions, or feedback? We'd love to hear from you!
              </p>
              <p className="text-gray-700">
                <a href="/contact" className="text-primary-600 hover:underline font-semibold">Contact us here</a> or email us at <strong>support@smarthomeproducts.com</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
