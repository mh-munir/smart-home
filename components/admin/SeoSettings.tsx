'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateSlug } from '@/utils/generateSlug';

interface SeoSettingsProps {
  /** The title used to auto-generate the slug */
  title: string;
  /** Current slug value */
  slug: string;
  /** Called when slug changes */
  onSlugChange: (slug: string) => void;
  /** Current meta title */
  metaTitle: string;
  /** Called when meta title changes */
  onMetaTitleChange: (value: string) => void;
  /** Current meta description */
  metaDescription: string;
  /** Called when meta description changes */
  onMetaDescriptionChange: (value: string) => void;
  /** Current canonical URL */
  canonicalUrl: string;
  /** Called when canonical URL changes */
  onCanonicalUrlChange: (value: string) => void;
  /** 'product' or 'blog' — used for slug validation */
  type: 'product' | 'blog';
  /** The base path for URL preview, e.g. '/products' or '/blog' */
  basePath: string;
  /** If editing, the existing document ID to exclude from uniqueness check */
  excludeId?: string;
  /** Whether the slug was auto-generated (controls auto-regeneration on title change) */
  autoGenerateSlug?: boolean;
}

export default function SeoSettings({
  title,
  slug,
  onSlugChange,
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  canonicalUrl,
  onCanonicalUrlChange,
  type,
  basePath,
  excludeId,
  autoGenerateSlug = true,
}: SeoSettingsProps) {
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(false);
  const [userEditedSlug, setUserEditedSlug] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastTitleRef = useRef(title);

  // Auto-generate slug from title when title changes (if user hasn't manually edited)
  useEffect(() => {
    if (autoGenerateSlug && !userEditedSlug && title !== lastTitleRef.current) {
      const generated = generateSlug(title);
      onSlugChange(generated);
    }
    lastTitleRef.current = title;
  }, [title, autoGenerateSlug, userEditedSlug, onSlugChange]);

  // Validate slug uniqueness with debounced API call
  const validateSlug = useCallback(
    async (slugToCheck: string) => {
      if (!slugToCheck) {
        setSlugAvailable(null);
        return;
      }

      setValidating(true);
      try {
        const params = new URLSearchParams({
          slug: slugToCheck,
          type,
        });
        if (excludeId) params.set('excludeId', excludeId);

        const res = await fetch(`/api/validate-slug?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSlugAvailable(data.available);
        } else {
          setSlugAvailable(null);
        }
      } catch {
        setSlugAvailable(null);
      } finally {
        setValidating(false);
      }
    },
    [type, excludeId]
  );

  // Debounced slug validation
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (slug) {
      debounceRef.current = setTimeout(() => validateSlug(slug), 500);
    } else {
      setSlugAvailable(null);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [slug, validateSlug]);

  const handleSlugInput = (value: string) => {
    setUserEditedSlug(true);
    onSlugChange(generateSlug(value));
  };

  const metaTitleLength = metaTitle.length;
  const metaDescLength = metaDescription.length;

  const SITE_URL =
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://smart-home-products.vercel.app');

  return (
    <section className="p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500 space-y-6">
      <h3 className="text-xl font-bold text-blue-800">🔍 SEO Settings</h3>

      {/* URL Slug */}
      <div>
        <label htmlFor="seo-slug" className="block text-sm font-bold text-gray-700 mb-2">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <input
          id="seo-slug"
          type="text"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono text-sm"
          placeholder="e.g., smart-home-security-camera"
          value={slug}
          onChange={(e) => handleSlugInput(e.target.value)}
          required
        />

        {/* Slug validation indicator */}
        <div className="mt-2 flex items-center gap-2">
          {validating && (
            <span className="text-xs text-gray-500">Checking availability...</span>
          )}
          {!validating && slug && slugAvailable === true && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Slug is available
            </span>
          )}
          {!validating && slug && slugAvailable === false && (
            <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Slug already exists
            </span>
          )}
          {!validating && !slug && (
            <span className="text-xs text-gray-400">Enter a slug above</span>
          )}
        </div>

        {/* URL Preview */}
        {slug && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <p className="text-sm text-blue-600 font-mono break-all">
              {SITE_URL}{basePath}/{slug}
            </p>
          </div>
        )}
      </div>

      {/* Meta Title */}
      <div>
        <label htmlFor="seo-meta-title" className="block text-sm font-bold text-gray-700 mb-2">
          Meta Title
        </label>
        <input
          id="seo-meta-title"
          type="text"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="e.g., Smart Home Security Camera - Best Price 2024"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          maxLength={70}
        />
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              metaTitleLength >= 50 && metaTitleLength <= 60
                ? 'text-green-600'
                : metaTitleLength > 60
                ? 'text-red-500'
                : 'text-gray-400'
            }`}
          >
            {metaTitleLength}/60 characters
          </span>
          {metaTitleLength >= 50 && metaTitleLength <= 60 && (
            <span className="text-xs text-green-600">✓ Recommended length</span>
          )}
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label htmlFor="seo-meta-desc" className="block text-sm font-bold text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          id="seo-meta-desc"
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Brief description for search engine results..."
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          maxLength={200}
        />
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              metaDescLength >= 150 && metaDescLength <= 160
                ? 'text-green-600'
                : metaDescLength > 160
                ? 'text-red-500'
                : 'text-gray-400'
            }`}
          >
            {metaDescLength}/160 characters
          </span>
          {metaDescLength >= 150 && metaDescLength <= 160 && (
            <span className="text-xs text-green-600">✓ Recommended length</span>
          )}
        </div>
      </div>

      {/* Canonical URL */}
      <div>
        <label htmlFor="seo-canonical" className="block text-sm font-bold text-gray-700 mb-2">
          Canonical URL <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          id="seo-canonical"
          type="url"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Leave empty to use the default URL"
          value={canonicalUrl}
          onChange={(e) => onCanonicalUrlChange(e.target.value)}
        />
      </div>
    </section>
  );
}