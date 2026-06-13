# AdSense Script Loading Error - Debugging Guide

## ❌ Problem
```
AdSense script failed to load: {}
```

The error object is empty, making it difficult to identify the root cause. This guide helps diagnose the issue.

---

## 🔍 Step 1: Verify Configuration

### Check Your Publisher ID Format
```bash
# Your current ID should look like:
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-8998788891126313
```

**Expected format:** `pub-XXXXXXXXXXXXXXXX` (18 digits after `pub-`)

---

## 🔍 Step 2: Browser Console Debugging

1. **Open Developer Tools** → Press `F12`
2. **Go to Console tab**
3. **Check for these messages:**
   - ✅ `✅ AdSense script tag loaded` → Script tag was added
   - ✅ `✅ AdSense library loaded successfully` → Script executed
   - ❌ `❌ AdSense script failed to load` → Script didn't load

### Common Network Errors to Look For:

| Error | Cause | Solution |
|-------|-------|----------|
| `CORS error` | Cross-Origin blocked | Check CSP headers |
| `404 Not Found` | Wrong publisher ID | Verify `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` |
| `ERR_NAME_NOT_RESOLVED` | Network issue | Check internet connection |
| `content-security-policy` violation | CSP blocking the script | Add script-src to CSP |

---

## 🔍 Step 3: Check Network Tab

1. **Open DevTools** → **Network tab**
2. **Filter by:** `adsbygoogle`
3. **Look for the request:**

```
URL: https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8998788891126313
```

| Status | Meaning |
|--------|---------|
| `200` | ✅ Script loaded successfully |
| `404` | ❌ Publisher ID is invalid |
| `(blocked)` | ❌ CSP or ad blocker blocking it |
| `(failed)` | ❌ Network error |

---

## 🔍 Step 4: Check for Ad Blockers

1. **Disable all browser extensions:**
   - uBlock Origin
   - Adblock Plus
   - Ghostery
   - etc.

2. **Try in Incognito mode** (should disable extensions)

3. **If it works in Incognito:**
   - Ad blocker is blocking AdSense
   - Add your site to whitelist

---

## 🔍 Step 5: Verify AdSense Account Status

1. Go to [AdSense Console](https://adsense.google.com/)
2. Check:
   - ✅ Account is **APPROVED** (not pending/suspended)
   - ✅ Publisher ID is correct
   - ✅ No payment holds or warnings
   - ✅ You're in a supported country/region

### If Account Not Approved:
- AdSense script won't load for unapproved accounts
- Wait for Google's approval (usually 24-48 hours)
- Ensure your site meets AdSense policies

---

## 🔍 Step 6: Check Next.js Configuration

### Issue: Script Strategy Problem

Your `.env.local` might be getting cleared. Verify:

```bash
# In your .env.local file
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-8998788891126313

# Run this to verify it's loaded:
echo $NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
```

### Solution if .env variables aren't loading:
```bash
# 1. Restart Next.js dev server
npm run dev

# 2. Clear .next cache
rm -rf .next

# 3. Restart dev server again
npm run dev
```

---

## 🔍 Step 7: Check for CSP Headers

Create/update `next.config.ts` to add CSP headers:

```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://pagead.googlesyndication.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🔍 Step 8: Test AdSense Script Manually

Add this to your browser console and run it:

```javascript
// Test if AdSense script can load
fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8998788891126313')
  .then(res => {
    console.log('AdSense script accessible:', res.status);
    if (res.status === 200) {
      console.log('✅ Script is reachable');
    } else {
      console.log('❌ Script returned:', res.status);
    }
  })
  .catch(err => console.error('❌ Cannot reach AdSense:', err));
```

---

## ✅ Solutions Checklist

- [ ] Verify `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` format is correct
- [ ] Check AdSense account is **APPROVED**
- [ ] Restart dev server: `npm run dev`
- [ ] Clear .next cache: `rm -rf .next`
- [ ] Check browser console for specific errors
- [ ] Check Network tab for 404/blocked status
- [ ] Disable ad blockers and try again
- [ ] Test in Incognito mode
- [ ] Add CSP headers if needed
- [ ] Verify internet connection

---

## 📝 Debug Output Format

When reporting issues, provide:

```
Browser: Chrome/Firefox/Safari
Console Message: [exact error message]
Network Status: [200/404/blocked]
Ad Blocker: [yes/no]
AdSense Status: [approved/pending/suspended]
Publisher ID: pub-XXXXXXXXXXXX (last 8 digits)
```

---

## 🆘 Still Not Working?

1. **Check [AdSense Help](https://support.google.com/adsense/)**
2. **Try official AdSense code example on your site**
3. **Contact Google AdSense support**
4. **Consider using alternative ad networks temporarily**

