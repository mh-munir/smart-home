// Minimal Next.js module shims to silence TypeScript language server
// These are fallbacks for editor/TS-server environments when Next's
// bundled type declarations are not being resolved. Prefer removing
// this file once the underlying type resolution is restored.

declare module 'next/link' {
  import * as React from 'react';
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module 'next/image' {
  import * as React from 'react';
  const Image: React.ComponentType<any>;
  export default Image;
}

declare module 'next/navigation' {
  export function notFound(): never;
  export function redirect(url: string): never;
  export function useRouter(): any;
  export function useSearchParams(): any;
  export function useParams(): Record<string, string> | null;
}

declare module 'next/server' {
  export type NextRequest = any;
  export type NextResponse = any;
  export const NextResponse: any;
  export const NextRequest: any;
}

declare module 'next/head' {
  import * as React from 'react';
  const Head: React.ComponentType<any>;
  export default Head;
}
