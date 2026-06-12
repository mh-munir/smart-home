# Admin Panel Setup Guide

## 🔐 Default Credentials

আপনার admin panel এর জন্য default credentials তৈরি করা হয়েছে:

```
Email:    admin@smartome.local
Password: SmartAdmin123!@#
```

### 📋 Credentials Location
- `.env.local` ফাইলে store করা আছে
- পরিবর্তন করতে এই variables edit করুন:
  - `ADMIN_DEFAULT_EMAIL`
  - `ADMIN_DEFAULT_PASSWORD`
  - `ADMIN_DEFAULT_FULLNAME`

---

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```
এটি `bcryptjs` এবং অন্যান্য dependencies install করবে।

### Step 2: Database Seeding
```bash
npm run seed:admin
```

এই command:
- MongoDB তে connect করবে
- Default admin user তৈরি করবে
- Password automatically hash করবে

### Step 3: Start Development Server
```bash
npm run dev
```

Website এ navigate করুন: `http://localhost:3000`

---

## 🔑 Admin Panel Access

### Web Address
```
http://localhost:3000/admin/login
```

Production এ:
```
https://your-domain.com/admin/login
```

### Login Method
আপনার admin panel password দিয়ে login করতে পারেন।

---

## ⚙️ Authentication System

### Supported Login Methods
1. **Password-based Login** (আপনার ইমেইল এবং পাসওয়ার্ড দিয়ে)
2. **Google OAuth** (Google account দিয়ে - যদি configured থাকে)

### Password Requirements
মিনিমাম password standards:
- ✅ কমপক্ষে ৮ ক্যারেক্টার
- ✅ কমপক্ষে একটি uppercase letter (A-Z)
- ✅ কমপক্ষে একটি lowercase letter (a-z)
- ✅ কমপক্ষে একটি number (0-9)
- ✅ কমপক্ষে একটি special character (!@#$%^&* ইত্যাদি)

---

## 👤 User Management

### Admin Roles
```
1. super_admin    - সব কিছুর access (default)
2. admin          - Products, Blogs, Analytics
3. editor         - শুধু content editing
```

### Default Permissions (super_admin)
- ✅ Manage Products
- ✅ Manage Blogs  
- ✅ Manage Hero Slides
- ✅ Manage Admin Users
- ✅ View Analytics

---

## 🔄 Password Management

### Change Your Password
1. Admin panel এ login করুন
2. Settings/Profile এ যান
3. "Change Password" এ click করুন
4. পুরনো এবং নতুন password enter করুন
5. Save করুন

### Password Reset
যদি password ভুলে যান:
```bash
# এটি default admin user reset করবে
npm run seed:admin
```

---

## 🛡️ Security Features

### Implemented
- ✅ Password hashing (bcryptjs - 10 salt rounds)
- ✅ Secure session tokens (HMAC based)
- ✅ HTTP-only cookies
- ✅ Login attempt tracking
- ✅ Account locking (5 attempts এর পর 15 minutes)
- ✅ CSRF protection

### Recommended
- [ ] Enable HTTPS/SSL (production এ আবশ্যক)
- [ ] Change default password immediately
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable 2FA (যদি সম্ভব হয়)

---

## 📊 Admin Database Schema

### AdminUser Model
```javascript
{
  email: String (unique, indexed),
  password: String (hashed),
  fullName: String,
  role: String (super_admin, admin, editor),
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockedUntil: Date,
  permissions: {
    manageProducts: Boolean,
    manageBlogs: Boolean,
    manageHeroSlides: Boolean,
    manageAdmins: Boolean,
    viewAnalytics: Boolean
  },
  timestamps: { createdAt, updatedAt }
}
```

---

## 🔧 Environment Variables

### Required Variables
```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Auth Secret (for session tokens)
NEXTAUTH_SECRET=your_secret_key

# Default Admin Credentials
ADMIN_DEFAULT_EMAIL=admin@smartome.local
ADMIN_DEFAULT_PASSWORD=YourSecurePassword123!@#
ADMIN_DEFAULT_FULLNAME=Your Name
```

### Optional Variables
```env
# Google OAuth (for Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Fallback Admin Password (legacy)
ADMIN_PASSWORD=fallback_password
ADMIN_EMAILS=email@example.com
```

---

## ⚠️ Important Notes

### ⛔ MUST DO
1. **Change default password immediately** after first login
2. **Set a strong NEXTAUTH_SECRET** in production
3. **Enable HTTPS/SSL** in production
4. **Keep .env.local secure** - never commit to git

### ❌ DON'T DO
1. Don't use weak passwords
2. Don't share credentials via email/chat
3. Don't commit .env.local to version control
4. Don't use development credentials in production

---

## 🐛 Troubleshooting

### Issue: Login fails with "Invalid email or password"
**Solution:**
- Email correct format check করুন
- Password typing again করুন (case-sensitive)
- Default credentials ব্যবহার করুন

### Issue: Account is locked
**Solution:**
- 15 minutes wait করুন (auto unlock)
- Database থেকে manually unlock করুন:
```bash
db.adminusers.updateOne(
  { email: "admin@smartome.local" },
  { $set: { loginAttempts: 0 }, $unset: { lockedUntil: 1 } }
)
```

### Issue: MongoDB connection error
**Solution:**
- MongoDB running check করুন
- MONGODB_URI correct check করুন
- Connection string format verify করুন

### Issue: Password hashing fails
**Solution:**
- bcryptjs installed check করুন: `npm install bcryptjs`
- Node version compatible check করুন (Node 14+)

---

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Run database seeding (create default admin)
npm run seed:admin

# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint
```

---

## 🔐 Security Checklist

Before going production:
- [ ] Changed default admin password
- [ ] Set secure NEXTAUTH_SECRET
- [ ] Enabled HTTPS/SSL
- [ ] Configured production MongoDB URI
- [ ] Removed debug logs
- [ ] Set NODE_ENV=production
- [ ] Backed up database
- [ ] Tested admin login flow
- [ ] Reviewed security headers

---

## 📞 Support

Issues এর জন্য:
1. Check আপনার `.env.local` configuration
2. MongoDB connection verify করুন
3. Browser console এর error messages check করুন
4. Server logs দেখুন (`npm run dev` terminal এ)

---

**Created:** June 2026  
**Last Updated:** June 13, 2026  
**Version:** 1.0
