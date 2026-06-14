"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [subtitle, setSubtitle] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [favPreview, setFavPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setSubtitle(data.subtitle || "");
          if (data.logo) setLogoPreview(data.logo);
          if (data.favicon) setFavPreview(data.favicon);
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
      const payload = { subtitle };
      if (logoFile) payload.logoBase64 = await readFileAsDataUrl(logoFile);
      if (faviconFile) payload.faviconBase64 = await readFileAsDataUrl(faviconFile);

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        alert("Settings updated");
        setLogoPreview(data.settings.logo || logoPreview);
        setFavPreview(data.settings.favicon || favPreview);
        setLogoFile(null);
        setFaviconFile(null);
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

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">⚙️ Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
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
          <label className="block text-gray-700 font-semibold mb-2">Logo (PNG/JPG, recommended 200x50)</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {logoPreview ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Logo preview</p>
              <img src={logoPreview} alt="logo-preview" className="h-16 object-contain" />
            </div>
          ) : null}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Favicon (ICO/PNG)</label>
          <input type="file" accept="image/*,.ico" onChange={handleFavChange} />
          {favPreview ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Favicon preview</p>
              <img src={favPreview} alt="favicon-preview" className="h-8 w-8 object-contain" />
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
