# 🏠 Smart Home Affiliate System - Complete Setup Guide

## Project Overview

This is a **DEPLOY-READY** affiliate marketing platform built with:
- **Next.js 16** (App Router)
- **MongoDB** (Database)
- **Tailwind CSS** (Styling)
- **Vercel** (Deployment)
- **SEO Optimized**

## 📋 Project Structure

```
smart-home-affiliate/
├── app/
│   ├── page.tsx                 # Home page with products
│   ├── layout.tsx               # Global layout & metadata
│   ├── admin/                   # Admin panel
│   │   ├── page.jsx             # Dashboard
│   │   ├── layout.jsx           # Admin layout with sidebar
│   │   ├── products/            # View all products
│   │   ├── add-product/         # Add new product form
│   │   ├── blogs/               # Manage blogs
│   │   └── analytics/           # View analytics
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.js         # GET/POST products
│   │   │   └── [id]/route.js    # GET/PUT/DELETE single product
│   │   └── blogs/
│   │       ├── route.js         # GET/POST blogs
│   │       └── [id]/route.js    # GET/PUT/DELETE single blog
│   ├── review/
│   │   └── page.jsx             # Review page
│   └── sitemap.xml/
│       └── route.js             # SEO sitemap
├── components/
│   ├── ProductCard.jsx          # Product display card
│   ├── Navbar.jsx               # Navigation bar
│   └── Sidebar.jsx              # Admin sidebar
├── lib/
│   ├── db.js                    # MongoDB connection
│   ├── seo.js                   # SEO utilities
│   └── ai.js                    # AI content generator (ready for OpenAI)
├── models/
│   ├── Product.js               # Product schema
│   └── Blog.js                  # Blog schema
├── public/
│   └── robots.txt               # SEO robots file
├── .env.local                   # Environment variables
└── package.json
```

## ⚙️ Setup Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a cluster
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Copy to `.env.local` as `MONGODB_URI`

#### Option B: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Run MongoDB service
3. Connection string: `mongodb://localhost:27017/smart-home-affiliate`

### Step 3: Configure Environment Variables

Edit `.env.local`:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
ADMIN_EMAILS=you@example.com,another-admin@example.com
ADMIN_PASSWORD=your_admin_password
```

For Google admin login, create a Google OAuth Web Client and add this redirect URI:

```
http://localhost:3000/api/auth/google/callback
```

For production, also add:

```
https://your-domain.com/api/auth/google/callback
```

### Step 4: Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## 🎯 Usage Guide

### Add Products

1. Go to http://localhost:3000/admin/add-product
2. Fill in product details:
   - Title
   - Price
   - Image URL
   - Rating
   - Affiliate Link (Amazon)
   - Description
3. Click "Add Product"

### View Admin Dashboard

- **Dashboard**: http://localhost:3000/admin (analytics & stats)
- **Products**: http://localhost:3000/admin/products (list all products)
- **Blogs**: http://localhost:3000/admin/blogs (list all blogs)
- **Analytics**: http://localhost:3000/admin/analytics (detailed stats)

### Home Page

- http://localhost:3000 (displays featured products)

### Review Page

- http://localhost:3000/review (detailed review page)

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Home Affiliate System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-home-affiliate.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Continue"
5. Add Environment Variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXT_PUBLIC_API_URL` - Your Vercel deployment URL
   - `NEXT_PUBLIC_SITE_URL` - Your domain
   - `NEXTAUTH_SECRET` - Random secret key
6. Click "Deploy"

### Step 3: Add Custom Domain (Optional)

1. In Vercel project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records (instructions provided by Vercel)

## 📊 API Endpoints

### Products

- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Blogs

- `GET /api/blogs` - List all blogs
- `POST /api/blogs` - Create blog
- `GET /api/blogs/[id]` - Get single blog
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

## 🔥 Features

✅ **Affiliate Product Management** - Add, edit, delete products
✅ **Blog System** - Create and manage review articles
✅ **Admin Dashboard** - Monitor clicks, views, conversions
✅ **SEO Optimized** - Meta tags, sitemap, robots.txt
✅ **Responsive Design** - Mobile-friendly UI
✅ **Fast Performance** - Next.js server-side rendering
✅ **MongoDB Integration** - Scalable database

## 📈 SEO Features

- ✅ Meta tags and Open Graph
- ✅ Dynamic sitemap generation
- ✅ robots.txt for crawlers
- ✅ Server-side rendering (SSR)
- ✅ Image optimization ready

## 🎯 Next Steps

1. **Add Products** - Start adding smart home products
2. **Create Content** - Write review blogs
3. **Setup Analytics** - Track clicks and conversions
4. **Monitor Performance** - Use admin dashboard
5. **Scale with SEO** - Add more content and backlinks

## 💰 Monetization

This system is ready for:
- Amazon Affiliate Links
- Google AdSense
- Sponsored content
- Commission tracking

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env.local`
- Verify MongoDB service is running
- Check firewall/network access

### Images Not Loading
- Ensure image URLs are valid
- Add domain to `next.config.ts` image optimization

### Admin Panel Not Working
- Clear browser cache
- Check browser console for errors
- Verify API connection

## 📞 Support

For issues:
1. Check error logs in terminal
2. Review browser console (F12)
3. Check MongoDB Atlas/Local database connection

## 🎓 Learning Resources

- Next.js Docs: https://nextjs.org/docs
- MongoDB: https://docs.mongodb.com/
- Tailwind CSS: https://tailwindcss.com/docs

---

**Ready to deploy and earn? Let's build your affiliate empire! 🚀**
