# 🔐 Admin Panel - Quick Setup

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Seed Database (Create Admin User)
```bash
npm run seed:admin
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

### 4️⃣ Login to Admin Panel
**URL:** http://localhost:3000/admin/login

**Credentials:**
```
Email:    admin@smartome.local
Password: SmartAdmin123!@#
```

---

## ✅ You're Done!

Your admin panel is now ready to use. After first login, **change your password immediately**.

---

## 📝 Default Credentials

| Property | Value |
|----------|-------|
| **Email** | admin@smartome.local |
| **Password** | SmartAdmin123!@# |
| **Role** | Super Admin |
| **URL** | http://localhost:3000/admin/login |

---

## 🔒 Password Stored In

- `.env.local` → `ADMIN_DEFAULT_PASSWORD`
- Database → `AdminUser` collection (hashed)
- Session → JWT token

---

## ⚠️ Important!

✔️ **After First Login:**
1. Go to Settings/Profile
2. Change your password to something secure
3. Update `.env.local` with new password

---

## 🆘 If Something Goes Wrong

### Admin not created?
```bash
npm run seed:admin
```

### Can't login?
- Check email is correct
- Check password spelling (case-sensitive)
- Check MongoDB is running

### Forgot password?
- Reset with: `npm run seed:admin`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Stores default credentials |
| `models/AdminUser.js` | Admin user schema |
| `lib/password-utils.js` | Password hashing/validation |
| `app/api/auth/login/route.js` | Login API endpoint |
| `scripts/seed-admin.js` | Create default admin |

---

## 🎯 What You Can Do Now

- ✅ Add/Edit/Delete Products
- ✅ Manage Blog Posts
- ✅ Create Hero Slider Content
- ✅ View Analytics
- ✅ Track Affiliate Clicks
- ✅ Manage Other Admin Users

---

## 📞 Need Help?

Read the full guide: `ADMIN_SETUP_GUIDE.md`

---

**Status:** ✅ Ready to Use  
**Created:** June 13, 2026
