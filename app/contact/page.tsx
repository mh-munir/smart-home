import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Contact Us - Home Smart Products",
  description:
    "Contact Home Smart Products. Get in touch with our team for questions, feedback, or partnership inquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us - Home Smart Products",
    description:
      "Contact Home Smart Products. Get in touch with our team for questions, feedback, or partnership inquiries.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              We'd love to hear from you. Get in touch with our team today.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="request">Product Review Request</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="correction">Content Correction</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>

              <div className="space-y-8">
                {/* Email */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">
                    <a href="mailto:support@smarthomeproducts.com" className="text-primary-600 hover:underline">
                      support@smarthomeproducts.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">We typically respond within 24 hours</p>
                </div>

                {/* Business Address */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Business Address</h3>
                  <p className="text-gray-700">
                    Home Smart Products<br />
                    Tech Innovation Hub<br />
                    San Francisco, CA 94102<br />
                    United States
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-primary-600 transition">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128V11.41h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.68h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary-600 transition">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a14.168 14.168 0 007.68 2.25c9.216 0 14.253-7.797 14.253-14.252 0-.214-.005-.428-.015-.642a10.012 10.012 0 002.457-2.548z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary-600 transition">
                      <span className="sr-only">YouTube</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How can I submit a product for review?</h3>
                <p className="text-gray-700">
                  Please use the contact form above and select "Product Review Request" from the subject dropdown. Include details about the product and why you think our readers would find it valuable.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Can I partner with {SITE_NAME}?</h3>
                <p className="text-gray-700">
                  We're open to partnerships and collaborations. Please contact us using the form above and select "Partnership Inquiry" for more information.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How can I advertise on the website?</h3>
                <p className="text-gray-700">
                  For advertising inquiries, please reach out to us at support@smarthomeproducts.com with details about your product or service.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">I found an error in an article. How do I report it?</h3>
                <p className="text-gray-700">
                  We appreciate your attention to detail! Please use the contact form and select "Content Correction" to report any inaccuracies.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
