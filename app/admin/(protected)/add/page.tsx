'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductForm from '../../../../components/admin/AddForms/ProductForm';
import BlogForm from '../../../../components/admin/AddForms/BlogForm';
import GuideForm from '../../../../components/admin/AddForms/GuideForm';

export default function AdminAddPage() {
  const search = useSearchParams();
  const paramType = search?.get('type');
  const initial = paramType === 'blog' || paramType === 'guide' ? (paramType as any) : 'product';
  const [type, setType] = useState<'product' | 'blog' | 'guide'>(initial);

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">➕ Add Content</h1>
          <div>
            <label className="mr-2 font-medium">Select type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="border rounded px-3 py-2"
            >
              <option value="product">Add product</option>
              <option value="blog">Add blog</option>
              <option value="guide">Add guide</option>
            </select>
          </div>
        </div>

        <div>
          {type === 'product' && <ProductForm />}
          {type === 'blog' && <BlogForm />}
          {type === 'guide' && <GuideForm />}
        </div>
      </div>
    </div>
  );
}
