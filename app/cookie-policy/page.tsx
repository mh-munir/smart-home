import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Cookie Policy - Home Smart Products",
  description:
    "Cookie Policy for Home Smart Products. Learn how we use cookies and tracking technologies.",
  alternates: {
    canonical: `${SITE_URL}/cookie-policy`,
  },
  openGraph: {
    title: "Cookie Policy - Home Smart Products",
    description:
      "Cookie Policy for Home Smart Products. Learn how we use cookies and tracking technologies.",
    url: `${SITE_URL}/cookie-policy`,
    type: "website",
  },
};

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Cookie Policy</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-gray-600">
              Last Updated: June 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They allow websites to remember information about your visit, such as your preferred language and other settings. Cookies make the interaction between you and the website smoother and more efficient.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Why We Use Cookies</h2>
              <p>
                {SITE_NAME} uses cookies for several important purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Performance Cookies:</strong> Improve website loading times and functionality</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising and affiliate tracking</li>
                <li><strong>Social Media Cookies:</strong> Enable social media sharing functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Session Cookies</h3>
              <p>
                These temporary cookies are deleted when you close your browser. They help us manage your session on our website.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Persistent Cookies</h3>
              <p>
                These cookies remain on your device for a specified period. They remember your preferences and login information.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 First-Party Cookies</h3>
              <p>
                Set directly by our website to improve user experience and track website analytics.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.4 Third-Party Cookies</h3>
              <p>
                Set by external services including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics - for website traffic analysis</li>
                <li>Amazon Affiliate Program - for commission tracking</li>
                <li>Advertising networks - for personalized ads</li>
                <li>Social media platforms - for sharing functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Specific Cookies and Their Purpose</h2>
              
              <div className="mt-6 border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold mb-2">Google Analytics Cookies</h4>
                <p className="text-sm">Track user behavior, page views, and website performance. Duration: 2 years</p>
              </div>

              <div className="mt-4 border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold mb-2">Amazon Affiliate Cookies</h4>
                <p className="text-sm">Track clicks and purchases through Amazon affiliate links. Duration: 24 hours</p>
              </div>

              <div className="mt-4 border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold mb-2">Preference Cookies</h4>
                <p className="text-sm">Remember your choices and settings on our website. Duration: Variable</p>
              </div>

              <div className="mt-4 border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                <p className="text-sm">Used to deliver targeted advertisements based on your interests. Duration: Variable</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Cookie Management</h2>
              <p>
                Most browsers allow you to control cookies through settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accept or reject cookies from our website</li>
                <li>Delete cookies currently stored on your device</li>
                <li>Block cookies from being stored in the future</li>
                <li>Receive notification when new cookies are set</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Note:</strong> Disabling cookies may affect your experience on our website and prevent certain features from working properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Browser Settings</h2>
              <p>
                For detailed instructions on managing cookies in your browser:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chrome: https://support.google.com/chrome/answer/95647</li>
                <li>Firefox: https://support.mozilla.org/en-US/kb/cookies</li>
                <li>Safari: https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac</li>
                <li>Edge: https://support.microsoft.com/en-us/microsoft-edge/manage-cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Do Not Track</h2>
              <p>
                Some browsers include a "Do Not Track" feature. Our website respects your privacy preferences. However, not all third-party services respond to Do Not Track signals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at:
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
