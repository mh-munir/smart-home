# 🌍 Multi-Country SEO & Google Ads Setup Guide

**Date:** June 8, 2026  
**Status:** Complete Configuration Ready  

---

## 📋 Setup Instructions

### Step 1: Get Your Tracking IDs

#### A. Google Tag Manager (GTM)
1. Go to: https://tagmanager.google.com/
2. Sign in with your Google account
3. Create a new container for your domain
4. Copy your **GTM ID** (format: `GTM-XXXXXXXXX`)

#### B. Google Analytics 4 (GA4)
1. Go to: https://analytics.google.com/
2. Create a new property for your website
3. Set up a web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

#### C. Google Ads Conversion Tracking
1. Go to: https://ads.google.com/
2. Navigate to Tools → Conversions
3. Create conversion actions for:
   - Product View
   - Add to Cart
   - Purchase
   - Newsletter Signup
   - Contact Form
4. Copy your **Conversion ID** (format: `AW-XXXXXXXXXX`)
5. Copy each **Conversion Label** (format: `AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX`)

---

### Step 2: Update Environment Variables

Create/Update `.env.local` file:

```bash
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXXX

# Google Analytics 4
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX

# Conversion Labels (Get from Google Ads)
NEXT_PUBLIC_CONVERSION_LABEL_VIEW_PRODUCT=AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX
NEXT_PUBLIC_CONVERSION_LABEL_ADD_TO_CART=AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX
NEXT_PUBLIC_CONVERSION_LABEL_PURCHASE=AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX
NEXT_PUBLIC_CONVERSION_LABEL_NEWSLETTER=AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX
NEXT_PUBLIC_CONVERSION_LABEL_CONTACT=AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX
```

---

### Step 3: Add Tracking to Your Pages

#### On Homepage

Update your homepage component to track page views:

```typescript
'use client';
import { useTracking } from '@/components/GoogleAnalyticsComponent';

export default function HomePage() {
  useTracking(); // Auto-track page view
  
  return (
    <main>
      {/* Your content */}
    </main>
  );
}
```

#### On Product Pages

```typescript
'use client';
import { useProductTracking, trackProductView } from '@/components/GoogleAnalyticsComponent';
import { trackEvent } from '@/lib/google-ads';

export default function ProductPage({ product }) {
  useProductTracking(product); // Auto-track product view
  
  const handleAddToCart = () => {
    trackEvent('add_to_cart', {
      value: product.price,
      currency: 'USD',
      items: [{
        item_id: product._id,
        item_name: product.name,
        price: product.price,
      }]
    });
  };

  return (
    <div>
      {/* Your product content */}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

#### On Checkout/Purchase

```typescript
import { trackPurchase } from '@/lib/google-ads';

function completeCheckout(orderData) {
  trackPurchase({
    transaction_id: orderData.id,
    value: orderData.total,
    currency: 'USD',
    items: orderData.items.map(item => ({
      item_id: item._id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  });
}
```

---

## 🌍 Multi-Country SEO Configuration

### Supported Countries (18+)

Your website now supports Amazon marketplace countries:

| Country | Locale | Domain | Currency |
|---------|--------|--------|----------|
| United States | en-US | /us | USD |
| United Kingdom | en-GB | /en-gb | GBP |
| Germany | de-DE | /de | EUR |
| France | fr-FR | /fr | EUR |
| Italy | it-IT | /it | EUR |
| Spain | es-ES | /es | EUR |
| Canada | en-CA | /en-ca | CAD |
| Mexico | es-MX | /es-mx | MXN |
| Brazil | pt-BR | /pt-br | BRL |
| Japan | ja-JP | /ja | JPY |
| Australia | en-AU | /en-au | AUD |
| India | en-IN | /en-in | INR |
| Netherlands | nl-NL | /nl | EUR |
| Sweden | sv-SE | /sv | SEK |
| Poland | pl-PL | /pl | PLN |
| Egypt | ar-EG | /ar-eg | EGP |
| Saudi Arabia | ar-SA | /ar-sa | SAR |
| UAE | ar-AE | /ar-ae | AED |
| Singapore | en-SG | /en-sg | SGD |

### Hreflang Tags

✅ **Automatically Added** in layout.tsx

These tags tell Google about your multi-country versions:

```html
<link rel="alternate" hrefLang="en-US" href="https://smart-home.vercel.app" />
<link rel="alternate" hrefLang="en-GB" href="https://smart-home.vercel.app/en-gb" />
<link rel="alternate" hrefLang="de-DE" href="https://smart-home.vercel.app/de" />
<!-- ... more countries ... -->
<link rel="alternate" hrefLang="x-default" href="https://smart-home.vercel.app" />
```

### Automatic User Localization

✅ **Middleware configured** in middleware.ts

- Detects user's country from CloudFlare geo headers
- Detects user's preferred language from Accept-Language header
- Redirects to appropriate locale version

---

## 🎯 Google Ads Campaign Setup

### Campaign Structure

Create these campaign types:

#### 1. **Search Campaigns**
- Target keywords for each country
- Keyword: "home smart products" + country-specific terms
- Landing page: Your homepage or category pages

#### 2. **Shopping Campaigns**
- Feed product data from your database
- Target: "smart home products", "smart devices", etc.
- Landing pages: Individual product pages

#### 3. **Remarketing Campaigns**
- Audience: Users who visited your site
- Ad copy: Highlight specific products they viewed
- Frequency: Show ads 2-3 times per week

#### 4. **Branded Campaigns**
- Protect brand mentions
- Target your brand name + variations
- High bid to win top position

### Conversion Tracking Setup in Google Ads

1. **Link your GTM container**
   - In Google Ads → Tools & Settings → Conversions
   - Link GTM container for automatic tracking

2. **Create Conversion Actions**
   ```
   Conversion Name: Product View
   Category: Purchase/Signup
   Count: Every conversion
   
   Conversion Name: Add to Cart
   Category: Add to cart
   
   Conversion Name: Purchase
   Category: Purchase
   Value: Dynamic (from your cart)
   Currency: Dynamic or USD
   
   Conversion Name: Newsletter Signup
   Category: Sign up
   
   Conversion Name: Contact Form
   Category: Inquiry
   ```

3. **Set Attribution Model**
   - Recommended: Time decay (90 days)
   - Or: Data-driven if you have enough conversions

---

## 📊 Available Tracking Events

### Automatic Events (Tracked by GA4)
- ✅ Page views
- ✅ Scroll depth
- ✅ Clicks
- ✅ Form submissions
- ✅ Video plays (if using YouTube embeds)

### Custom Events (You Need to Track)

#### Product Events
```javascript
// Product view
trackProductView({
  id: 'product_123',
  name: 'Smart Lock Pro',
  price: 199.99,
  currency: 'USD',
  category: 'Smart Locks'
});

// Add to cart
trackAddToCart({
  id: 'product_123',
  name: 'Smart Lock Pro',
  price: 199.99,
  quantity: 1,
  currency: 'USD'
});

// Purchase
trackPurchase({
  transaction_id: 'order_456',
  value: 199.99,
  currency: 'USD',
  items: [...]
});
```

#### User Engagement
```javascript
// Search
trackSearch('smart locks');

// Newsletter signup
trackNewsletterSignup();

// Contact form
trackContactForm('support_request');

// Custom event
trackEvent('product_comparison', {
  products_compared: 3,
  category: 'Smart Locks'
});
```

---

## 🔗 Integration with Your Components

### Tracking Hook Usage

**In your product listing component:**
```typescript
'use client';
import { trackEvent } from '@/lib/google-ads';

export function ProductCard({ product }) {
  const handleClick = () => {
    trackEvent('product_card_click', {
      product_id: product._id,
      product_name: product.name,
      product_price: product.price
    });
  };

  return (
    <div onClick={handleClick}>
      {/* Product content */}
    </div>
  );
}
```

**In your search component:**
```typescript
'use client';
import { trackSearch } from '@/lib/google-ads';

export function SearchBar() {
  const handleSearch = (query) => {
    trackSearch(query);
    // ... your search logic
  };

  return (
    <input
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(e.target.value);
      }}
    />
  );
}
```

---

## 📈 Performance Monitoring

### Monitor These Metrics in Google Ads:

1. **Click-Through Rate (CTR)**
   - Target: > 2% for top keywords
   
2. **Conversion Rate**
   - Target: > 1-3% depending on product
   
3. **Cost Per Acquisition (CPA)**
   - Monitor against profit margins
   
4. **Return on Ad Spend (ROAS)**
   - Target: > 3:1 (3x revenue per 1x ad spend)
   
5. **Quality Score**
   - Target: 7-10

### Monitor These Metrics in Google Analytics:

1. **Users by Country**
   - Analyze traffic distribution
   
2. **Conversion Rate by Device**
   - Mobile vs Desktop performance
   
3. **Bounce Rate**
   - Identify pages needing improvement
   
4. **Average Session Duration**
   - Engagement indicator
   
5. **Pages per Session**
   - Internal linking effectiveness

---

## ✅ Checklist

### Before Going Live
- [ ] Get GTM ID, GA4 ID, and Google Ads ID
- [ ] Add IDs to `.env.local`
- [ ] Test tracking with Google Tag Manager preview mode
- [ ] Verify events in Google Analytics real-time
- [ ] Set up Google Ads conversion actions
- [ ] Test complete flow (view product → add to cart → checkout)
- [ ] Verify hreflang tags in HTML head

### After Going Live
- [ ] Monitor daily data in Google Analytics
- [ ] Check Google Ads dashboard for conversions
- [ ] Review Search Console for indexation issues
- [ ] Analyze which countries drive most traffic
- [ ] Adjust bids for top-performing countries
- [ ] Create country-specific ad campaigns

### Monthly Tasks
- [ ] Review conversion data by country
- [ ] Optimize landing pages based on GTM/GA4 data
- [ ] Test new products in Google Ads
- [ ] Review and update hreflang tags
- [ ] Analyze multi-country SEO performance

---

## 🆘 Troubleshooting

### Events Not Recording in Google Analytics

1. Check if GA4 ID is correct in `.env.local`
2. Verify browser privacy settings allow tracking
3. Check for console errors in browser DevTools
4. Use Google Analytics Debugger extension
5. Check GTM preview mode for firing tags

### Conversions Not Recording in Google Ads

1. Verify conversion ID is correct
2. Check if conversion label matches exactly
3. Allow 24-48 hours for data to appear
4. Verify Google Ads account is properly linked
5. Check conversion tracking status in Google Ads

### Hreflang Tags Not Working

1. Verify tags are in `<head>` section
2. Check that all URLs are valid and canonical
3. Use Google Search Console to verify implementation
4. Allow 2-4 weeks for Google to process changes

---

## 📚 Resources

- [Google Tag Manager Setup](https://support.google.com/tagmanager)
- [Google Analytics 4 Setup](https://support.google.com/analytics)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722)
- [Hreflang Implementation](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Multi-Regional SEO Best Practices](https://developers.google.com/search/docs/beginner/international-sites)

---

## 🎉 You're Ready!

Your website is now fully configured for:
✅ Multi-country SEO  
✅ Google Ads tracking  
✅ Conversion monitoring  
✅ Performance analytics  

**Next Steps:**
1. Deploy your changes
2. Update environment variables
3. Monitor GTM/GA4 for data
4. Create Google Ads campaigns
5. Analyze and optimize daily

