export interface BlogArticle {
  id: string;
  slug: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  date?: string;
  category?: string;
  readTime?: number;
  featured?: boolean;
  image?: string;
  tags?: string[];
}

export declare const blogArticles: BlogArticle[];

export function getBlogArticle(slug: string | undefined): BlogArticle | null;

export function getLatestArticles(limit?: number): BlogArticle[];

export function getAllBlogCategories(): string[];

export function getBlogArticlesByCategory(category: string): BlogArticle[];
