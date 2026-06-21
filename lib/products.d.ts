export interface GetProductsOptions {
  q?: string;
  fallbackOnError?: boolean;
}

export declare function getProducts(opts?: GetProductsOptions): Promise<any[]>;
