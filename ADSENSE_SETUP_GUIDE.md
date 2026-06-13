# Google AdSense Setup Guide

A complete guide to adding Google AdSense earnings to your website.

## Step 1: Set up a Google AdSense account

### 1.1 Join Google AdSense:
1. Go to https://www.google.com/adsense/start/
2. Sign in with your Google Account
3. Enter your website URL: `https://smart-home-products.vercel.app`
4. Select your country and content category
5. Agree to AdSense policy and submit

### 1.2 Wait for approval:
- Google will check your website in about 1-2 days
- To get approval, you should meet these criteria:
  - Your website should have at least 6 months of content (already met)
  - Have some traffic
  - Original content (already met)
  - Follow Google policies

**Our website is ready:**
✅ High-quality smart home content  
✅ 28+ Products  
✅ Professional layout  
✅ Good SEO setup

---

## Step 2: Get Publisher ID and Ad Slots

After approval:

1. **Open Google AdSense Dashboard:** https://adsense.google.com/
2. **Settings > Account:** you'll find your Publisher ID
   - **Your Publisher ID:** `pub-4755389845351116` ✅
   - **Customer ID:** 5184618414
   - Copy this value

3. **Download the Ads.txt file:**
   - Settings > Account > Account info > Ads.txt
   - Place it in the `public/` folder (or add to Vercel deployment)

---

## Step 3: Create Ad Slots

In the Google AdSense Dashboard:

1. **Left menu > Ads > Ad units**
2. Click **+ New ad unit**

### Create 4 Ad Slots:

#### Slot 1: Top Banner (728x90)
- **Name:** Top Banner
- **Size:** 728x90 (Leaderboard) or Responsive
- **Type:** Display Ad
- **Copy:** Slot ID (e.g., `1234567890`)

#### Slot 2: Sidebar (300x600)
- **Name:** Sidebar
- **Size:** 300x600 (Half Page) or 300x250 (Medium Rectangle)
- **Type:** Display Ad
- **Copy:** Slot ID

#### Slot 3: In-Content (728x280)
- **Name:** In-Content
- **Size:** 728x280 or Responsive
- **Type:** Display Ad
- **Copy:** Slot ID

#### Slot 4: Bottom Banner (970x90)
- **Name:** Bottom Banner
- **Size:** 970x90 or 728x90
- **Type:** Display Ad
- **Copy:** Slot ID

---

## Step 4: Configure Environment Variables

Open the `.env.local` file and uncomment these lines:

```bash
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=1234567893
```

### Replace these values:
- `ca-pub-xxxxxxxxxxxxxxxx` → your Publisher ID
- `1234567890` → Top Banner Slot ID
- `1234567891` → Sidebar Slot ID
- `1234567892` → In-Content Slot ID
- `1234567893` → Bottom Banner Slot ID

---

## Step 5: Add Ad Units to the Website

### Top Banner (on the Homepage)

File: `app/page.tsx`

```jsx
import { HorizontalAdUnit } from "@/components/AdUnits";

export default function HomePage() {
  return (
    <div>
      <HorizontalAdUnit slot="topBanner" />
      {/* other content */}
    </div>
  );
}
```

### In-Content Ads on Product Pages

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

### Blog/Category Pages

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

### Bottom Banner in Footer

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

## Step 6: Deploy

To deploy to Vercel:

```bash
git add .
git commit -m "Add Google AdSense setup"
git push
```

Vercel will automatically deploy.

**Vercel Environment Variables:**
1. Vercel Dashboard > Project > Settings > Environment Variables
2. Add these 5 variables:
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

## How earnings begin

1. **Ads may take time to serve:**
   - Wait 24-48 hours after the AdSense script loads
   - If ads do not appear, check console for errors

2. **Minimum traffic required:**
   - Google automated bots will verify ads are placed safely
   - You need valid traffic

3. **Follow AdSense policies:**
   - Do not generate invalid clicks
   - Do not force users to click ads
   - Label ad placements with "Advertisements"

4. **Earnings and payouts:**
   - Earnings for the previous month are paid by the 8th of the following month
   - There is a minimum payment threshold of $100

---

## Troubleshooting

### Ads not showing?

1. **Check your Publisher ID:**
   ```bash
   # In the terminal, check:
   echo $NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
   ```

2. **Check if the AdSense script loaded:**
   - Browser DevTools > Network tab
   - Search for `adsbygoogle.js`

3. **Check console for errors:**
   - DevTools > Console tab
   - Look for AdSense related errors

4. **Restart the server:**
   ```bash
   npm run dev
   ```

5. **Ads not appearing in local development is normal:**
   - Google AdSense may not show ads locally
   - Test in production (Vercel)

### Low CPM / Earnings?

- Improve content quality
- Increase traffic
- Optimize ad placement
- Review blocking settings (Settings > Blocking > Sensitive categories)

---

## Best Practices

✅ **Do's:**
- Integrate ad placement naturally
- Keep content quality high
- Generate regular traffic
- Follow all policies

❌ **Don'ts:**
- Do not generate invalid clicks
- Do not create ad farms
- Do not publish misleading content
- Do not use click farms

---

## For help

- **Google AdSense Help:** https://support.google.com/adsense/
- **AdSense Policies:** https://support.google.com/adsense/answer/48182
- **Get Help:** https://adsense.google.com/gethelp

---

**Your website is fully AdSense ready! 🎉**

Now just wait for approval and start earning!
