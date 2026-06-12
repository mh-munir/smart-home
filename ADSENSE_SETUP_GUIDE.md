# Google AdSense Setup Guide

আপনার website এ Google AdSense earnings add করার জন্য সম্পূর্ণ গাইড।

## Step 1: Google AdSense Account সেটআপ

### 1.1 Google AdSense এ যোগদান করুন:
1. https://www.google.com/adsense/start/ এ যান
2. আপনার Google Account দিয়ে লগইন করুন
3. Website URL প্রবেশ করুন: `https://smart-home-products.vercel.app`
4. Country এবং কনটেন্ট category নির্বাচন করুন
5. AdSense Policy agree করুন এবং Submit করুন

### 1.2 অনুমোদনের অপেক্ষা করুন:
- Google প্রায় 1-2 দিনের মধ্যে আপনার website check করবে
- Approval পেতে এই criteria পূরণ করতে হবে:
  - Website এ কমপক্ষে 6 মাসের পুরনো content থাকতে হবে (আপনার আছে)
  - Traffic থাকতে হবে
  - Original content থাকতে হবে (আপনার আছে)
  - Google Policies follow করতে হবে

**আমাদের website প্রস্তুত:**
✅ High-quality smart home content  
✅ 28+ Products  
✅ Professional layout  
✅ Good SEO setup

---

## Step 2: Publisher ID এবং Ad Slots পান

Approval পেলে:

1. **Google AdSense Dashboard এ যান:** https://adsense.google.com/
2. **Settings > Account:** এ আপনার Publisher ID পাবেন
   - **আপনার Publisher ID:** `pub-4755389845351116` ✅
   - **Customer ID:** 5184618414
   - এটি কপি করুন

3. **Ads.txt ফাইল Download করুন:**
   - Settings > Account > Account info > Ads.txt
   - এটি `public/` folder এ রাখুন (বা Vercel deployment এ যোগ করুন)

---

## Step 3: Ad Slots তৈরি করুন

Google AdSense Dashboard এ:

1. **Left menu > Ads > Ad units**
2. **+ New ad unit** ক্লিক করুন

### 4টি Ad Slots তৈরি করুন:

#### Slot 1: Top Banner (728x90)
- **Name:** Top Banner
- **Size:** 728x90 (Leaderboard) or Responsive
- **Type:** Display Ad
- **Copy করুন:** Slot ID (e.g., `1234567890`)

#### Slot 2: Sidebar (300x600)
- **Name:** Sidebar
- **Size:** 300x600 (Half Page) or 300x250 (Medium Rectangle)
- **Type:** Display Ad
- **Copy করুন:** Slot ID

#### Slot 3: In-Content (728x280)
- **Name:** In-Content
- **Size:** 728x280 or Responsive
- **Type:** Display Ad
- **Copy করুন:** Slot ID

#### Slot 4: Bottom Banner (970x90)
- **Name:** Bottom Banner
- **Size:** 970x90 or 728x90
- **Type:** Display Ad
- **Copy করুন:** Slot ID

---

## Step 4: Environment Variables Configure করুন

`.env.local` ফাইল খুলুন এবং এই lines uncomment করুন:

```bash
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=1234567893
```

### Replace করুন:
- `ca-pub-xxxxxxxxxxxxxxxx` → আপনার Publisher ID
- `1234567890` → Top Banner Slot ID
- `1234567891` → Sidebar Slot ID
- `1234567892` → In-Content Slot ID
- `1234567893` → Bottom Banner Slot ID

---

## Step 5: Website এ Ad Units Add করুন

### Top Banner (Homepage এ)

File: `app/page.tsx`

```jsx
import { HorizontalAdUnit } from "@/components/AdUnits";

export default function HomePage() {
  return (
    <div>
      <HorizontalAdUnit slot="topBanner" />
      {/* অন্যান্য content */}
    </div>
  );
}
```

### Product Pages এ In-Content Ads

File: `app/products/[slug]/page.jsx`

```jsx
import { InContentAdUnit } from "@/components/AdUnits";

export default function ProductPage() {
  return (
    <div>
      <h1>Product Title</h1>
      <InContentAdUnit slot="inContent" />
      {/* Product details */}
    </div>
  );
}
```

### Blog/Category Pages এ

```jsx
import { HorizontalAdUnit, VerticalAdUnit } from "@/components/AdUnits";

export default function BlogPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Content */}
      </div>
      <div>
        <VerticalAdUnit slot="sidebar" />
      </div>
    </div>
  );
}
```

### Footer এ Bottom Banner

File: `components/Footer.jsx`

```jsx
import { HorizontalAdUnit } from "@/components/AdUnits";

export default function Footer() {
  return (
    <footer>
      <HorizontalAdUnit slot="bottomBanner" />
      {/* Footer content */}
    </footer>
  );
}
```

---

## Step 6: Deploy করুন

Vercel এ deploy করতে:

```bash
git add .
git commit -m "Add Google AdSense setup"
git push
```

Vercel automatically deploy করবে।

**Vercel Environment Variables:**
1. Vercel Dashboard > Project > Settings > Environment Variables
2. এই 5টি variables add করুন:
   - `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
   - `NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT`
   - `NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT`
   - `NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT`
   - `NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT`

---

## Ad Unit Components Reference

### 1. HorizontalAdUnit (728x90 or responsive)
```jsx
<HorizontalAdUnit slot="topBanner" className="my-6" />
```

### 2. VerticalAdUnit (300x600)
```jsx
<VerticalAdUnit slot="sidebar" className="sticky top-4" />
```

### 3. SquareAdUnit (300x300)
```jsx
<SquareAdUnit slot="sidebar" />
```

### 4. InContentAdUnit (728x280, in-article format)
```jsx
<InContentAdUnit slot="inContent" />
```

### 5. ResponsiveAdUnit (auto-responsive)
```jsx
<ResponsiveAdUnit slot="topBanner" />
```

---

## Earnings কীভাবে শুরু হয়?

1. **Ads serve হতে সময় লাগে:**
   - AdSense script load হওয়ার পর 24-48 ঘণ্টা অপেক্ষা করুন
   - Ads দেখা না গেলে console এ error check করুন

2. **Minimum Traffic দরকার:**
   - Google automated bots দেখবে ads safe place এ আছে কিনা
   - Valid traffic থাকতে হবে

3. **AdSense Policies মেনে চলতে হবে:**
   - Invalid clicks generate করবেন না
   - Users কে click করতে force করবেন না
   - Ads এর উপরে "Advertisements" label রাখুন

4. **Earnings গণনা:**
   - প্রতি month ৮ম এর মধ্যে পূর্ববর্তী মাসের earnings পাবেন
   - Minimum $100 পেমেন্ট threshold আছে

---

## Troubleshooting

### Ads show হচ্ছে না?

1. **Publisher ID check করুন:**
   ```bash
   # Terminal এ check করুন
   echo $NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
   ```

2. **AdSense script load হয়েছে কিনা check করুন:**
   - Browser DevTools > Network tab
   - `adsbygoogle.js` search করুন

3. **Console errors check করুন:**
   - DevTools > Console tab
   - AdSense related errors দেখুন

4. **Server restart করুন:**
   ```bash
   npm run dev
   ```

5. **Local development এ ads দেখা না যাওয়া normal:**
   - Local development এ Google adsense work করে না
   - Production (Vercel) এ test করুন

### Low CPM/Earnings?

- Content quality improve করুন
- Traffic বাড়ান
- Ad placement optimize করুন
- Blocking settings review করুন (Settings > Blocking > Sensitive categories)

---

## Best Practices

✅ **Do's:**
- Ad placement naturally integrate করুন
- Content quality high রাখুন
- Regular traffic generate করুন
- All policies follow করুন

❌ **Don'ts:**
- Invalid clicks generate করবেন না
- Ad farms তৈরি করবেন না
- Misleading content রাখবেন না
- Click farms use করবেন না

---

## সাহায্যের জন্য

- **Google AdSense Help:** https://support.google.com/adsense/
- **AdSense Policies:** https://support.google.com/adsense/answer/48182
- **Get Help:** https://adsense.google.com/gethelp

---

**আপনার website সম্পূর্ণভাবে AdSense ready! 🎉**

এখন শুধু approval পেতে অপেক্ষা করুন এবং earning শুরু করুন!
