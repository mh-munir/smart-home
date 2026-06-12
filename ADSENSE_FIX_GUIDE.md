# Google AdSense Script এরর সমাধান গাইড

## 🔴 সমস্যা
AdSense script ব্যর্থভাবে লোড হচ্ছে এবং console এ এরর দেখাচ্ছে।

## ✅ সমাধান

### ধাপ ১: Environment Variables সেট করুন

`.env.local` ফাইলে যোগ করুন:

```env
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_CUSTOMER_ID=xxxxxxxxxx

# Ad Slot IDs (Optional - for specific placements)
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=0987654321
NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT=1122334455
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=5544332211
```

### ধাপ ২: Publisher ID কোথা থেকে পাবেন

1. Google AdSense অ্যাকাউন্টে লগইন করুন: https://www.google.com/adsense/
2. **সেটিংস** → **অ্যাকাউন্ট** এ যান
3. **প্রকাশক ID** খুঁজুন (এটি `ca-pub-` দিয়ে শুরু হবে)
4. এটি কপি করুন

### ধাপ ৩: Format যাচাই করুন

Publisher ID সঠিক ফরম্যাট:
```
ca-pub-xxxxxxxxxxxxxxxx  ✅ সঠিক
ca-pub-1234567890123456  ✅ সঠিক
pub-1234567890123456     ❌ ভুল (ca-pub- থাকতে হবে)
1234567890123456         ❌ ভুল (ca-pub- প্রিফিক্স প্রয়োজন)
```

### ধাপ ৪: সার্ভার রিস্টার্ট করুন

```bash
# প্রথমে Ctrl+C দিয়ে সার্ভার বন্ধ করুন
# তারপর আবার শুরু করুন
npm run dev
```

### ধাপ ৫: Console চেক করুন

এখন browser console খুলুন:
- **❌ Error দেখলে**: Publisher ID ভুল হতে পারে
- **✅ সবুজ ম্যাসেজ দেখলে**: সবকিছু ঠিক আছে

---

## 🔍 ডিবাগিং টিপস

### Console দেখুন:
```javascript
// কনসোলে এই কমান্ড চালান
console.log(process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID)
```

### নেটওয়ার্ক চেক করুন:
1. Browser DevTools খুলুন (F12)
2. **Network** ট্যাবে যান
3. `adsbygoogle.js` খুঁজুন
4. **Status 200** থাকলে সাফল্য, **৪০৩/৪০৪** থাকলে সমস্যা আছে

### AdSense Disable থাকতে পারে:
```env
# আপনার .env.local এ যদি এটি থাকে:
NEXT_PUBLIC_ADSENSE_ENABLED=false  # এটি হবে false দিয়ে
```

---

## 📝 সাধারণ সমস্যা

### ১. Publisher ID সেট নেই
**সমস্যা**: `⚠️ AdSense: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set`

**সমাধান**: `.env.local` ফাইলে সঠিক Publisher ID যোগ করুন

### ২. ভুল Publisher ID Format
**সমস্যা**: Script লোড হয় না

**সমাধান**: ID `ca-pub-` দিয়ে শুরু হচ্ছে কি তা যাচাই করুন

### ३. CORS Error
**সমস্যা**: Cross-Origin সমস্যা

**সমাধান**: ইতিমধ্যে ঠিক করা হয়েছে - `crossOrigin="anonymous"` যোগ করা হয়েছে

### ४. AdSense Account Approval পেন্ডিং
**সমস্যা**: Script লোড হয় কিন্তু ads দেখা যায় না

**সমাধান**: Google AdSense approval pending থাকলে এটি স্বাভাবিক। অপেক্ষা করুন।

---

## ✨ উন্নতিসাধিত বৈশিষ্ট্য

আপডেট করা `GoogleAdSenseScript.tsx` এ যোগ করা হয়েছে:

✅ **Better Error Logging**: বিস্তারিত error তথ্য  
✅ **Publisher ID Validation**: সেট করা আছে কি না তা চেক করা  
✅ **Development Console**: Dev mode এ বিস্তারিত লগ  
✅ **onLoad Handler**: সফল লোডিং এর সময় initialize করা  
✅ **CORS Support**: Cross-origin সমস্যা সমাধান  

---

## 🚀 পরবর্তী পদক্ষেপ

1. ✅ `.env.local` ফাইল আপডেট করুন
2. ✅ ডেভেলপমেন্ট সার্ভার রিস্টার্ট করুন
3. ✅ Browser console চেক করুন
4. ✅ Google AdSense approval status যাচাই করুন

---

**Need Help?** Google AdSense সাপোর্ট: https://support.google.com/adsense/
