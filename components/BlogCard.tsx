"use client";

import Link from "next/link";
import React from "react";

export interface BlogArticle {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  readTime?: number;
  image?: string;
  category?: string;
}

export default function BlogCard({ article }: { article: BlogArticle }) {
  const image = article.image || "/placeholder.jpg";

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <div className="flex flex-col h-full">
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img src={image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
            <span className="text-sm font-semibold text-teal-600 capitalize">
              {article.category}
            </span>
            <span className="text-sm text-gray-500">{article.readTime} min read</span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

          <div className="mt-auto">
            <div className="w-full bg-teal-500 text-white text-center py-3 rounded-md">View Post</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
