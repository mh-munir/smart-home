# Google AdSense Quick Reference

## Your AdSense Setup Complete! ✅

### What has been set up?

**Files Created:**
- ✅ `lib/adsense-config.js` - AdSense configuration
- ✅ `components/GoogleAdSenseScript.tsx` - AdSense script loader
- ✅ `components/AdUnits.tsx` - Ad display components
- ✅ `app/layout.tsx` - AdSense script integration
- ✅ `.env.local` - Environment variables

### AdSense Components

```jsx
// Horizontal Ads (728x90, 970x90)
import { HorizontalAdUnit } from "@/components/AdUnits";
<HorizontalAdUnit slot="topBanner" />

// Vertical Ads (300x600)
import { VerticalAdUnit } from "@/components/AdUnits";
<VerticalAdUnit slot="sidebar" />

// Square Ads (300x300)
import { SquareAdUnit } from "@/components/AdUnits";
<SquareAdUnit slot="sidebar" />

// In-Content Ads (728x280, in-article format)
import { InContentAdUnit } from "@/components/AdUnits";
<InContentAdUnit slot="inContent" />

// Responsive Ads (auto-adjust)
import { ResponsiveAdUnit } from "@/components/AdUnits";
<ResponsiveAdUnit slot="topBanner" />
```

---

## করার কাজ: Step-by-Step

### 1️⃣ Create a Google AdSense account
```
https://www.google.com/adsense/start/
→ Your website URL: https://smart-home-products.vercel.app
→ Wait 1-2 days for approval
```

### 2️⃣ Get Publisher ID and Ad Slots
```
AdSense Dashboard:
→ Settings > Account
→ Publisher ID: ca-pub-xxxxxxxxxxxxxxxx (copy)

Ads > Ad units:
→ Create 4 new ad units
→ Copy each Slot ID
```

### 3️⃣ Update `.env.local`
```bash
# Uncomment or add the following lines in `.env.local`:

NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=1234567893
```

### 4️⃣ Add ads to pages
```jsx
// app/page.tsx (Homepage)
import { HorizontalAdUnit } from "@/components/AdUnits";

export default function Home() {
  return (
    <div>
      <HorizontalAdUnit slot="topBanner" />
      {/* page content */}
    </div>
  );
}
```

### 5️⃣ Deploy
```bash
npm run dev  # local test (ads might not show locally)
git push    # Deploy to Vercel
```

### 6️⃣ Set Vercel Environment Variables
```
Vercel Dashboard > Project Settings > Environment Variables
→ NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
→ NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT
→ NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT
→ NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT
→ NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT
```

---

## Earnings Timeline

| Time | What happens |
|------|---------------|
| Day 1 | Create AdSense account and start setup |
| Day 2 | Approval pending (typically 1-2 days) |
| Day 3-4 | Configure settings after approval |
| Day 5-6 | Deploy to production |
| Week 2-3 | Ads begin serving |
| Month end | Earnings appear (depends on pageviews) |

---

## Expected RPM Ranges

**For Smart Home content:**
- **Low Traffic:** $1-5 RPM
- **Medium Traffic:** $5-15 RPM
- **High Traffic:** $15-50+ RPM

(RPM = Revenue Per 1000 impressions)

---

## Important AdSense URLs

| Link | Purpose |
|------|---------|
| https://www.google.com/adsense/start/ | AdSense Sign Up |
| https://adsense.google.com/ | Dashboard |
| https://support.google.com/adsense/ | Help Center |
| https://support.google.com/adsense/answer/48182 | Policies |

---

## Troubleshooting Checklist

- [ ] Is the Google AdSense account approved?
- [ ] Does the Publisher ID start with `ca-pub-`?
- [ ] Are all 4 ad slots created?
- [ ] Have you updated `.env.local`?
- [ ] Have you set Vercel environment variables?
- [ ] Have you redeployed to Vercel?
- [ ] Any errors in the browser console?
- [ ] Have you waited 24-48 hours for propagation?

---

## Best Practices

✅ **Do's:**
- Use natural placements
- Avoid excessive ads
- Maintain high content quality
- Generate regular organic traffic

❌ **Don'ts:**
- Do not engage in click fraud
- Do not use auto-clicking tools
- Avoid misleading content
- Do not cluster multiple ad units in one spot

---

## Need help?

📧 **Google Support:** https://adsense.google.com/gethelp
📚 **Documentation:** `ADSENSE_SETUP_GUIDE.md`
📝 **Example Code:** `ADSENSE_EXAMPLE.jsx`

---

**Your website is now fully ready to be monetized! 🚀**
