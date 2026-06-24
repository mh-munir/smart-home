import { headers } from "next/headers";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default async function JsonLd({ data }: JsonLdProps) {
  const rawNonce = (await headers()).get("x-nonce");
  const nonce = rawNonce && rawNonce.length > 0 ? rawNonce : undefined;

  return (
    <script
      suppressHydrationWarning
      {...(nonce ? { nonce } : {})}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
