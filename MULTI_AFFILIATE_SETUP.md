# 🌐 Multi-Affiliate System Setup Guide

এই গাইডটি আপনার স্মার্ট-হোম অ্যাফিলিয়েট সাইটকে একাধিক অ্যাফিলিয়েট নেটওয়ার্ক সাপোর্ট করার জন্য কনফিগার করতে সাহায্য করবে।

## 📋 সমর্থিত অ্যাফিলিয়েট নেটওয়ার্ক

আপনার সাইট এখন নিম্নলিখিত অ্যাফিলিয়েট প্রোগ্রাম সমর্থন করে:

1. **Amazon Associates** - বিশ্বব্যাপী
2. **AliExpress Affiliate** - চীন-ভিত্তিক ই-কমার্স
3. **eBay Partner Network** - বৈশ্বিক অনলাইন নিলাম
4. **Flipkart Affiliate** - ভারত-ভিত্তিক ই-কমার্স
5. **Daraz Affiliate** - বাংলাদেশ এবং দক্ষিণ এশিয়া
6. **Rokomari Affiliate** - বাংলাদেশ বই এবং পণ্য
7. **AJIO Affiliate** - ভারত-ভিত্তিক ফ্যাশন এবং লাইফস্টাইল

## 🚀 সেটআপ ধাপ

### ধাপ 1: প্রতিটি অ্যাফিলিয়েট প্রোগ্রামে যোগ দিন

আপনার অ্যাফিলিয়েট আইডি পেতে প্রতিটি প্ল্যাটফর্মে সাইন আপ করুন:

#### Amazon Associates
- ওয়েবসাইট: https://associates.amazon.com/
- আপনার **Associate Tag** কপি করুন
- এটি সাধারণত এর মতো দেখায়: `yourname-20`

#### AliExpress Affiliate
- ওয়েবসাইট: https://portals.aliexpress.com/
- আপনার **Affiliate ID** বা **FCid** পান
- প্রচারমূলক URL থেকে ID বের করুন

#### eBay Partner Network
- ওয়েবসাইট: https://partnernetwork.ebay.com/
- আপনার **Campaign ID** তৈরি করুন
- চিহ্নিতকরণের জন্য এটি ব্যবহার করুন

#### Flipkart Affiliate
- ওয়েবসাইট: https://affiliate.flipkart.com/
- আপনার **Affiliate ID** সংগ্রহ করুন
- অ্যাফিলিয়েট লিংক থেকে ID বের করুন

#### Daraz Affiliate
- ওয়েবসাইট: https://affiliate.daraz.com.bd/
- আপনার **Affiliate ID** সংগ্রহ করুন
- বাংলাদেশে পণ্যগুলির জন্য নিখুঁত

#### Rokomari Affiliate
- ওয়েবসাইট: https://affiliate.rokomari.com/
- আপনার **Affiliate ID** পান
- বাংলাদেশ-ভিত্তিক শপিং এর জন্য চমৎকার

#### AJIO Affiliate
- ওয়েবসাইট: https://affiliate.ajio.com/
- আপনার **Affiliate Code** পান
- ভারতে ফ্যাশন এবং লাইফস্টাইল পণ্যের জন্য আদর্শ

### ধাপ 2: এনভায়রনমেন্ট ভেরিয়েবল কনফিগার করুন

`.env.local` ফাইলে আপনার অ্যাফিলিয়েট আইডি যোগ করুন:

```bash
# Amazon Associates
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-amazon-tag-20

# AliExpress
NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID=your-aliexpress-fcid

# eBay
NEXT_PUBLIC_EBAY_CAMPAIGN_ID=your-ebay-campaign-id

# Flipkart
NEXT_PUBLIC_FLIPKART_AFFILIATE_ID=your-flipkart-id

# Daraz
NEXT_PUBLIC_DARAZ_AFFILIATE_ID=your-daraz-id

# Rokomari
NEXT_PUBLIC_ROKOMARI_AFFILIATE_ID=your-rokomari-id

# AJIO
NEXT_PUBLIC_AJIO_AFFILIATE_ID=your-ajio-id
```

### ধাপ 3: বিদ্যমান পণ্যগুলি মাইগ্রেট করুন

আপনার বিদ্যমান একক অ্যাফিলিয়েট লিংক সহ পণ্যগুলি নতুন মাল্টি-অ্যাফিলিয়েট ফর্ম্যাটে রূপান্তরিত করুন:

```bash
npm run migrate:multi-affiliate
```

এই স্ক্রিপ্টটি:
- আপনার সমস্ত পণ্য খুঁজে পাবে
- বিদ্যমান অ্যাফিলিয়েট লিংক সনাক্ত করবে
- সঠিক নেটওয়ার্কের অধীনে তাদের রূপান্তরিত করবে

### ধাপ 4: নতুন পণ্যের জন্য অ্যাফিলিয়েট লিংক যোগ করুন

#### বিকল্প A: ম্যানুয়ালি অ্যাডমিন প্যানেল এর মাধ্যমে

1. `/admin/products` এ নেভিগেট করুন
2. একটি নতুন পণ্য তৈরি করুন বা সম্পাদনা করুন
3. প্রতিটি অ্যাফিলিয়েট নেটওয়ার্কের জন্য লিংক যোগ করুন

#### বিকল্প B: স্ক্রিপ্ট দিয়ে

`scripts/add-affiliate-links.js` সম্পাদনা করুন এবং চালান:

```bash
npm run add:affiliate-links
```

## 📊 অ্যাফিলিয়েট লিংক স্ট্রাকচার

প্রতিটি পণ্য এখন এই ফর্ম্যাটে অ্যাফিলিয়েট লিংক সংরক্ষণ করে:

```javascript
{
  affiliateLinks: {
    amazon: {
      url: "https://amazon.com/dp/...",
      enabled: true,
      priority: 1,
      clicks: 0,
      conversions: 0
    },
    aliexpress: {
      url: "https://aliexpress.com/item/...",
      enabled: true,
      priority: 2,
      clicks: 0,
      conversions: 0
    },
    ebay: {
      url: "https://ebay.com/itm/...",
      enabled: true,
      priority: 3,
      clicks: 0,
      conversions: 0
    }
    // ... আরও অ্যাফিলিয়েট নেটওয়ার্ক
  }
}
```

## 🎯 অ্যাফিলিয়েট লিংক সেরা অনুশীলন

### 1. **অগ্রাধিকার সেট করুন**

প্রথম অ্যাফিলিয়েট লিংকটি সর্বোচ্চ অগ্রাধিকার সহ "Buy Now" বোতাম হিসাবে প্রদর্শিত হয়।

```javascript
amazon: { priority: 1 },    // এই প্রথম দেখানো হবে
aliexpress: { priority: 2 }, // এই দ্বিতীয়
ebay: { priority: 3 }        // এটি "আরও বিকল্প" মেনুতে থাকবে
```

### 2. **সঠিক লিংক ফর্ম্যাট নিশ্চিত করুন**

প্রতিটি অ্যাফিলিয়েট প্রোগ্রামের জন্য সঠিক প্যারামিটার ব্যবহার করুন:

```
Amazon:     https://amazon.com/dp/ASIN?tag=YOUR-TAG
AliExpress: https://aliexpress.com/item/123.html?aff_fcid=YOUR-ID
eBay:       https://ebay.com/itm/123?campid=YOUR-ID
Flipkart:   https://flipkart.com/...?affid=YOUR-ID
Daraz:      https://daraz.com.bd/...?aff_track=YOUR-ID
Rokomari:   https://rokomari.com/...?aff_id=YOUR-ID
AJIO:       https://ajio.com/...?utm_source=affiliate&utm_medium=YOUR-ID
```

### 3. **নিয়মিত পারফরম্যান্স পর্যবেক্ষণ করুন**

অ্যাফিলিয়েট পরিসংখ্যান চেক করুন:

```bash
# সমস্ত পণ্যের অ্যাফিলিয়েট পরিসংখ্যান
curl http://localhost:3000/api/affiliate-stats

# একটি নির্দিষ্ট পণ্যের জন্য
curl "http://localhost:3000/api/affiliate-stats?productId=PRODUCT_ID"
```

## 🔍 ট্র্যাকিং এবং অ্যানালিটিক্স

সিস্টেম স্বয়ংক্রিয়ভাবে ট্র্যাক করে:

- **ক্লিক**: যখন ব্যবহারকারী অ্যাফিলিয়েট লিংকে ক্লিক করে
- **রূপান্তর**: যখন একটি বিক্রয় হয় (ম্যানুয়ালি রেকর্ড করা হয়)

### ডেটাবেস স্ট্রাকচার

প্রতিটি অ্যাফিলিয়েট লিংক এর জন্য পরিসংখ্যান সংরক্ষণ করা হয়:

```javascript
affiliateLinks: {
  amazon: {
    url: "...",
    clicks: 1250,         // মোট ক্লিক
    conversions: 45,      // মোট রূপান্তর
    enabled: true
  }
}
```

## 🛠️ ইউটিলিটি ফাংশন

### ProductCard এ অ্যাফিলিয়েট লিংক পান

```javascript
import { getActiveAffiliateLinks } from '@/lib/affiliate-utils';

const links = getActiveAffiliateLinks(product.affiliateLinks);
// আউটপুট: [{id, name, url, priority, clicks, conversions}, ...]
```

### সেরা অ্যাফিলিয়েট লিংক নির্বাচন করুন

```javascript
import { getBestAffiliateLink } from '@/lib/affiliate-utils';

const primaryLink = getBestAffiliateLink(product.affiliateLinks);
// সর্বোচ্চ অগ্রাধিকারের সক্রিয় লিংক রিটার্ন করে
```

### অ্যাফিলিয়েট ক্লিক ট্র্যাক করুন

```javascript
import { trackAffiliateClick } from '@/lib/affiliate-utils';

await trackAffiliateClick(productId, 'amazon');
```

## 💰 রাজস্ব অপ্টিমাইজেশন টিপস

1. **পণ্যের ধরনের জন্য সেরা নেটওয়ার্ক নির্বাচন করুন**
   - স্মার্ট হোম: Amazon (উচ্চ কমিশন)
   - সাশ্রয়ী পণ্য: AliExpress, Daraz
   - মাল্টি-মার্কেট: সব কিছু অন্তর্ভুক্ত করুন

2. **বিভিন্ন বাজারের জন্য অপ্টিমাইজ করুন**
   - বাংলাদেশ: Daraz, Rokomari অগ্রাধিকার দিন
   - ভারত: Flipkart, AJIO, Amazon
   - বৈশ্বিক: Amazon, AliExpress, eBay

3. **নিয়মিত লিংক পরীক্ষা করুন**
   - নিশ্চিত করুন সমস্ত লিংক কাজ করছে
   - ভাঙা লিংক সরিয়ে দিন
   - পুরানো লিংক আপডেট করুন

## 🚨 সমস্যা সমাধান

### সমস্যা: অ্যাফিলিয়েট লিংক প্রদর্শিত হচ্ছে না

```javascript
// পণ্য তথ্য চেক করুন
db.products.findOne({slug: "product-slug"})

// affiliateLinks ফাংশনালিটি আছে নিশ্চিত করুন
// এবং কমপক্ষে একটি লিংক enabled: true দিয়ে থাকে
```

### সমস্যা: লিংক ট্র্যাকিং কাজ করছে না

- ব্রাউজার কনসোল এ ত্রুটি চেক করুন
- `/api/track-conversion` এনডপয়েন্ট সক্রিয় আছে নিশ্চিত করুন
- আপনার প্রোডাক্ট ID সঠিক আছে নিশ্চিত করুন

## 📁 নতুন ফাইল এবং পরিবর্তন

এই সেটআপে যা যোগ করা হয়েছে:

```
lib/
├── affiliate-config.ts        # অ্যাফিলিয়েট নেটওয়ার্ক কনফিগ
└── affiliate-utils.ts         # ইউটিলিটি ফাংশন

app/api/
├── affiliate-stats/route.ts   # অ্যানালিটিক্স এন্ডপয়েন্ট
└── track-conversion/route.ts  # আপডেট করা ট্র্যাকিং

scripts/
├── migrate-multi-affiliate.js  # মাইগ্রেশন স্ক্রিপ্ট
└── add-affiliate-links.js      # লিংক যোগ করার স্ক্রিপ্ট

components/
└── ProductCard.jsx            # আপডেট করা উপাদান

models/
└── Product.js                 # নতুন affiliateLinks ফিল্ড
```

## ✅ চেকলিস্ট

আপনার মাল্টি-অ্যাফিলিয়েট সেটআপ সম্পূর্ণ করতে:

- [ ] সব অ্যাফিলিয়েট প্রোগ্রামে যোগ দিন
- [ ] `.env.local` এ আপনার আইডি যোগ করুন
- [ ] `npm run migrate:multi-affiliate` চালান
- [ ] বিদ্যমান পণ্য যাচাই করুন
- [ ] নতুন পণ্যে অ্যাফিলিয়েট লিংক যোগ করুন
- [ ] `/api/affiliate-stats` এ ট্র্যাকিং যাচাই করুন
- [ ] বিভিন্ন ডিভাইসে লিংক পরীক্ষা করুন
- [ ] অ্যানালিটিক্স নিয়মিত পর্যবেক্ষণ করুন

## 📞 সহায়তা

যদি কোনো সমস্যা থাকে:

1. সমস্ত env ভেরিয়েবল সঠিকভাবে সেট করা হয়েছে নিশ্চিত করুন
2. সার্ভার লগ চেক করুন (`npm run dev`)
3. ব্রাউজার ডেভেলপার টুলে কনসোল ত্রুটি দেখুন
4. মাইগ্রেশন স্ক্রিপ্ট আবার চালান

---

**এখন আপনার সাইট একাধিক অ্যাফিলিয়েট নেটওয়ার্ক থেকে আয় করতে প্রস্তুত!** 🎉
