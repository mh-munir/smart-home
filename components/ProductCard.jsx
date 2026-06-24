import Image from "next/image";
import AffiliateLinkButton from "./AffiliateLinkButton";
import CompareButton from "./CompareButton";

function getFormattedDate(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(new Date(date));
}

function getAffiliateLinks(product) {
  if (!product?.affiliateLinks || typeof product.affiliateLinks !== "object") return [];

  return Object.entries(product.affiliateLinks).flatMap(([key, value]) => {
    if (!value?.url || !value?.enabled) return [];
    return {
      id: key,
      url: value.url,
      name: key.charAt(0).toUpperCase() + key.slice(1),
    };
  });
}

export default function ProductCard({ product, showBuyButton = true, priority = false }) {
  const formattedDate = getFormattedDate(product?.createdAt);
  const affiliateLinks = getAffiliateLinks(product);
  const mainLink = affiliateLinks[0] || null;

  return (
    <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 transform-gpu hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
      <div className="flex-1 flex flex-col pb-4">
        <div className="relative w-full h-40 bg-linear-to-br from-teal-50 to-teal-100 overflow-hidden">
          <CompareButton product={product} />
          {product?.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              preload={priority}
              loading={priority ? undefined : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl" aria-hidden="true">SH</div>
          )}

          {product?.offer && (
            <div className="absolute top-0 right-0 z-10 overflow-hidden rounded-bl-xl">
              <div className="bg-linear-to-br from-red-500 via-red-600 to-rose-700 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm">
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-90 block leading-tight">Deal</span>
                <span className="text-sm font-extrabold leading-tight block drop-shadow-sm">{product.offer}</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            {product?.category && (
              <span className="text-sm font-semibold text-teal-600 capitalize">
                {product.category}
              </span>
            )}
            {product?.rating && (
              <span className="text-sm text-gray-600">Rating {product.rating}</span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition line-clamp-2">
            {product?.title}
          </h3>

          <div className="flex justify-between mb-2 items-start gap-3">
            {product?.price && (
              <p className="text-lg font-bold text-teal-600 mb-3">{product.price}</p>
            )}
            {formattedDate && <span className="text-gray-500 text-sm shrink-0">{formattedDate}</span>}
          </div>

          {product?.description && (
            <p className="text-gray-600 line-clamp-2 flex-1 text-sm">
              {product.description}
            </p>
          )}
        </div>

        {showBuyButton && (
          <div className="px-4">
            {mainLink ? (
              <AffiliateLinkButton
                href={mainLink.url}
                productId={product?._id}
                affiliateId={mainLink.id}
                affiliateName={mainLink.name}
              />
            ) : (
              <a
                href={`/products/${product?.slug}`}
                className="flex w-full items-center gap-2 text-md font-semibold justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded-md transition shadow-sm"
                aria-label={`More details about ${product?.title}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                More Details
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
