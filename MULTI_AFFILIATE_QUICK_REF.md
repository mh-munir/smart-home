# 🚀 Multi-Affiliate Quick Reference

এই ফাইলটি মাল্টি-অ্যাফিলিয়েট সিস্টেম দ্রুত ব্যবহারের জন্য একটি সংক্ষিপ্ত রেফারেন্স।

## দ্রুত কমান্ড

```bash
# বিদ্যমান পণ্য মাইগ্রেট করুন
npm run migrate:multi-affiliate

# নতুন অ্যাফিলিয়েট লিংক যোগ করুন
npm run add:affiliate-links

# সার্ভার শুরু করুন
npm run dev

# সমস্ত পণ্যের অ্যানালিটিক্স চেক করুন
curl http://localhost:3000/api/affiliate-stats

# একটি পণ্যের অ্যানালিটিক্স চেক করুন
curl "http://localhost:3000/api/affiliate-stats?productId=PRODUCT_ID"
```

## অ্যাফিলিয়েট অগ্রাধিকার

যখন একাধিক লিংক সক্রিয় থাকে:

1. **প্রথম প্রদর্শিত** (বড় বোতাম): সর্বোচ্চ অগ্রাধিকার
2. **ড্রপডাউনে**: অন্যান্য সক্রিয় লিংক

```javascript
// উদাহরণ অগ্রাধিকার সেটিং
amazon: { priority: 1 },      // "Buy on Amazon" বোতাম
aliexpress: { priority: 2 },  // ড্রপডাউনে
ebay: { priority: 3 }         // ড্রপডাউনে
```

## অ্যাফিলিয়েট URL ফর্ম্যাট

```
Amazon:     https://amazon.com/dp/ASIN?tag=YOUR-TAG-20
AliExpress: https://aliexpress.com/item/123.html?aff_fcid=YOUR-ID
eBay:       https://ebay.com/itm/123?campid=YOUR-CAMPAIGN-ID
Flipkart:   https://flipkart.com/path/to/product?affid=YOUR-ID
Daraz:      https://daraz.com.bd/path/to/product?aff_track=YOUR-ID
Rokomari:   https://rokomari.com/path/to/product?aff_id=YOUR-ID
AJIO:       https://ajio.com/path/to/product?utm_medium=YOUR-ID
```

## ডাটাবেস স্ট্রাকচার

```javascript
// Product ডকুমেন্ট
{
  _id: ObjectId,
  title: "স্মার্ট লাইট বাল্ব",
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
  clicks: 430,              // মোট ক্লিক
  conversions: 20,          // মোট রূপান্তর
  createdAt: Date,
  updatedAt: Date
}
```

## API এন্ডপয়েন্ট

### ট্র্যাকিং
```
POST /api/track-conversion
Body: {
  productId: "string",
  affiliateId: "amazon|aliexpress|ebay|flipkart|daraz|rokomari|ajio",
  type: "click|conversion"
}
```

### অ্যানালিটিক্স
```
GET /api/affiliate-stats
GET /api/affiliate-stats?productId=PRODUCT_ID
```

## React এ ব্যবহার

### সক্রিয় অ্যাফিলিয়েট লিংক পান
```javascript
import { getActiveAffiliateLinks } from '@/lib/affiliate-utils';

const links = getActiveAffiliateLinks(product.affiliateLinks);
// [{id: 'amazon', name: 'Amazon', url: '...', priority: 1}, ...]
```

### সেরা লিংক নির্বাচন করুন
```javascript
import { getBestAffiliateLink } from '@/lib/affiliate-utils';

const primary = getBestAffiliateLink(product.affiliateLinks);
// উচ্চতম অগ্রাধিকার সক্রিয় লিংক রিটার্ন করে
```

### ক্লিক ট্র্যাক করুন
```javascript
import { trackAffiliateClick } from '@/lib/affiliate-utils';

await trackAffiliateClick(productId, 'amazon');
```

### রূপান্তর ট্র্যাক করুন
```javascript
import { trackAffiliateConversion } from '@/lib/affiliate-utils';

await trackAffiliateConversion(productId, 'amazon');
```

## পারফরম্যান্স অপ্টিমাইজেশন

### মার্কেট-ভিত্তিক কৌশল

**বাংলাদেশ ব্যবহারকারীদের জন্:**
- Daraz (অগ্রাধিকার 1)
- Rokomari (অগ্রাধিকার 2)
- AliExpress (অগ্রাধিকার 3)

**ভারতীয় ব্যবহারকারীদের জন্য:**
- Flipkart (অগ্রাধিকার 1)
- AJIO (অগ্রাধিকার 2)
- Amazon (অগ্রাধিকার 3)

**বৈশ্বিক ব্যবহারকারীদের জন্য:**
- Amazon (অগ্রাধিকার 1)
- eBay (অগ্রাধিকার 2)
- AliExpress (অগ্রাধিকার 3)

### কমিশন তুলনা

| নেটওয়ার্ক | কমিশন | বিশেষত্ব |
|---------|--------|---------|
| Amazon | 3-10% | উচ্চ মানের পণ্য |
| AliExpress | 2-10% | সাশ্রয়ী দাম |
| eBay | 4-8% | প্রিমিয়াম |
| Flipkart | 4-8% | ভারত ফোকাস |
| Daraz | 3-8% | বাংলাদেশ ফোকাস |
| Rokomari | 5-15% | বই এবং গিফট |
| AJIO | 4-8% | ফ্যাশন |

## সমস্যা সমাধান

### লিংক দেখা যাচ্ছে না?
1. চেক করুন `enabled: true`
2. চেক করুন `url` খালি নয়
3. চেক করুন env ভেরিয়েবল সেট আছে

### ট্র্যাকিং কাজ করছে না?
1. ব্রাউজার কনসোল খুলুন (F12)
2. নেটওয়ার্ক ট্যাবে `/api/track-conversion` খুঁজুন
3. প্রতিক্রিয়া কোড ২০০ আছে নিশ্চিত করুন

### মাইগ্রেশন ব্যর্থ?
```bash
# MongoDB সংযোগ চেক করুন
# এনভ MONGODB_URI সেট আছে নিশ্চিত করুন
npm run migrate:multi-affiliate
```

## পরবর্তী ধাপ

1. ✅ সমস্ত অ্যাফিলিয়েট নেটওয়ার্কে যোগ দিন
2. ✅ env ভেরিয়েবল যোগ করুন
3. ✅ বিদ্যমান পণ্য মাইগ্রেট করুন
4. ✅ নতুন পণ্যে লিংক যোগ করুন
5. ⏳ ট্র্যাকিং নিয়মিত পর্যবেক্ষণ করুন
6. ⏳ অগ্রাধিকার সামঞ্জস্য করুন
7. ⏳ রাজস্ব বৃদ্ধি করুন!

---

**একাধিক অ্যাফিলিয়েট, উচ্চতর রাজস্ব!** 💰
