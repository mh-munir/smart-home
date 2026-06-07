# 🧪 Quick Testing Guide - Dummy Data Setup

## Add Dummy Data in Just 3 Easy Steps!

---

## ✅ Step 1: MongoDB Connection Setup (1 Minute)

Choose one of these options in your `.env.local` file:

### Option A: Local MongoDB (Easiest - Current Setup)
```
MONGODB_URI=mongodb://localhost:27017/smart-home-affiliate
```
✅ Use this one for now!

### Option B: MongoDB Atlas (Cloud - Later)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-home-affiliate
```

**Use Option A for now!**

---

## ✅ Step 2: Start MongoDB Server

```bash
# Start MongoDB Services on Windows
# Or run in Terminal:
mongod
```

✅ Server running? OK!

---

## ✅ Step 3: Load Dummy Data

Run in Terminal:

```bash
npm run seed
```

This will:
- ✅ Add 15 Smart Home Products
- ✅ Add 5 Blog Articles
- ✅ Include all dummy affiliate links

**You'll see output like:**
```
📡 Connected to MongoDB
🧹 Cleared existing data
✅ Added 15 dummy products
✅ Added 5 dummy blogs
✨ Database seeding completed successfully!
```

---

## 🧪 Check Your Testing

### 1. View Products on Home Page
```
http://localhost:3000
```
✅ You'll see 15 smart home products!

### 2. Check Admin Panel
```
http://localhost:3000/admin
```
- Dashboard → See 15 total products
- Products → List all products
- Analytics → Click & conversion tracking

### 3. Add Products Manually (For Testing)
```
http://localhost:3000/admin/add-product
```
You can add more products here!

---

## 📊 Dummy Data Details

### 15 Products Included:

**Smart Locks (2)**
- Smart Door Lock Pro ($129.99)
- Full fingerprint & WiFi connectivity

**Smart Cameras (2)**
- 4K Ultra HD Smart Camera ($79.99)
- Smart Video Doorbell ($89.99)

**Smart Lighting (3)**
- Smart LED Bulb Starter Kit ($39.99)
- Smart Motion Sensor Light ($34.99)
- Smart Lighting Strip - RGB ($49.99)

**Smart Climate (1)**
- Smart Thermostat ($199.99)

**Smart Home - Other (7)**
- Smart Plug ($24.99)
- Smart Garage Door ($99.99)
- Smart Sensor ($19.99)
- Smart Speaker ($149.99)
- Smart Water Leak Detector ($29.99)
- Smart Air Purifier ($169.99)
- Smart Pet Feeder ($59.99)
- Smart Blinds ($119.99)

---

## 💡 Pro Tips

### 1️⃣ Reset Dummy Data:
```bash
npm run seed
```
(This automatically deletes old data and adds new data)

### 2️⃣ Add Your Own Products Manually:
1. Go to http://localhost:3000/admin/add-product
2. Fill out the form
3. Click Submit
4. See it on home page!

### 3️⃣ View MongoDB Database:
```bash
# In Terminal:
mongosh

# Commands:
use smart-home-affiliate
db.products.find()
db.blogs.find()
```

---

## 🔗 Affiliate Links Testing

All dummy links follow this format:
```
https://amazon.com/s?k=smart+door+lock&tag=smarthomedeal-20
```

---

## ✅ All Set!

You're ready to test. Run `npm run seed` and start exploring! 🚀
