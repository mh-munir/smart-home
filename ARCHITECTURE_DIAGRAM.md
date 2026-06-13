# মাল্টি-অ্যাফিলিয়েট সিস্টেম আর্কিটেকচার

## সিস্টেম ডায়াগ্রাম

```
┌─────────────────────────────────────────────────────────────┐
│                    ব্যবহারকারী ইন্টারফেস                      │
│                   (ProductCard.jsx)                          │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐           │
│  │ Buy on Amazon    │ ────────→ affiliate click   │           │
│  │   (Priority 1)   │         │    triggered     │           │
│  └──────────────────┘         └──────────────────┘           │
│                                        │                      │
│  ┌──────────────────┐                  │                      │
│  │ More Options ▼   │                  ▼                      │
│  └──────────────────┘         ┌──────────────────┐           │
│         │                      │  trackAffiliate  │           │
│         ├─ AliExpress         │      Click()     │           │
│         ├─ eBay               └──────────────────┘           │
│         └─ Flipkart                   │                       │
│                                       ▼                       │
└───────────────────────────────────────────────────────────────┘
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
        │ Product {              │       │ Clicks per affiliate │
        │   affiliateLinks: {     │       │ Conversions per link │
        │     amazon: {           │       │ Click through rate   │
        │       clicks: 250 ↑───┐ │       └──────────────────────┘
        │       url: "..."    │  │
        │     },              │  │
        │     aliexpress: {   │  │
        │       clicks: 180 ──┘  │
        │       url: "..."    │
        │     }               │
        │   }                 │
        │ }                   │
        └─────────────────────┘
```

## ডেটা ফ্লো

### 1. পণ্য তৈরি/আপডেট
```
অ্যাডমিন প্যানেল / স্ক্রিপ্ট
        ↓
    Product Model
        ↓
affiliateLinks Map {
  amazon: { url, enabled, priority, clicks, conversions },
  aliexpress: { url, enabled, priority, clicks, conversions },
  ...
}
        ↓
    MongoDB Save
```

### 2. ব্যবহারকারী ক্লিক প্রক্রিয়া
```
ব্যবহারকারী "Buy Now" ক্লিক করে
        ↓
ProductCard onCick ট্রিগার হয়
        ↓
trackAffiliateClick() কল করে
        ↓
POST /api/track-conversion
   { productId, affiliateId, type: 'click' }
        ↓
MongoDB আপডেট: clicks++
        ↓
ব্যবহারকারী অ্যাফিলিয়েট সাইটে পুনর্নির্দেশিত হয়
```

### 3. অ্যানালিটিক্স অনুরোধ
```
অ্যাডমিন ড্যাশবোর্ড
        ↓
GET /api/affiliate-stats
        ↓
MongoDB থেকে সমস্ত পণ্য পড়ুন
        ↓
প্রতিটি অ্যাফিলিয়েটের জন্য পরিসংখ্যান গণনা করুন
        ↓
রূপান্তর হার গণনা করুন (conversions/clicks * 100)
        ↓
JSON প্রতিক্রিয়া ফেরত করুন
```

## কম্পোনেন্ট আর্কিটেকচার

```
lib/affiliate-config.ts
├── AFFILIATE_NETWORKS (সমস্ত সংজ্ঞা)
├── getEnabledAffiliates() (সক্রিয় শুধুমাত্র)
├── getAffiliateNetwork()
├── isAffiliateEnabled()
├── getTrackingPrefix()
└── getDefaultAffiliate()

lib/affiliate-utils.ts
├── generateAffiliateLink() (ট্র্যাকিং পরিমাপ যোগ করুন)
├── getBestAffiliateLink() (সর্বোচ্চ অগ্রাধিকার)
├── getActiveAffiliateLinks() (তালিকা সব সক্রিয়)
├── trackAffiliateClick() (API কল)
├── trackAffiliateConversion()
├── getAffiliateStats()
└── createAffiliateTrackingObject()

models/Product.js
├── affiliateLink (লিগ্যাসি)
└── affiliateLinks (নতুন Map)

components/ProductCard.jsx
├── রেন্ডার প্রধান বোতাম (সর্বোচ্চ অগ্রাধিকার)
├── রেন্ডার ড্রপডাউন (অন্যান্য)
└── ট্র্যাক ক্লিক

app/api/track-conversion/route.ts
├── handleAffiliateTracking()
└── আপডেট clicks/conversions

app/api/affiliate-stats/route.ts
├── একক পণ্যের জন্য অ্যানালিটিক্স
└── সমস্ত পণ্যের জন্য অ্যানালিটিক্স
```

## অ্যাফিলিয়েট প্রাথমিকতা চেইন

```
প্রধান বোতাম নির্ধারণ:
1. সর্বোচ্চ অগ্রাধিকার সংখ্যা সহ লিংক খুঁজুন
2. নিশ্চিত করুন এটি enabled: true
3. নিশ্চিত করুন URL বিদ্যমান এবং বৈধ

ড্রপডাউন অপশন:
- প্রধান বোতাম ছাড়াই অন্যান্য সমস্ত সক্রিয় লিংক
- অগ্রাধিকার ক্রম দ্বারা সাজানো

উদাহরণ:
affiliateLinks = {
  amazon: { priority: 1, enabled: true }     ← মূল বোতাম
  aliexpress: { priority: 2, enabled: true } ← ড্রপডাউন 1
  ebay: { priority: 3, enabled: true }       ← ড্রপডাউন 2
  flipkart: { priority: 4, enabled: false }  ← লুকানো (disabled)
}
```

## বিজ্ঞতা পুনরুদ্ধার নির্দেশাবলী

### নতুন পণ্য যোগ করা
```javascript
// ম্যানুয়াল পদ্ধতি
db.products.create({
  title: "স্মার্ট বাল্ব",
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

### বিদ্যমান পণ্য আপডেট করা
```bash
# মাইগ্রেশন চালান
npm run migrate:multi-affiliate

# বা প্রোগ্রামেটিক্যালি
import Product from '@/models/Product';
const product = await Product.findById(id);
product.affiliateLinks.set('amazon', {
  url: '...',
  enabled: true,
  priority: 1
});
await product.save();
```

### অ্যানালিটিক্স পড়া
```javascript
// ক্লায়েন্ট সাইড
const response = await fetch('/api/affiliate-stats');
const data = await response.json();
console.log(data.data[0].affiliates.amazon.clicks);

// সার্ভার সাইড
const product = await Product.findById(id);
const amazonData = product.affiliateLinks.get('amazon');
console.log(amazonData.clicks);
```

## পরিবেশ ভেরিয়েবল অগ্রাধিকার

```
অগ্রাধিকার ৫ - সর্বোচ্চ:
└─ NEXT_PUBLIC_AMAZON_AFFILIATE_TAG
   └─ NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID
      └─ NEXT_PUBLIC_EBAY_CAMPAIGN_ID
         └─ NEXT_PUBLIC_FLIPKART_AFFILIATE_ID
            └─ NEXT_PUBLIC_DARAZ_AFFILIATE_ID
               └─ NEXT_PUBLIC_ROKOMARI_AFFILIATE_ID
                  └─ NEXT_PUBLIC_AJIO_AFFILIATE_ID
                     └─ অগ্রাধিকার ৭ - সর্বনিম্ন

এনভায়রনমেন্ট ভেরিয়েবল সেট করা = অ্যাফিলিয়েট সক্রিয়
অপ্রকাশ করা বা খালি = অ্যাফিলিয়েট অক্ষম করা
```

## নিরাপত্তা বিবেচনা

```
সংবেদনশীল তথ্য:
├─ অ্যাফিলিয়েট আইডি/ট্যাগ
│  └─ NEXT_PUBLIC_* সহ নিরাপদ (জনসাধারণ)
│  └─ কোনো গোপনীয়তা নেই
│
├─ মঙ্গোডিবি সংযোগ
│  └─ MONGODB_URI
│  └─ সার্ভার-সাইড শুধুমাত্র
│  └─ .env.local এ সংরক্ষিত
│
└─ ট্র্যাকিং ডেটা
   └─ MongoDB এ সংরক্ষিত
   └─ রিড-অনলি API এন্ডপয়েন্ট সুপারিশ করা হয়
   └─ প্রমাণীকরণ যোগ করা উচিত
```

## পারফরম্যান্স বিবেচনা

```
দ্রুততর করার কৌশল:
├─ MongoDB ইন্ডেক্স
│  └─ affiliateLinks সেট করুন (বড় নথিতে)
│
├─ ক্যাশিং
│  └─ অ্যানালিটিক্স ফলাফল ক্যাশ করুন
│  └─ 5-10 মিনিটের জন্য
│
├─ লোডিং
│  └─ পৃষ্ঠা লোড সময় পরীক্ষা করুন
│  └─ বড় সংখ্যক অ্যাফিলিয়েট সহ
│
└─ ডাটাবেস
   └─ aggregation পাইপলাইন ব্যবহার করুন
   └─ বড় পরিসংখ্যানের জন্য
```

এটি সম্পূর্ণ আর্কিটেকচার ওভারভিউ! 🏗️
