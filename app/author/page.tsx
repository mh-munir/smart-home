import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Author Profile - Home Smart Products",
  description:
    "Meet the team behind Home Smart Products. Learn about our expert writers and smart home enthusiasts.",
  alternates: {
    canonical: `${SITE_URL}/author`,
  },
  openGraph: {
    title: "Author Profile - Home Smart Products",
    description:
      "Meet the team behind Home Smart Products. Learn about our expert writers and smart home enthusiasts.",
    url: `${SITE_URL}/author`,
    type: "website",
  },
};

export default function Author() {
  const authors = [
    {
      name: "Alex Thompson",
      role: "Founder & Lead Reviewer",
      bio: "Tech enthusiast with 8+ years of smart home experience. Specializing in smart home automation, security systems, and IoT devices.",
      expertise: ["Smart Home Automation", "IoT Security", "Product Testing"],
      image: "👨‍💻",
    },
    {
      name: "Sarah Johnson",
      role: "Senior Writer & Editor",
      bio: "Passionate about making technology accessible. Writes in-depth guides and reviews focused on user experience.",
      expertise: ["Buying Guides", "Smart Speakers", "Smart Lighting"],
      image: "👩‍💼",
    },
    {
      name: "Marcus Lee",
      role: "Technical Specialist",
      bio: "Electronics engineer with expertise in smart home device integration and troubleshooting.",
      expertise: ["Device Integration", "Technical Support", "Setup Guides"],
      image: "👨‍🔧",
    },
    {
      name: "Emily Rodriguez",
      role: "Content Strategist",
      bio: "Data-driven content creator focused on delivering valuable information to our readers.",
      expertise: ["SEO & Analytics", "Content Strategy", "Research"],
      image: "👩‍💻",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              Expert writers and smart home enthusiasts dedicated to helping you find the perfect devices
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {authors.map((author, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-linear-to-r from-teal-500 to-teal-500 h-32 flex items-center justify-center text-6xl">
                  {author.image}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{author.name}</h3>
                  <p className="text-teal-600 font-semibold mb-3">{author.role}</p>
                  <p className="text-gray-700 mb-4">{author.bio}</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Areas of Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {author.expertise.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Our Philosophy */}
          <section className="bg-gray-50 p-8 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Philosophy</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                Our team is united by a simple philosophy: provide honest, in-depth reviews that help people make informed decisions about smart home products.
              </p>
              <p className="text-gray-700 mb-4">
                Every article, guide, and review is backed by thorough research, real-world testing, and genuine expertise. We don't cut corners, and we don't compromise our integrity.
              </p>
              <p className="text-gray-700">
                Whether you're a smart home beginner or an advanced enthusiast, you can trust that our recommendations are based on merit, not affiliate potential.
              </p>
            </div>
          </section>

          {/* What We Do */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">What Our Team Does</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Research & Testing</h3>
                <p className="text-gray-700">
                  We extensively research and test smart home devices to provide accurate, detailed reviews based on real-world performance.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Content Creation</h3>
                <p className="text-gray-700">
                  We create comprehensive guides, tutorials, and articles that help readers understand and choose smart home devices.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data Analysis</h3>
                <p className="text-gray-700">
                  We analyze market trends, customer reviews, and product specifications to provide data-backed recommendations.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Engagement</h3>
                <p className="text-gray-700">
                  We actively engage with our readers, answering questions and incorporating feedback into our content.
                </p>
              </div>
            </div>
          </section>

          {/* Credentials */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Experience</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    <span>20+ years combined smart home expertise</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    <span>5000+ products reviewed and tested</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    <span>Published in industry-leading tech publications</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Specializations</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    <span>Smart home automation systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    <span>IoT security and privacy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    <span>Product integration and compatibility</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Have a Question for Our Team?</h2>
            <p className="mb-6">
              Get in touch with our team directly. We're here to help answer your questions about smart home devices and technology.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
