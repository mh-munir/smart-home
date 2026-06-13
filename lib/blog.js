// Minimal blog utilities (plain JavaScript) to avoid TypeScript parsing issues in Turbopack
export const blogArticles = [];

export function getBlogArticle(slug) {
  if (!slug) return null;
  return blogArticles.find((a) => a && a.slug === slug) || null;
}

export function getLatestArticles(limit = 3) {
  return blogArticles
    .slice()
    .sort((a, b) => {
      const da = new Date(a?.date || 0).getTime();
      const db = new Date(b?.date || 0).getTime();
      return db - da;
    })
    .slice(0, limit)
    .map((a) => ({
      id: a.id || a.slug,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || "",
      content: a.content,
      author: a.author,
      date: a.date,
      category: a.category,
      readTime: a.readTime || 5,
      featured: a.featured || false,
      image: a.image,
      tags: a.tags || [],
    }));
}

export function getAllBlogCategories() {
  const cats = blogArticles.map((a) => a && a.category).filter(Boolean);
  return Array.from(new Set(cats)).sort();
}

export function getBlogArticlesByCategory(category) {
  if (!category) return [];
  return blogArticles.filter((a) => (a && a.category || "").toString().toLowerCase() === category.toString().toLowerCase());
}
