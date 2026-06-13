# 🌐 Multi-Affiliate System Setup Guide

এই গাইডটি আপনার স্মার্ট-হোম অ্যাফিলিয়েট সাইটকে একাধিক অ্যাফিলিয়েট নেটওয়ার্ক সাপোর্ট করার জন্য কনফিগার করতে সাহায্য করবে।

## 📋 সমর্থিত অ্যাফিলিয়েট নেটওয়ার্ক

আপনার সাইট এখন নিম্নলিখিত অ্যাফিলিয়েট প্রোগ্রাম সমর্থন করে:

1. **Amazon Associates** - বিশ্বব্যাপী
# 🌐 Multi-Affiliate System Setup Guide

This guide walks you through configuring your Smart Home affiliate site to support multiple affiliate networks.

## 📋 Supported Affiliate Networks

The site supports the following affiliate programs:

1. **Amazon Associates** - Global
2. **AliExpress Affiliate** - China-based e-commerce
3. **eBay Partner Network** - Global marketplace
4. **Flipkart Affiliate** - India-based e-commerce
5. **Daraz Affiliate** - Bangladesh & South Asia
6. **Rokomari Affiliate** - Bangladesh books and products
7. **AJIO Affiliate** - India fashion & lifestyle

## 🚀 Setup Steps

### Step 1: Register with each affiliate program

Sign up on each platform to obtain your affiliate IDs.

#### Amazon Associates
- Website: https://associates.amazon.com/
- Copy your **Associate Tag** (usually like `yourname-20`).

#### AliExpress Affiliate
- Website: https://portals.aliexpress.com/
- Get your **Affiliate ID** (FCid) from the promotional URL or dashboard.

#### eBay Partner Network
- Website: https://partnernetwork.ebay.com/
- Create and copy your **Campaign ID**.

#### Flipkart Affiliate
- Website: https://affiliate.flipkart.com/
- Copy your **Affiliate ID** from the dashboard.

#### Daraz Affiliate
- Website: https://affiliate.daraz.com.bd/
- Get your **Affiliate ID** for Bangladesh-focused products.

#### Rokomari Affiliate
- Website: https://affiliate.rokomari.com/
- Get your **Affiliate ID** (good for Bangladesh book/product niches).

#### AJIO Affiliate
- Website: https://affiliate.ajio.com/
- Copy your **Affiliate Code** for fashion/lifestyle in India.

### Step 2: Configure environment variables

Add your affiliate IDs to `.env.local`:

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

### Step 3: Migrate existing products

Convert existing single-affiliate links to the multi-affiliate format:

```bash
npm run migrate:multi-affiliate
```

This script will:
- Find all products
- Detect existing affiliate links
- Transform them into the multi-affiliate structure

### Step 4: Add affiliate links for new products

#### Option A: Admin panel (manual)

1. Navigate to `/admin/products`
2. Create or edit a product
3. Add links for each affiliate network

#### Option B: Script (automated)

Edit and run `scripts/add-affiliate-links.js`:

```bash
npm run add:affiliate-links
```

## 📊 Affiliate Link Structure

Each product stores affiliate links in this format:

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
    // ... other affiliate networks
  }
}
```

## 🎯 Best Practices

### 1. Set priorities

The link with the highest priority is shown as the primary "Buy Now" button.

```javascript
amazon: { priority: 1 },    // primary
aliexpress: { priority: 2 }, // secondary
ebay: { priority: 3 }        // in the "more options" menu
```

### 2. Use correct URL formats

Examples:

```
Amazon:     https://amazon.com/dp/ASIN?tag=YOUR-TAG
AliExpress: https://aliexpress.com/item/123.html?aff_fcid=YOUR-ID
eBay:       https://ebay.com/itm/123?campid=YOUR-ID
Flipkart:   https://flipkart.com/...?affid=YOUR-ID
Daraz:      https://daraz.com.bd/...?aff_track=YOUR-ID
Rokomari:   https://rokomari.com/...?aff_id=YOUR-ID
AJIO:       https://ajio.com/...?utm_source=affiliate&utm_medium=YOUR-ID
```

### 3. Monitor performance regularly

Check affiliate stats:

```bash
# All products affiliate stats
curl http://localhost:3000/api/affiliate-stats

# For a specific product
curl "http://localhost:3000/api/affiliate-stats?productId=PRODUCT_ID"
```

## 🔍 Tracking and Analytics

The system tracks:
- **Clicks**: when a user clicks an affiliate link
- **Conversions**: when a sale is recorded (manually or via webhook)

### Database structure

Affiliate statistics are stored per affiliate link:

```javascript
affiliateLinks: {
  amazon: {
    url: "...",
    clicks: 1250,
    conversions: 45,
    enabled: true
  }
}
```

## 🛠️ Utility functions

### Get active affiliate links in ProductCard

```javascript
import { getActiveAffiliateLinks } from '@/lib/affiliate-utils';

const links = getActiveAffiliateLinks(product.affiliateLinks);
// Output: [{id, name, url, priority, clicks, conversions}, ...]
```

### Select the best affiliate link

```javascript
import { getBestAffiliateLink } from '@/lib/affiliate-utils';

const primaryLink = getBestAffiliateLink(product.affiliateLinks);
// Returns the highest-priority active link
```

### Track affiliate click

```javascript
import { trackAffiliateClick } from '@/lib/affiliate-utils';

await trackAffiliateClick(productId, 'amazon');
```

## 💰 Revenue optimization tips

1. Choose the best network per product type:
   - Smart Home: Amazon (higher commissions)
   - Budget products: AliExpress, Daraz
   - Multi-market: include all networks

2. Optimize by region:
   - Bangladesh: prioritize Daraz, Rokomari
   - India: Flipkart, AJIO, Amazon
   - Global: Amazon, AliExpress, eBay

3. Regularly validate links:
   - Ensure links work
   - Remove broken links
   - Update outdated links

## 🚨 Troubleshooting

### Issue: Affiliate link not showing

```javascript
// Check product data
db.products.findOne({slug: "product-slug"})

// Ensure affiliateLinks functionality exists and is enabled
```
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
