# Multi-Affiliate System Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                          │
│                   (ProductCard.jsx)                         │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ Buy on Amazon    │ ────────→ affiliate click   │          │
│  │   (Priority 1)   │         │    triggered     │          │
│  └──────────────────┘         └──────────────────┘          │
│                                       │                     │
│  ┌──────────────────┐                 │                     │
│  │ More Options ▼   │                 ▼                     │
│  └──────────────────┘        ┌──────────────────┐          │
│         │                   │  trackAffiliate  │          │
│         ├─ AliExpress       │      Click()     │          │
│         ├─ eBay             └──────────────────┘          │
│         └─ Flipkart                  │                      │
│                                       ▼                      │
└──────────────────────────────────────────────────────────────┘
                                       │
                                       │
                   ┌───────────────────┴──────────────────┐
                   │                                      │
                   ▼                                      ▼
       ┌─────────────────────────┐       ┌──────────────────────┐
       │  /api/track-conversion  │       │ /api/affiliate-stats │
       │    (POST)               │       │   (GET)              │
       └────────┬────────────────┘       └──────────┬───────────┘
                │                                   │
                ▼                                   ▼
       ┌─────────────────────────┐       ┌──────────────────────┐
       │    MongoDB Database     │       │   Analytics Data     │
       │                         │       │                      │
       │ Product {               │       │ Clicks per affiliate │
       │   affiliateLinks: {     │       │ Conversions per link │
       │     amazon: {           │       │ Click through rate   │
       │       clicks: 250      │       └──────────────────────┘
       │       url: "..."      │
       │     },                 │
       │     aliexpress: {      │
       │       clicks: 180      │
       │       url: "..."      │
       │     }                  │
       │   }                    │
       │ }                      │
       └────────────────────────┘
```

## Data Flow

### 1. Product creation/update
```
Admin panel / scripts
        ↓
    Product model
        ↓
affiliateLinks Map {
  amazon: { url, enabled, priority, clicks, conversions },
  aliexpress: { url, enabled, priority, clicks, conversions },
  ...
}
        ↓
    MongoDB Save
```

### 2. User click process
```
User clicks "Buy Now"
        ↓
ProductCard onClick triggers
        ↓
Calls trackAffiliateClick()
        ↓
POST /api/track-conversion
   { productId, affiliateId, type: 'click' }
        ↓
MongoDB update: clicks++
        ↓
User is redirected to the affiliate site
```

### 3. Analytics request
```
Admin dashboard
        ↓
GET /api/affiliate-stats
        ↓
Read all products from MongoDB
        ↓
Compute stats for each affiliate
        ↓
Calculate conversion rates (conversions/clicks * 100)
        ↓
Return JSON response
```

## কম্পোনেন্ট আর্কিটেকচার

```
lib/affiliate-config.ts
├── AFFILIATE_NETWORKS (all definitions)
├── getEnabledAffiliates() (active only)
├── getAffiliateNetwork()
├── isAffiliateEnabled()
├── getTrackingPrefix()
└── getDefaultAffiliate()

lib/affiliate-utils.ts
├── generateAffiliateLink() (add tracking params)
├── getBestAffiliateLink() (highest priority)
├── getActiveAffiliateLinks() (list active links)
├── trackAffiliateClick() (API call)
├── trackAffiliateConversion()
├── getAffiliateStats()
└── createAffiliateTrackingObject()

models/Product.js
├── affiliateLink (legacy)
└── affiliateLinks (new Map)

components/ProductCard.jsx
├── render primary button (highest priority)
├── render dropdown (other links)
└── track clicks

app/api/track-conversion/route.ts
├── handleAffiliateTracking()
└── update clicks/conversions

app/api/affiliate-stats/route.ts
├── analytics for single product
└── analytics for all products
```

## অ্যাফিলিয়েট প্রাথমিকতা চেইন

```
Primary button selection:
1. Find the link with the highest priority number
2. Ensure it is `enabled: true`
3. Ensure the URL exists and is valid

Dropdown options:
- All other active links besides the primary button
- Sorted by priority order

Example:
affiliateLinks = {
        amazon: { priority: 1, enabled: true }     ← primary button
        aliexpress: { priority: 2, enabled: true } ← dropdown 1
        ebay: { priority: 3, enabled: true }       ← dropdown 2
        flipkart: { priority: 4, enabled: false }  ← hidden (disabled)
}
```

## বিজ্ঞতা পুনরুদ্ধার নির্দেশাবলী

### Adding a new product
```javascript
// Manual method
db.products.create({
        title: "Smart Bulb",
        affiliateLinks: {
                amazon: {
                        url: "https://amazon.com/...",
                        enabled: true,
                        priority: 1,
                        clicks: 0,
                        conversions: 0
                },
                aliexpress: {
                        url: "https://aliexpress.com/...",
                        enabled: true,
                        priority: 2,
                        clicks: 0,
                        conversions: 0
                }
        }
})
```

### Update existing products
```bash
# Run migration
npm run migrate:multi-affiliate

# Or programmatically
import Product from '@/models/Product';
const product = await Product.findById(id);
product.affiliateLinks.set('amazon', {
        url: '...',
        enabled: true,
        priority: 1
});
await product.save();
```

### Read analytics
```javascript
// Client side
const response = await fetch('/api/affiliate-stats');
const data = await response.json();
console.log(data.data[0].affiliates.amazon.clicks);

// Server side
const product = await Product.findById(id);
const amazonData = product.affiliateLinks.get('amazon');
console.log(amazonData.clicks);
```

## পরিবেশ ভেরিয়েবল অগ্রাধিকার

```
Priority 5 - highest:
└─ NEXT_PUBLIC_AMAZON_AFFILIATE_TAG
        └─ NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID
                └─ NEXT_PUBLIC_EBAY_CAMPAIGN_ID
                        └─ NEXT_PUBLIC_FLIPKART_AFFILIATE_ID
                                └─ NEXT_PUBLIC_DARAZ_AFFILIATE_ID
                                        └─ NEXT_PUBLIC_ROKOMARI_AFFILIATE_ID
                                                └─ NEXT_PUBLIC_AJIO_AFFILIATE_ID
                                                        └─ Priority 7 - lowest

Environment variable set = affiliate enabled
Unset or empty = affiliate disabled
```

## নিরাপত্তা বিবেচনা

```
Sensitive data:
├─ Affiliate IDs / tags
│  └─ NEXT_PUBLIC_* are public (no secret data)
│
├─ MongoDB connection
│  └─ MONGODB_URI
  └─ Server-side only
  └─ Stored in `.env.local`
│
└─ Tracking data
        └─ Stored in MongoDB
        └─ Read-only API endpoints are recommended
        └─ Authentication should be added
```

## পারফরম্যান্স বিবেচনা

```
Performance considerations:
├─ MongoDB indexes
│  └─ Index affiliateLinks for large collections
│
├─ Caching
│  └─ Cache analytics results
        └─ For 5-10 minutes
│
├─ Load testing
│  └─ Monitor page load times
        └─ Especially with large numbers of affiliates
│
└─ Database
         └─ Use aggregation pipelines for large stats
```

This is the full architecture overview! 🏗️
