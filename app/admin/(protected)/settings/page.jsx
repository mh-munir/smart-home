"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SeoModal from "@/components/SeoModal";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [seoOpen, setSeoOpen] = useState(false);
  const router = useRouter();
  const [siteTitle, setSiteTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [adminName, setAdminName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [adminAvatarFile, setAdminAvatarFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [favPreview, setFavPreview] = useState(null);
  const [adminAvatarPreview, setAdminAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { credentials: "same-origin" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load settings");
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error("Not JSON");
        return r.json();
      })
      .then((data) => {
        if (data) {
          setSiteTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setAdminName(data.adminName || "");
          if (data.logo) setLogoPreview(data.logo);
          if (data.favicon) setFavPreview(data.favicon);
          if (data.adminAvatar) setAdminAvatarPreview(data.adminAvatar);
        }
      })
      .catch(() => {});
  }, []);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title: siteTitle, subtitle, adminName };
      if (logoFile) payload.logoBase64 = await readFileAsDataUrl(logoFile);
      if (faviconFile) payload.faviconBase64 = await readFileAsDataUrl(faviconFile);
      if (adminAvatarFile) payload.adminAvatarBase64 = await readFileAsDataUrl(adminAvatarFile);

      const res = await fetch("/api/settings", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        alert("Settings updated");
        setLogoPreview(data.settings.logo || logoPreview);
        setFavPreview(data.settings.favicon || favPreview);
        setAdminAvatarPreview(data.settings.adminAvatar || adminAvatarPreview);
        setLogoFile(null);
        setFaviconFile(null);
        setAdminAvatarFile(null);
        router.refresh();
      } else {
        alert("Error saving settings: " + (data?.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  }

  function handleLogoChange(e) {
    const f = e.target.files?.[0];
    if (f) {
      setLogoFile(f);
      setLogoPreview(URL.createObjectURL(f));
    }
  }

  function handleFavChange(e) {
    const f = e.target.files?.[0];
    if (f) {
      setFaviconFile(f);
      setFavPreview(URL.createObjectURL(f));
    }
  }

  function handleAdminAvatarChange(e) {
    const f = e.target.files?.[0];
    if (f) {
      setAdminAvatarFile(f);
      setAdminAvatarPreview(URL.createObjectURL(f));
    }
  }

  return (
    <div className="p-8 max-w-3xl min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">⚙️ Site Settings</h1>
        <button
          onClick={() => setSeoOpen(true)}
           className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all hover:shadow-lg"
        >
          🔍 SEO Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Site Title</label>
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="The main title of your website"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-sm text-gray-500 mt-1">This title appears in the browser tab and search engines.</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Site Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="A short tagline shown under the site title"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Admin Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="Display name for the admin (e.g. John Doe)"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-sm text-gray-500 mt-1">This name appears in the admin header and sidebar.</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Logo (PNG/JPG, recommended 200x50)</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {logoPreview ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Logo preview</p>
              <Image
                src={logoPreview}
                alt="logo-preview"
                unoptimized
                width={200}
                height={50}
                className="h-16 object-contain"
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Favicon (ICO/PNG)</label>
          <input type="file" accept="image/*,.ico" onChange={handleFavChange} />
          {favPreview ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Favicon preview</p>
              <Image
                src={favPreview}
                alt="favicon-preview"
                unoptimized
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Admin Profile Image</label>
          <p className="text-sm text-gray-500 mb-2">This image will be displayed in the admin header and sidebar.</p>
          <input type="file" accept="image/*" onChange={handleAdminAvatarChange} />
          {adminAvatarPreview ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Avatar preview</p>
              <Image
                src={adminAvatarPreview}
                alt="admin-avatar-preview"
                unoptimized
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      <SeoModal
        isOpen={seoOpen}
        onClose={() => setSeoOpen(false)}
        onSave={() => {
          // SEO settings saved
        }}
      />
    </div>
  );
}
