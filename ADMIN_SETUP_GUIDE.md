# Admin Panel Setup Guide

## 🔐 Default Credentials

Default credentials for the admin panel have been created:

```
Email:    admin@smartome.local
Password: SmartAdmin123!@#
```

### 📋 Credentials Location
- Stored in the `.env.local` file
- To change them, edit these variables:
  - `ADMIN_DEFAULT_EMAIL`
  - `ADMIN_DEFAULT_PASSWORD`
  - `ADMIN_DEFAULT_FULLNAME`

---

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```
This will install `bcryptjs` and other dependencies.

### Step 2: Database Seeding
```bash
npm run seed:admin
```

This command will:
- Connect to MongoDB
- Create the default admin user
- Automatically hash the password

### Step 3: Start Development Server
```bash
npm run dev
```

Navigate to the website: `http://localhost:3000`

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
Log in using the admin email and password.

---

## ⚙️ Authentication System

### Supported Login Methods
1. **Password-based Login** (using your email and password)
2. **Google OAuth** (using a Google account - if configured)

### Password Requirements
Password requirements:
- ✅ At least 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (e.g. !@#$%^&*)

---

## 👤 User Management

### Admin Roles
```
1. super_admin    - Full access (default)
2. admin          - Products, Blogs, Analytics
3. editor         - Content editing only
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
1. Log in to the admin panel
2. Go to Settings/Profile
3. Click "Change Password"
4. Enter your old and new passwords
5. Click Save

### Password Reset
If you forget the password:
```bash
# This will reset the default admin user
npm run seed:admin
```

---

## 🛡️ Security Features

### Implemented
- ✅ Password hashing (bcryptjs - 10 salt rounds)
- ✅ Secure session tokens (HMAC based)
- ✅ HTTP-only cookies
- ✅ Login attempt tracking
 - ✅ Account locking (after 5 attempts for 15 minutes)
- ✅ CSRF protection

### Recommended
- [ ] Enable HTTPS/SSL (required in production)
- [ ] Change default password immediately
- [ ] Set a strong NEXTAUTH_SECRET
- [ ] Enable 2FA (if possible)

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
**Solution:**
- Check the email format
- Re-type the password (case-sensitive)
- Use the default credentials

### Issue: Account is locked
**Solution:**
- Wait 15 minutes (auto unlock)
- Manually unlock from the database:
```bash
db.adminusers.updateOne(
  { email: "admin@smartome.local" },
  { $set: { loginAttempts: 0 }, $unset: { lockedUntil: 1 } }
)
```

### Issue: MongoDB connection error
**Solution:**
**Solution:**
- Check that MongoDB is running
- Verify the `MONGODB_URI` is correct
- Verify the connection string format

### Issue: Password hashing fails
**Solution:**
**Solution:**
- Ensure `bcryptjs` is installed: `npm install bcryptjs`
- Ensure Node version is compatible (Node 14+)

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

For support / issues:
1. Check your `.env.local` configuration
2. Verify the MongoDB connection
3. Check browser console for error messages
4. Check server logs (in the `npm run dev` terminal)

---

**Created:** June 2026  
**Last Updated:** June 13, 2026  
**Version:** 1.0
