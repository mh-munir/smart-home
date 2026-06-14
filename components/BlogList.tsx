"use client";

import React, { useState, useMemo } from "react";
import BlogCard, { BlogArticle } from "./BlogCard";

export default function BlogList({ articles = [], pageSize = 12 }: { articles?: BlogArticle[]; pageSize?: number }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((articles || []).length / pageSize));

  const currentArticles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (articles || []).slice(start, start + pageSize);
  }, [articles, page, pageSize]);

  function goto(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentArticles.map((article) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <nav aria-label="Pagination" className="inline-flex items-center space-x-2">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 rounded border disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => goto(p)}
                aria-current={p === page ? "page" : undefined}
                className={`px-3 py-2 rounded ${p === page ? "bg-teal-500 text-white" : "bg-white border"}`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => goto(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </>
  );
}
