export interface GetProductsOptions {
  q?: string;
  category?: string;
  fallbackOnError?: boolean;
}

export declare function getProducts(opts?: GetProductsOptions): Promise<any[]>;

export declare function getAllCategoryNames(): Promise<
  { name: string; slug: string }[]
>;

export declare function getCategoryNameFromSlug(
  slug: string
): Promise<string | null>;

export declare function getProductsByCategory(
  categoryName: string
): Promise<any[]>;
