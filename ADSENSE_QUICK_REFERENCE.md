# Google AdSense Quick Reference

## আপনার AdSense Setup Complete! ✅

### কি কি Setup করা হয়েছে?

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

### 1️⃣ Google AdSense Account Create করুন
```
https://www.google.com/adsense/start/
→ আপনার website URL: https://smart-home-products.vercel.app
→ Approval পেতে 1-2 দিন অপেক্ষা করুন
```

### 2️⃣ Publisher ID এবং Ad Slots পান
```
AdSense Dashboard:
→ Settings > Account
→ Publisher ID: ca-pub-xxxxxxxxxxxxxxxx (copy করুন)

Ads > Ad units:
→ 4টি new ad unit create করুন
→ প্রতিটির Slot ID copy করুন
```

### 3️⃣ .env.local Update করুন
```bash
# .env.local এ এই lines uncomment করুন:

NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=1234567893
```

### 4️⃣ Pages এ Ads Add করুন
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

### 5️⃣ Deploy করুন
```bash
npm run dev  # local test (ads দেখা না যেতে পারে)
git push    # Vercel এ deploy করুন
```

### 6️⃣ Vercel Environment Variables Set করুন
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

| টাইম | কি হয় |
|------|--------|
| Day 1 | AdSense setup করুন |
| Day 2 | Approval pending (1-2 দিন) |
| Day 3-4 | Approval হলে setup করুন |
| Day 5-6 | Production এ deploy করুন |
| Week 2-3 | Ads serve হতে শুরু করে |
| Month end | Earnings দেখা যায় (Page সংখ্যা অনুযায়ী) |

---

## Expected RPM Ranges

**Smart Home Content এর জন্য:**
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

- [ ] Google AdSense account approved?
- [ ] Publisher ID এ `ca-pub-` থাকে?
- [ ] All 4 Ad Slots created?
- [ ] `.env.local` update করেছেন?
- [ ] Vercel environment variables set করেছেন?
- [ ] Vercel redeploy করেছেন?
- [ ] Console এ errors আছে?
- [ ] 24-48 hours অপেক্ষা করেছেন?

---

## সেরা Practices

✅ **Do's:**
- Natural placement এ রাখুন
- Too many ads না রাখলেন ভালো
- Content quality maintain করুন
- নিয়মিত traffic generate করুন

❌ **Don'ts:**
- Click fraud করবেন না
- Auto-clicking tools ব্যবহার করবেন না
- Misleading content রাখবেন না
- Multiple ad units এক জায়গায় না রাখলেন

---

## সাহায্য প্রয়োজন?

📧 **Google Support:** https://adsense.google.com/gethelp
📚 **Documentation:** `ADSENSE_SETUP_GUIDE.md`
📝 **Example Code:** `ADSENSE_EXAMPLE.jsx`

---

**আপনার website এখন Monetize করার জন্য সম্পূর্ণভাবে প্রস্তুত! 🚀**
