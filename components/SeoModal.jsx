"use client";

import { useState, useEffect } from "react";

const DEFAULT_SEO = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  ogUrl: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  twitterCreator: "",
  canonicalUrl: "",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  author: "",
  googleSiteVerification: "",
  bingVerification: "",
  yandexVerification: "",
  themeColor: "#4F46E5",
  appleMobileWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
  appleMobileWebAppTitle: "SmartHome",
  applicationName: "SmartHome Affiliate",
  msTileColor: "#4F46E5",
  articleAuthor: "",
  articlePublisher: "",
  geoRegion: "",
  geoPlacename: "",
  geoPosition: "",
  icbm: "",
  extraMetaTags: [],
  structuredData: {
    organizationName: "",
    organizationLogo: "",
    organizationUrl: "",
    sameAs: [],
  },
};

const TABS = [
  { id: "basic", label: "📌 Basic SEO", icon: "📌" },
  { id: "opengraph", label: "🌐 Open Graph", icon: "🌐" },
  { id: "twitter", label: "🐦 Twitter Cards", icon: "🐦" },
  { id: "verification", label: "✅ Verification", icon: "✅" },
  { id: "advanced", label: "⚙️ Advanced", icon: "⚙️" },
  { id: "schema", label: "📊 Schema / Structured Data", icon: "📊" },
  { id: "extra", label: "➕ Extra Meta Tags", icon: "➕" },
  { id: "preview", label: "👁️ Preview", icon: "👁️" },
];

function InputField({ label, value, onChange, placeholder, type = "text", hint, maxLength }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={maxLength}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      ) : type === "color" ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#4F46E5"}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {maxLength && (
        <p className="text-xs text-gray-400 mt-1 text-right">
          {(value || "").length}/{maxLength}
        </p>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function ListField({ label, value = [], onChange, placeholder, hint }) {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input.trim()) {
      onChange([...value, input.trim()]);
      setInput("");
    }
  };

  const removeItem = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          + Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-blue-600 hover:text-red-600 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function GooglePreview({ title, description, url }) {
  const displayTitle = title || "Your Page Title";
  const displayDesc = description || "Your page description will appear here in search results...";
  const displayUrl = url || "https://yourwebsite.com";
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
      <p className="text-xs text-gray-500 mb-2 font-medium">🔍 Google Search Preview</p>
      <p className="text-blue-700 text-lg leading-tight hover:underline cursor-pointer truncate">
        {displayTitle}
      </p>
      <p className="text-green-700 text-sm mt-1 truncate">{displayUrl}</p>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{displayDesc}</p>
    </div>
  );
}

function FacebookPreview({ title, description, image, url }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-4">
      <p className="text-xs text-gray-500 px-4 pt-3 pb-1 font-medium">📘 Facebook Preview</p>
      <div className="bg-gray-200 h-40 flex items-center justify-center">
        {image ? (
          <img src={image} alt="OG" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
      <div className="p-3 bg-gray-100 border-t">
        <p className="text-gray-500 text-xs truncate">{url || "https://yourwebsite.com"}</p>
        <p className="text-gray-900 text-sm font-semibold mt-1 truncate">
          {title || "Page Title"}
        </p>
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
          {description || "Page description..."}
        </p>
      </div>
    </div>
  );
}

function TwitterPreview({ title, description, image, card }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-4">
      <p className="text-xs text-gray-500 px-4 pt-3 pb-1 font-medium">🐦 Twitter Preview</p>
      <div className="p-3">
        <div className={`flex ${card === "summary" ? "" : ""} gap-3`}>
           <div className={`bg-gray-200 rounded-lg overflow-hidden ${card === "summary" ? "w-16 h-16 shrink-0" : "w-full h-48"}`}>
            {image ? (
              <img src={image} alt="Twitter" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <div className={card === "summary" ? "" : "mt-2"}>
            <p className="text-gray-900 text-sm font-semibold truncate">
              {title || "Page Title"}
            </p>
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">
              {description || "Page description..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeoModal({ isOpen, onClose, onSave }) {
  const [seo, setSeo] = useState(DEFAULT_SEO);
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/settings", { credentials: "same-origin" })
        .then((r) => r.json())
        .then((data) => {
          if (data?.seo) {
            setSeo({ ...DEFAULT_SEO, ...data.seo });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const updateField = (field, value) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const updateStructuredData = (field, value) => {
    setSeo((prev) => ({
      ...prev,
      structuredData: { ...prev.structuredData, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seo }),
      });
      const data = await res.json();
      if (data?.success) {
        onSave && onSave(data.settings?.seo);
        alert("SEO settings saved successfully! ✅");
      } else {
        alert("Error: " + (data?.error || "Failed to save"));
      }
    } catch (err) {
      alert("Error saving SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">🔍 SEO Settings Manager</h2>
            <p className="text-blue-100 text-sm mt-0.5">Configure all SEO tags to boost your website visibility</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 px-2 py-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-500">Loading SEO settings...</span>
            </div>
          ) : (
            <>
              {/* Basic SEO Tab */}
              {activeTab === "basic" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Basic SEO Meta Tags</h3>
                  <InputField
                    label="📌 Page Title (meta title)"
                    value={seo.metaTitle}
                    onChange={(v) => updateField("metaTitle", v)}
                    placeholder="e.g., Best Smart Home Products 2026 | SmartHome Affiliate"
                    hint="Recommended: 50-60 characters. This appears as the blue link in Google search results."
                    maxLength={70}
                  />
                  <InputField
                    label="📝 Meta Description"
                    value={seo.metaDescription}
                    onChange={(v) => updateField("metaDescription", v)}
                    placeholder="e.g., Discover the best smart home products with expert reviews..."
                    type="textarea"
                    hint="Recommended: 150-160 characters. This appears below the title in search results."
                    maxLength={300}
                  />
                  <InputField
                    label="🔑 Keywords (comma-separated)"
                    value={seo.keywords}
                    onChange={(v) => updateField("keywords", v)}
                    placeholder="e.g., smart home, smart lock, smart camera, home automation"
                    hint="Add relevant keywords separated by commas. Used by some search engines."
                  />
                  <InputField
                    label="👤 Author"
                    value={seo.author}
                    onChange={(v) => updateField("author", v)}
                    placeholder="e.g., SmartHome Affiliate"
                    hint="The author of the page content."
                  />
                  <InputField
                    label="🔗 Canonical URL"
                    value={seo.canonicalUrl}
                    onChange={(v) => updateField("canonicalUrl", v)}
                    placeholder="e.g., https://yourwebsite.com"
                    hint="The preferred URL for this page. Prevents duplicate content issues."
                  />
                  <SelectField
                    label="🤖 Robots"
                    value={seo.robots}
                    onChange={(v) => updateField("robots", v)}
                    options={[
                      { value: "index, follow", label: "Index, Follow (default)" },
                      { value: "noindex, follow", label: "No Index, Follow" },
                      { value: "index, nofollow", label: "Index, No Follow" },
                      { value: "noindex, nofollow", label: "No Index, No Follow" },
                      { value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1", label: "Index, Follow (unrestricted)" },
                    ]}
                    hint="Controls how search engines crawl and index your page."
                  />
                </div>
              )}

              {/* Open Graph Tab */}
              {activeTab === "opengraph" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Open Graph (Facebook, LinkedIn, etc.)</h3>
                  <InputField
                    label="🌐 OG Title"
                    value={seo.ogTitle}
                    onChange={(v) => updateField("ogTitle", v)}
                    placeholder="Title shown when shared on social media"
                    hint="Recommended: 60-90 characters."
                    maxLength={100}
                  />
                  <InputField
                    label="📝 OG Description"
                    value={seo.ogDescription}
                    onChange={(v) => updateField("ogDescription", v)}
                    placeholder="Description shown when shared on social media"
                    type="textarea"
                    hint="Recommended: 150-200 characters."
                    maxLength={300}
                  />
                  <InputField
                    label="🖼️ OG Image URL"
                    value={seo.ogImage}
                    onChange={(v) => updateField("ogImage", v)}
                    placeholder="https://yourwebsite.com/images/og-image.jpg"
                    hint="Recommended: 1200x630 pixels. This image appears when your page is shared."
                  />
                  <InputField
                    label="🖼️ OG Image Preview"
                    value={seo.ogImage}
                    onChange={() => {}}
                    placeholder=""
                    type="color"
                  />
                  <SelectField
                    label="📋 OG Type"
                    value={seo.ogType}
                    onChange={(v) => updateField("ogType", v)}
                    options={[
                      { value: "website", label: "Website" },
                      { value: "article", label: "Article" },
                      { value: "blog", label: "Blog" },
                      { value: "product", label: "Product" },
                      { value: "profile", label: "Profile" },
                      { value: "video.other", label: "Video" },
                      { value: "music.song", label: "Music" },
                    ]}
                    hint="The type of content being shared."
                  />
                  <InputField
                    label="🔗 OG URL"
                    value={seo.ogUrl}
                    onChange={(v) => updateField("ogUrl", v)}
                    placeholder="https://yourwebsite.com/page"
                    hint="The canonical URL for the shared content."
                  />
                </div>
              )}

              {/* Twitter Tab */}
              {activeTab === "twitter" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Twitter Card Meta Tags</h3>
                  <SelectField
                    label="🃏 Card Type"
                    value={seo.twitterCard}
                    onChange={(v) => updateField("twitterCard", v)}
                    options={[
                      { value: "summary_large_image", label: "Summary Large Image (recommended)" },
                      { value: "summary", label: "Summary (small image)" },
                      { value: "player", label: "Player (video/audio)" },
                      { value: "app", label: "App" },
                    ]}
                    hint="Summary Large Image shows a large preview image on Twitter."
                  />
                  <InputField
                    label="🐦 Twitter Title"
                    value={seo.twitterTitle}
                    onChange={(v) => updateField("twitterTitle", v)}
                    placeholder="Title shown on Twitter"
                    hint="Recommended: 60-70 characters."
                    maxLength={70}
                  />
                  <InputField
                    label="📝 Twitter Description"
                    value={seo.twitterDescription}
                    onChange={(v) => updateField("twitterDescription", v)}
                    placeholder="Description shown on Twitter"
                    type="textarea"
                    hint="Recommended: 150-200 characters."
                    maxLength={200}
                  />
                  <InputField
                    label="🖼️ Twitter Image URL"
                    value={seo.twitterImage}
                    onChange={(v) => updateField("twitterImage", v)}
                    placeholder="https://yourwebsite.com/images/twitter-card.jpg"
                    hint="Recommended: 1200x628 pixels."
                  />
                  <InputField
                    label="👤 Twitter Site (@username)"
                    value={seo.twitterSite}
                    onChange={(v) => updateField("twitterSite", v)}
                    placeholder="@yourwebsite"
                    hint="The @username of the website."
                  />
                  <InputField
                    label="✍️ Twitter Creator (@username)"
                    value={seo.twitterCreator}
                    onChange={(v) => updateField("twitterCreator", v)}
                    placeholder="@yourusername"
                    hint="The @username of the content creator."
                  />
                </div>
              )}

              {/* Verification Tab */}
              {activeTab === "verification" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Search Engine Verification Codes</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add verification codes from search engines to prove ownership and access webmaster tools.
                  </p>
                  <InputField
                    label="🔍 Google Search Console Verification"
                    value={seo.googleSiteVerification}
                    onChange={(v) => updateField("googleSiteVerification", v)}
                    placeholder="e.g., aBcDeFgHiJkLmNoPqRsTuVwXyZ"
                    hint="Find this in Google Search Console → Settings → Ownership verification."
                  />
                  <InputField
                    label="🟡 Bing Webmaster Tools Verification"
                    value={seo.bingVerification}
                    onChange={(v) => updateField("bingVerification", v)}
                    placeholder="e.g., A1B2C3D4E5F6G7H8I9J0"
                    hint="Find this in Bing Webmaster Tools → Site Management."
                  />
                  <InputField
                    label="🔴 Yandex Webmaster Verification"
                    value={seo.yandexVerification}
                    onChange={(v) => updateField("yandexVerification", v)}
                    placeholder="e.g., a1b2c3d4e5f6g7h8"
                    hint="Find this in Yandex Webmaster Tools."
                  />
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === "advanced" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Advanced & Mobile Settings</h3>
                  <InputField
                    label="🎨 Theme Color"
                    value={seo.themeColor}
                    onChange={(v) => updateField("themeColor", v)}
                    placeholder="#4F46E5"
                    type="color"
                    hint="The theme color for the browser address bar on mobile."
                  />
                  <SelectField
                    label="📱 Apple Mobile Web App Capable"
                    value={seo.appleMobileWebAppCapable}
                    onChange={(v) => updateField("appleMobileWebAppCapable", v)}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    hint="Allows the site to be added to the home screen on iOS."
                  />
                  <SelectField
                    label="📱 Apple Status Bar Style"
                    value={seo.appleMobileWebAppStatusBarStyle}
                    onChange={(v) => updateField("appleMobileWebAppStatusBarStyle", v)}
                    options={[
                      { value: "default", label: "Default" },
                      { value: "black", label: "Black" },
                      { value: "black-translucent", label: "Black Translucent" },
                    ]}
                    hint="Style of the iOS status bar when added to home screen."
                  />
                  <InputField
                    label="📱 Apple Mobile Web App Title"
                    value={seo.appleMobileWebAppTitle}
                    onChange={(v) => updateField("appleMobileWebAppTitle", v)}
                    placeholder="SmartHome"
                    hint="Title shown on iOS home screen when added as web app."
                  />
                  <InputField
                    label="📦 Application Name"
                    value={seo.applicationName}
                    onChange={(v) => updateField("applicationName", v)}
                    placeholder="SmartHome Affiliate"
                    hint="The name of the web application."
                  />
                  <InputField
                    label="🟦 MS Tile Color"
                    value={seo.msTileColor}
                    onChange={(v) => updateField("msTileColor", v)}
                    placeholder="#4F46E5"
                    type="color"
                    hint="Background color for Windows tiles."
                  />
                  <hr className="my-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Geo Tags</h3>
                  <InputField
                    label="🌍 Geo Region"
                    value={seo.geoRegion}
                    onChange={(v) => updateField("geoRegion", v)}
                    placeholder="e.g., BD, US, UK"
                    hint="ISO 3166-1 alpha-2 country code."
                  />
                  <InputField
                    label="📍 Geo Placename"
                    value={seo.geoPlacename}
                    onChange={(v) => updateField("geoPlacename", v)}
                    placeholder="e.g., Dhaka, New York"
                    hint="The name of the place."
                  />
                  <InputField
                    label="📌 Geo Position"
                    value={seo.geoPosition}
                    onChange={(v) => updateField("geoPosition", v)}
                    placeholder="e.g., 23.8103;90.4125"
                    hint="Latitude;Longitude format."
                  />
                  <InputField
                    label="🌐 ICBM"
                    value={seo.icbm}
                    onChange={(v) => updateField("icbm", v)}
                    placeholder="e.g., 23.8103, 90.4125"
                    hint="Latitude, Longitude format (used by some search engines)."
                  />
                  <hr className="my-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Article Meta</h3>
                  <InputField
                    label="✍️ Article Author URL"
                    value={seo.articleAuthor}
                    onChange={(v) => updateField("articleAuthor", v)}
                    placeholder="https://yourwebsite.com/author"
                    hint="URL of the article author."
                  />
                  <InputField
                    label="🏢 Article Publisher"
                    value={seo.articlePublisher}
                    onChange={(v) => updateField("articlePublisher", v)}
                    placeholder="https://yourwebsite.com"
                    hint="URL of the publisher."
                  />
                </div>
              )}

              {/* Schema / Structured Data Tab */}
              {activeTab === "schema" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Schema.org Structured Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Structured data helps search engines understand your content and can enable rich snippets in search results.
                  </p>
                  <InputField
                    label="🏢 Organization Name"
                    value={seo.structuredData?.organizationName}
                    onChange={(v) => updateStructuredData("organizationName", v)}
                    placeholder="e.g., SmartHome Affiliate"
                  />
                  <InputField
                    label="🖼️ Organization Logo URL"
                    value={seo.structuredData?.organizationLogo}
                    onChange={(v) => updateStructuredData("organizationLogo", v)}
                    placeholder="https://yourwebsite.com/logo.png"
                  />
                  <InputField
                    label="🔗 Organization URL"
                    value={seo.structuredData?.organizationUrl}
                    onChange={(v) => updateStructuredData("organizationUrl", v)}
                    placeholder="https://yourwebsite.com"
                  />
                  <ListField
                    label="🔗 Social Media URLs (sameAs)"
                    value={seo.structuredData?.sameAs || []}
                    onChange={(v) => updateStructuredData("sameAs", v)}
                    placeholder="https://facebook.com/yourpage"
                    hint="Add all your social media profile URLs."
                  />
                </div>
              )}

              {/* Extra Meta Tags Tab */}
              {activeTab === "extra" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Custom Extra Meta Tags</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {"Add any custom meta tags not covered above. These will be injected into the <head> of your page."}
                  </p>
                  {(seo.extraMetaTags || []).map((tag, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-start bg-gray-50 p-3 rounded-lg border">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={tag.name || ""}
                          onChange={(e) => {
                            const updated = [...(seo.extraMetaTags || [])];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            updateField("extraMetaTags", updated);
                          }}
                          placeholder="name (e.g., author)"
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={tag.content || ""}
                          onChange={(e) => {
                            const updated = [...(seo.extraMetaTags || [])];
                            updated[idx] = { ...updated[idx], content: e.target.value };
                            updateField("extraMetaTags", updated);
                          }}
                          placeholder="content"
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={tag.property || ""}
                          onChange={(e) => {
                            const updated = [...(seo.extraMetaTags || [])];
                            updated[idx] = { ...updated[idx], property: e.target.value };
                            updateField("extraMetaTags", updated);
                          }}
                          placeholder="property (e.g., og:locale)"
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={tag.httpEquiv || ""}
                          onChange={(e) => {
                            const updated = [...(seo.extraMetaTags || [])];
                            updated[idx] = { ...updated[idx], httpEquiv: e.target.value };
                            updateField("extraMetaTags", updated);
                          }}
                          placeholder="http-equiv (e.g., refresh)"
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (seo.extraMetaTags || []).filter((_, i) => i !== idx);
                          updateField("extraMetaTags", updated);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors mt-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      updateField("extraMetaTags", [
                        ...(seo.extraMetaTags || []),
                        { name: "", content: "", property: "", httpEquiv: "" },
                      ]);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    + Add Custom Meta Tag
                  </button>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Search & Social Preview</h3>
                  <GooglePreview
                    title={seo.metaTitle}
                    description={seo.metaDescription}
                    url={seo.canonicalUrl}
                  />
                  <FacebookPreview
                    title={seo.ogTitle || seo.metaTitle}
                    description={seo.ogDescription || seo.metaDescription}
                    image={seo.ogImage}
                    url={seo.ogUrl || seo.canonicalUrl}
                  />
                  <TwitterPreview
                    title={seo.twitterTitle || seo.metaTitle}
                    description={seo.twitterDescription || seo.metaDescription}
                    image={seo.twitterImage || seo.ogImage}
                    card={seo.twitterCard}
                  />
                  <hr className="my-4" />
                  <h4 className="font-bold text-gray-700">📋 Raw HTML Meta Tags</h4>
                  <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-all">
{`<title>${seo.metaTitle || "..."}</title>
<meta name="description" content="${seo.metaDescription || "..."}" />
<meta name="keywords" content="${seo.keywords || "..."}" />
<meta name="author" content="${seo.author || "..."}" />
<meta name="robots" content="${seo.robots || "..."}" />
${seo.canonicalUrl ? `<link rel="canonical" href="${seo.canonicalUrl}" />` : ""}
${seo.googleSiteVerification ? `<meta name="google-site-verification" content="${seo.googleSiteVerification}" />` : ""}
${seo.bingVerification ? `<meta name="msvalidate.01" content="${seo.bingVerification}" />` : ""}
${seo.yandexVerification ? `<meta name="yandex-verification" content="${seo.yandexVerification}" />` : ""}
<meta property="og:title" content="${seo.ogTitle || "..."}" />
<meta property="og:description" content="${seo.ogDescription || "..."}" />
<meta property="og:image" content="${seo.ogImage || "..."}" />
<meta property="og:type" content="${seo.ogType || "website"}" />
<meta property="og:url" content="${seo.ogUrl || "..."}" />
<meta name="twitter:card" content="${seo.twitterCard || "summary_large_image"}" />
<meta name="twitter:title" content="${seo.twitterTitle || "..."}" />
<meta name="twitter:description" content="${seo.twitterDescription || "..."}" />
<meta name="twitter:image" content="${seo.twitterImage || "..."}" />
${seo.twitterSite ? `<meta name="twitter:site" content="${seo.twitterSite}" />` : ""}
${seo.twitterCreator ? `<meta name="twitter:creator" content="${seo.twitterCreator}" />` : ""}
<meta name="theme-color" content="${seo.themeColor || "#4F46E5"}" />
<meta name="apple-mobile-web-app-capable" content="${seo.appleMobileWebAppCapable || "yes"}" />
<meta name="apple-mobile-web-app-status-bar-style" content="${seo.appleMobileWebAppStatusBarStyle || "default"}" />
<meta name="apple-mobile-web-app-title" content="${seo.appleMobileWebAppTitle || "SmartHome"}" />
<meta name="application-name" content="${seo.applicationName || ""}" />
<meta name="msapplication-TileColor" content="${seo.msTileColor || "#4F46E5"}" />
<meta name="geo.region" content="${seo.geoRegion || ""}" />
<meta name="geo.placename" content="${seo.geoPlacename || ""}" />
<meta name="geo.position" content="${seo.geoPosition || ""}" />
<meta name="ICBM" content="${seo.icbm || ""}" />`}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            💡 Changes are saved to <code className="bg-gray-200 px-1 rounded">site-settings.json</code> and apply globally.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
            >
              {saving ? "Saving..." : "💾 Save SEO Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}