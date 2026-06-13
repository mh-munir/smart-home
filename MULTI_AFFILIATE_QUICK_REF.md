# 🚀 Multi-Affiliate Quick Reference

Quick reference for the multi-affiliate system.

## Quick Commands

```bash
# Migrate existing products to multi-affiliate format
npm run migrate:multi-affiliate

# Add affiliate links to products
npm run add:affiliate-links

# Start development server
npm run dev

# Check analytics for all products
curl http://localhost:3000/api/affiliate-stats

# Check analytics for a specific product
curl "http://localhost:3000/api/affiliate-stats?productId=PRODUCT_ID"
```

## Affiliate Priority

When multiple links are active:

1. Primary button (prominent) → highest priority
2. Dropdown → other active links

```javascript
// Example priority settings
amazon: { priority: 1 },      // "Buy on Amazon" button
aliexpress: { priority: 2 },  // dropdown
ebay: { priority: 3 }         // dropdown
```

## Affiliate URL Formats

```
Amazon:     https://amazon.com/dp/ASIN?tag=YOUR-TAG-20
AliExpress: https://aliexpress.com/item/123.html?aff_fcid=YOUR-ID
eBay:       https://ebay.com/itm/123?campid=YOUR-CAMPAIGN-ID
Flipkart:   https://flipkart.com/path/to/product?affid=YOUR-ID
Daraz:      https://daraz.com.bd/path/to/product?aff_track=YOUR-ID
Rokomari:   https://rokomari.com/path/to/product?aff_id=YOUR-ID
AJIO:       https://ajio.com/path/to/product?utm_medium=YOUR-ID
```

## Database Structure

```javascript
// Product document example
{
  _id: ObjectId,
  title: "Smart LED Bulb",
  slug: "smart-led-bulb",
  affiliateLinks: {
    amazon: {
      url: "https://amazon.com/dp/B0123...",
      enabled: true,
      priority: 1,
      clicks: 250,
      conversions: 12
    },
    aliexpress: {
      url: "https://aliexpress.com/item/...",
      enabled: true,
      priority: 2,
      clicks: 180,
      conversions: 8
    }
  },
  clicks: 430,
  conversions: 20,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Tracking

```
POST /api/track-conversion
Body: {
  productId: "string",
  affiliateId: "amazon|aliexpress|ebay|flipkart|daraz|rokomari|ajio",
  type: "click|conversion"
}
```

### Analytics

```
GET /api/affiliate-stats
GET /api/affiliate-stats?productId=PRODUCT_ID
```

## Usage in React

### Get active affiliate links

```javascript
import { getActiveAffiliateLinks } from '@/lib/affiliate-utils';

const links = getActiveAffiliateLinks(product.affiliateLinks);
// [{id: 'amazon', name: 'Amazon', url: '...', priority: 1}, ...]
```

### Select best link

```javascript
import { getBestAffiliateLink } from '@/lib/affiliate-utils';

const primary = getBestAffiliateLink(product.affiliateLinks);
// returns highest-priority active link
```

### Track a click

```javascript
import { trackAffiliateClick } from '@/lib/affiliate-utils';

await trackAffiliateClick(productId, 'amazon');
```

### Track a conversion

```javascript
import { trackAffiliateConversion } from '@/lib/affiliate-utils';

await trackAffiliateConversion(productId, 'amazon');
```

## Market-specific Strategy

**For Bangladesh:**
- Daraz (priority 1)
- Rokomari (priority 2)
- AliExpress (priority 3)

**For India:**
- Flipkart (priority 1)
- AJIO (priority 2)
- Amazon (priority 3)

**For global audiences:**
- Amazon (priority 1)
- eBay (priority 2)
- AliExpress (priority 3)

## Commission Comparison

| Network | Commission | Notes |
|---------|------------:|-------|
| Amazon  | 3-10%       | Higher-quality products |
| AliExpress | 2-10%    | Budget-friendly |
| eBay    | 4-8%        | Premium / niche |
| Flipkart| 4-8%        | India focused |
| Daraz   | 3-8%        | Bangladesh focused |
| Rokomari| 5-15%       | Books & gifts |
| AJIO    | 4-8%        | Fashion |

## Troubleshooting

### Link not visible?
1. Check `enabled: true`
2. Ensure `url` is not empty
3. Verify environment variables are set

### Tracking not working?
1. Open browser console (F12)
2. Check network tab for `/api/track-conversion`
3. Confirm response code 200

### Migration failed?

```bash
# Check MongoDB connection
# Ensure MONGODB_URI is set in env
npm run migrate:multi-affiliate
```

## Next Steps

1. ✅ Register with affiliate networks
2. ✅ Add environment variables
3. ✅ Migrate existing products
4. ✅ Add links to new products
5. ⏳ Monitor tracking regularly
6. ⏳ Adjust priorities as needed
7. ⏳ Increase revenue!

---

**Multiple affiliates, higher revenue!** 💰
