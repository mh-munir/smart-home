# 🎯 Multi-Affiliate System - Getting Started Guide

## To Do Today (5 minutes)

```
✓ Step 1: Visit these 7 sites
  ├─ https://associates.amazon.com/
  ├─ https://portals.aliexpress.com/
  ├─ https://partnernetwork.ebay.com/
  ├─ https://affiliate.flipkart.com/
  ├─ https://affiliate.daraz.com.bd/
  ├─ https://affiliate.rokomari.com/
  └─ https://affiliate.ajio.com/

✓ Step 2: Copy your affiliate IDs from each

✓ Step 3: Run this command (in the terminal):
  npm run migrate:multi-affiliate

✓ Step 4: Restart the server:
  npm run dev

✓ Step 5: Experiment and verify!
```

## Step by Step (Detailed)

### 1. Sign up for affiliate networks

#### Amazon Associates
- Visit: https://associates.amazon.com/
- Click "Sign Up"
- Provide your name, email, and payment details
- Find the "Associate Tag" (looks like `yourname-20`)
- **Copy it to a safe note**

#### AliExpress
- Visit: https://portals.aliexpress.com/
- Log in with your account
- Find the promotional URL
- Extract the affiliate ID from the URL
- **Save it securely**

*(Same process for other networks)*

### 2. Update `.env.local`

**Open `.env.local` in VS Code**

Add your IDs:

```bash
# Amazon
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

**Save with `Ctrl+S`**

### 3. Migrate existing products

**Run this command in the terminal:**

```bash
npm run migrate:multi-affiliate
```

**Expected output:**
```
🔄 Starting product migration to multi-affiliate format...
✓ Connected to database
Found X products with single affiliate links
✓ Migrated: Product 1
✓ Migrated: Product 2
...
✓ Migration complete! X products migrated
```

### 4. Restart the server

**If the server is running, stop it:**
```
Ctrl+C
```

**Start again:**
```bash
npm run dev
```

**You should see:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### 5. Test it now!

**Open your browser:**
```
http://localhost:3000
```

**Open a product page**

**You should see:**
- ✅ "Buy on Amazon" (primary button)
- ✅ "More Options" (other networks)

**Open the dropdown and you should see:**
- AliExpress
- eBay
- Flipkart
- etc...

## Verification Checklist

```
□ Signed up for all 7 affiliate networks
□ Added your IDs to .env.local
□ Ran the migration script (completed successfully)
□ Restarted the server
□ See the "Buy on" button on the site
□ "More Options" dropdown is working
□ Check analytics API: curl http://localhost:3000/api/affiliate-stats
```

## Add affiliate links to new products

### Option A: Manually (easy)

1. Go to `/admin/products`
2. Create a new product
3. Paste links for each network
4. Save

### Option B: Script (fast)

Edit `scripts/add-affiliate-links.js`:

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
    // Add more networks
  },
};
```

Then run:
```bash
npm run add:affiliate-links
```

## Common Issues and Solutions

### Issue: Button not visible

**Solution:**
```bash
# 1. Check .env.local
#    - Are all variables added?
#    - Is at least one affiliate variable set?

# 2. Restart the server
#    Ctrl+C
#    npm run dev

# 3. Refresh the browser
#    Ctrl+R (Windows) or Cmd+R (Mac)
```

### Issue: Migration failed

**Solution:**
```bash
# Check MongoDB connection
# Verify MONGODB_URI in .env.local

# Retry:
npm run migrate:multi-affiliate
```

### Issue: Links not working

**Solution:**
```bash
# Open the browser console (F12)
# Click a link in the "More Options" dropdown
# Inspect the error
```

## Next steps (once setup is complete)

1. **View analytics**
  ```bash
  curl http://localhost:3000/api/affiliate-stats
  ```

2. **Optimize priorities**
  - Put the highest-converting networks first

3. **Market-specific strategy**
  - Bangladesh: Daraz/Rokomari first
  - India: Flipkart/AJIO first
  - Global: Amazon first

4. **Monitor regularly**
  - Check analytics weekly
  - Identify top performers
  - Remove broken/low-performing links

## Final tips

```
✅ DO:
  - Save all affiliate IDs securely
  - Check links regularly
  - Track analytics
  - Add links to new products

❌ DON'T:
  - Hard-code your IDs
  - Commit env files to git
  - Use inactive affiliate accounts
  - Skip regular link checks
```

## Help

If you run into issues:

1. Read `MULTI_AFFILIATE_QUICK_REF.md`
2. Read `MULTI_AFFILIATE_SETUP.md`
3. Check server logs
4. Check browser console (F12)

---

**Start now and increase your earnings!** 🚀💰
