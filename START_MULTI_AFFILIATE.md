# 🎯 মাল্টি-অ্যাফিলিয়েট সিস্টেম - শুরু করার গাইড

## আজ করতে হবে (5 মিনিট)

```
✓ ধাপ 1: এই 7টি সাইটে যাও
  ├─ https://associates.amazon.com/
  ├─ https://portals.aliexpress.com/
  ├─ https://partnernetwork.ebay.com/
  ├─ https://affiliate.flipkart.com/
  ├─ https://affiliate.daraz.com.bd/
  ├─ https://affiliate.rokomari.com/
  └─ https://affiliate.ajio.com/

✓ ধাপ 2: প্রতিটি থেকে আপনার অ্যাফিলিয়েট আইডি কপি করো

✓ ধাপ 3: এই কমান্ড চালাও (টার্মিনালে):
  npm run migrate:multi-affiliate

✓ ধাপ 4: সার্ভার রিস্টার্ট করো:
  npm run dev

✓ ধাপ 5: এক্সপেরিমেন্ট করো এবং দেখো!
```

## স্টেপ বাই স্টেপ (বিস্তারিত)

### ১. অ্যাফিলিয়েট নেটওয়ার্কে সাইন আপ

#### Amazon Associates
- যাও: https://associates.amazon.com/
- "Sign Up" ক্লিক করো
- তোমার নাম, ইমেল, পেমেন্ট তথ্য দাও
- "Associate Tag" খুঁজো (এর মতো দেখায়: `yourname-20`)
- **এটি কপি করো আপনার নোটপ্যাডে**

#### AliExpress
- যাও: https://portals.aliexpress.com/
- আপনার অ্যাকাউন্ট দিয়ে লগইন করো
- প্রোমোশনাল URL খোঁজ
- URL থেকে affiliate ID বের করো
- **এটি সংরক্ষণ করো**

*(অন্যান্য নেটওয়ার্কের জন্য একই প্রক্রিয়া)*

### ২. `.env.local` আপডেট করুন

**VS Code এ `.env.local` খুলুন**

আপনার আইডি যোগ করুন:

```bash
# আমাজন
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-tag-20

# AliExpress
NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID=your-fcid

# eBay
NEXT_PUBLIC_EBAY_CAMPAIGN_ID=your-campaign-id

# Flipkart
NEXT_PUBLIC_FLIPKART_AFFILIATE_ID=your-id

# Daraz
NEXT_PUBLIC_DARAZ_AFFILIATE_ID=your-id

# Rokomari
NEXT_PUBLIC_ROKOMARI_AFFILIATE_ID=your-id

# AJIO
NEXT_PUBLIC_AJIO_AFFILIATE_ID=your-id
```

**`Ctrl+S` দিয়ে সেভ করুন**

### ৩. বিদ্যমান পণ্য মাইগ্রেট করুন

**টার্মিনালে এই কমান্ড চালান:**

```bash
npm run migrate:multi-affiliate
```

**আউটপুট দেখতে হবে:**
```
🔄 Starting product migration to multi-affiliate format...
✓ Connected to database
Found X products with single affiliate links
✓ Migrated: Product 1
✓ Migrated: Product 2
...
✓ Migration complete! X products migrated
```

### ৪. সার্ভার রিস্টার্ট করুন

**যদি সার্ভার চলছে, থামান:**
```
Ctrl+C
```

**আবার শুরু করুন:**
```bash
npm run dev
```

**দেখা যাবে:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### ৫. এখন পরীক্ষা করুন!

**ব্রাউজার খুলুন:**
```
http://localhost:3000
```

**একটি পণ্যে যান**

**দেখবেন:**
- ✅ "Buy on Amazon" (বড় বোতাম)
- ✅ "More Options" (অন্যান্য নেটওয়ার্ক)

**ড্রপডাউন খুলুন এবং দেখো:**
- AliExpress
- eBay
- Flipkart
- ইত্যাদি...

## যাচাইকরণ চেকলিস্ট

```
□ সমস্ত 7টি অ্যাফিলিয়েট নেটওয়ার্কে সাইন আপ করেছেন
□ আপনার আইডি .env.local এ যোগ করেছেন
□ migration স্ক্রিপ্ট চালিয়েছেন (সফলভাবে সম্পন্ন)
□ সার্ভার রিস্টার্ট করেছেন
□ ওয়েবসাইটে "Buy on" বোতাম দেখতে পারছেন
□ "More Options" ড্রপডাউন কাজ করছে
□ অ্যানালিটিক্স API এ: curl http://localhost:3000/api/affiliate-stats
```

## নতুন পণ্যে অ্যাফিলিয়েট লিংক যোগ করুন

### অপশন A: ম্যানুয়ালি (সহজ)

1. `/admin/products` যান
2. নতুন পণ্য তৈরি করুন
3. প্রতিটি নেটওয়ার্কের জন্য লিংক পেস্ট করুন
4. সেভ করুন

### অপশন B: স্ক্রিপ্ট (দ্রুত)

`scripts/add-affiliate-links.js` সম্পাদনা করুন:

```javascript
const exampleProductUpdate = {
  slug: 'your-product-slug',
  affiliateLinks: {
    amazon: {
      url: 'https://amazon.com/dp/ASIN?tag=YOUR-TAG',
      enabled: true,
      priority: 1,
    },
    aliexpress: {
      url: 'https://aliexpress.com/item/ID.html?aff_fcid=YOUR-ID',
      enabled: true,
      priority: 2,
    },
    // আরও নেটওয়ার্ক যোগ করুন
  },
};
```

তারপর চালান:
```bash
npm run add:affiliate-links
```

## সাধারণ সমস্যা এবং সমাধান

### সমস্যা: বোতাম দেখা যাচ্ছে না

**সমাধান:**
```bash
# 1. .env.local চেক করুন
#    - সব ভেরিয়েবল যোগ করা আছে?
#    - কমপক্ষে একটি ভেরিয়েবল সেট করা আছে?

# 2. সার্ভার রিস্টার্ট করুন
#    Ctrl+C
#    npm run dev

# 3. ব্রাউজার রিফ্রেশ করুন
#    Ctrl+R (Windows) বা Cmd+R (Mac)
```

### সমস্যা: মাইগ্রেশন ব্যর্থ

**সমাধান:**
```bash
# MongoDB কানেকশন চেক করুন
# .env.local এ MONGODB_URI আছে কিনা যাচাই করুন

# আবার চেষ্টা করুন:
npm run migrate:multi-affiliate
```

### সমস্যা: লিংক কাজ করছে না

**সমাধান:**
```bash
# ব্রাউজার কনসোল খুলুন (F12)
# "More Options" ড্রপডাউনে লিংক ক্লিক করুন
# ত্রুটি দেখতে পাবেন
```

## পরবর্তী পদক্ষেপ (একবার সেটআপ সম্পূর্ণ)

1. **অ্যানালিটিক্স দেখুন**
   ```bash
   curl http://localhost:3000/api/affiliate-stats
   ```

2. **অগ্রাধিকার অপ্টিমাইজ করুন**
   - সর্বোচ্চ কনভার্টিং নেটওয়ার্ক প্রথম রাখুন

3. **বাজার-ভিত্তিক কৌশল**
   - বাংলাদেশ: Daraz/Rokomari প্রথম
   - ভারত: Flipkart/AJIO প্রথম
   - বিশ্বব্যাপী: Amazon প্রথম

4. **নিয়মিত পর্যবেক্ষণ**
   - প্রতি সপ্তাহে অ্যানালিটিক্স চেক করুন
   - সেরা পারফরমার খুঁজুন
   - খারাপ লিংক সরান

## শেষ টিপস

```
✅ DO:
   - সমস্ত অ্যাফিলিয়েট আইডি সংরক্ষণ করুন
   - নিয়মিত লিংক পরীক্ষা করুন
   - অ্যানালিটিক্স ট্র্যাক করুন
   - নতুন পণ্যে লিংক যোগ করুন

❌ DON'T:
   - আপনার আইডি হার্ডকোড করবেন না
   - env ফাইল গিট এ কমিট করবেন না
   - নিষ্ক্রিয় অ্যাফিলিয়েট ব্যবহার করবেন না
   - নিয়মিত লিংক চেক না করা
```

## সহায়তা

যদি সমস্যা থাকে:

1. `MULTI_AFFILIATE_QUICK_REF.md` পড়ুন
2. `MULTI_AFFILIATE_SETUP.md` পড়ুন
3. সার্ভার লগ চেক করুন
4. ব্রাউজার কনসোল চেক করুন (F12)

---

**এখনই শুরু করুন এবং আপনার আয় বাড়ান!** 🚀💰
