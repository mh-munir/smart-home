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
# Google AdSense Script Error Fix Guide

## 🔴 Problem

The AdSense script is failing to load and errors appear in the browser console.

## ✅ Solution

### Step 1: Set environment variables

Add the following to your `.env.local`:

```bash
NEXT_PUBLIC_ADSENSE_ENABLED=true
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-4755389845351116
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=1234567893
```

### Step 2: Where to find your Publisher ID

1. Log in to your Google AdSense account: https://www.google.com/adsense/
2. Go to **Settings → Account**
3. Find the **Publisher ID** (starts with `ca-pub-`)
4. Copy the value and add it to `.env.local`

### Step 3: Verify format

Publisher IDs must be in the correct format:

```
ca-pub-xxxxxxxxxxxxxxxx  ✅ OK
ca-pub-1234567890123456 ✅ OK
pub-1234567890123456    ❌ Wrong (must start with ca-pub-)
1234567890123456        ❌ Wrong (missing ca-pub- prefix)
```

### Step 4: Restart the server

Stop the dev server (Ctrl+C) and start again:

```bash
npm run dev
```

### Step 5: Check the console

Open the browser console and verify:
- **❌ If you see errors**: the Publisher ID or config may be incorrect
- **✅ If you see healthy messages**: the script loaded successfully

## 🔍 Debugging tips

### Console check
Run this in the console to inspect the ads object:

```js
console.log(window.adsbygoogle);
```

### Network check
1. Open DevTools (F12)
2. Go to the **Network** tab
3. Search for `adsbygoogle.js`
4. Status 200 = OK; 403/404 indicates an issue

### AdSense may be disabled
If your `.env.local` contains:

```
NEXT_PUBLIC_ADSENSE_ENABLED=false
```
then AdSense integration is intentionally disabled.

## 📝 Common issues

### 1. Publisher ID is not set
**Problem**: `⚠️ AdSense: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set`
**Fix**: Add the correct Publisher ID to `.env.local`

### 2. Incorrect Publisher ID format
**Problem**: Script does not load
**Fix**: Ensure the ID starts with `ca-pub-`

### 3. Cross-origin issues
**Problem**: CORS or cross-origin errors
**Fix**: We've added `crossOrigin="anonymous"` to the AdSense script tag to address this

### 4. AdSense account approval pending
**Problem**: Script loads but ads do not display
**Fix**: This is normal while your account is pending approval — wait for Google to approve

## ✨ Improvements added

The updated `GoogleAdSenseScript.tsx` now includes:
- ✅ Better error logging for detailed diagnostics
- ✅ Publisher ID validation on load
- ✅ Extra development-mode logging
- ✅ onLoad handler to initialize ads when loaded
- ✅ CORS support (crossOrigin attribute)

## 🚀 Next steps

1. ✅ Update `.env.local` with the correct values
2. ✅ Restart the development server
3. ✅ Check Console and Network in DevTools
