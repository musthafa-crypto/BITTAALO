# BITTAALO - Full-Stack E-Commerce Platform

**BITTAALO** is a production-ready, full-stack lifestyle accessories store designed for the Indian market (INR ₹ currency). It features a modern, luxury streetwear aesthetic, robust REST API architecture, comprehensive customer features, and an administrative control center.

---

## 🌟 Brand Information & Contact Details
- **Brand Name**: BITTAALO
- **Phone / WhatsApp**: [+91 9037489104](https://wa.me/919037489104)
- **Email**: [bittaalo@gmail.com](mailto:bittaalo@gmail.com)
- **Market / Currency**: India (INR ₹)
- **Free Shipping Threshold**: Free on orders over ₹999 across India

---

## 🗂️ 12 Lifestyle Categories & Catalog
The platform seeds **48+ curated accessories** across all 12 categories:
1. **Sunglasses** (UV400 Polarized optics, Italian hand-finished acetate, titanium aviators)
2. **Caps** (380GSM heavy washed dad hats, tactical trucker caps, distressed snapbacks)
3. **Jewellery** (316L hypoallergenic surgical stainless steel, Cuban link chains, obsidian signet rings)
4. **Watches** (Architectural chronographs, automatic open-heart skeleton dials, field watches)
5. **Wallets** (3K weave carbon fiber RFID cardholders, vegetable-tanned leather bifolds, pop-up metal wallets)
6. **Shorts** (450GSM loopback French terry shorts, DWR cargo utility shorts, court mesh)
7. **Belts** (Heavy-duty quick-release cobra buckles, 4mm full-grain Italian leather, reversible dress belts)
8. **Footwear** (4cm molded EVA cloud recovery slides, brutalist clogs, cork footbed suede mules)
9. **Shoes** (Platform chunky sole trainers, vintage hairy suede court sneakers, high-top street sneakers)
10. **Sunglasses Pouch** (Crushproof EVA hard cases, origami magnetic folding holsters, microfiber squeeze pouches)
11. **Lighter** (Dual torch blue jet windproof lighters, Type-C plasma arc electric lighters, trench flint lighters)
12. **Water Bottle** (Double-wall vacuum thermal stainless bottles, flat flask book bottles, LED temperature mugs)

---

## 🚀 Tech Stack

### Frontend (`client/`)
- **Core**: React 18 + Vite (ES Modules)
- **Routing**: React Router v6 (Lazy loaded pages with Suspense)
- **Styling**: Tailwind CSS (Custom luxury streetwear tokens, Onyx Black `#0A0A0B`, Warm Gold `#D4AF37`)
- **Server State & Data Fetching**: TanStack React Query v5
- **Client State**: Zustand (Persistent guest localStorage cart & wishlist, syncs to DB on login)
- **Forms & Validation**: React Hook Form + Zod
- **SEO**: `react-helmet-async` (Per-page metadata, OpenGraph tags)
- **Notifications & FX**: `react-hot-toast`, `canvas-confetti`
- **Charts & Icons**: Recharts, Lucide React

### Backend (`server/`)
- **Runtime**: Node.js 25+ / Express 4 (Modular REST API structure)
- **Database**: MongoDB with Mongoose (with automated embedded MongoDB memory server fallback)
- **Auth**: JWT (Access + Refresh tokens stored in secure httpOnly cookies, bcrypt hashing, role middleware)
- **Payment Gateway**: Razorpay SDK (UPI, Cards, Netbanking) with test mode fallback & Cash on Delivery (COD)
- **Email Service**: Nodemailer (Order confirmations & contact form routing to `bittaalo@gmail.com`)
- **API Documentation**: Swagger / OpenAPI 3.0 UI mounted at `/api-docs`
- **Security & Reliability**: Helmet, CORS with credentials, express-rate-limit, centralized error handling

---

## 🔑 Default Accounts (Seeded)

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@bittaalo.com` | `Admin@12345` | Full Admin Dashboard (`/admin`), Orders, Inventory, Metrics |
| **Customer** | `customer@bittaalo.com` | `Customer@12345` | Customer Storefront, Order History, Wishlist |

> **Pro Tip**: The `/login` page includes **One-Click Testing Buttons** (`Fill Admin` and `Fill Customer`) to instantly populate credentials.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+ and npm installed

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repo-url>
cd BITTAALO

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables Setup

Create `.env` in `server/`:
```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (Leave blank or point to local/Atlas MongoDB; falls back to embedded MongoDB automatically)
MONGODB_URI=mongodb://localhost:27017/bittaalo

# JWT Secrets
JWT_ACCESS_SECRET=bittaalo_super_secret_access_token_key_2026_xyz
JWT_REFRESH_SECRET=bittaalo_super_secret_refresh_token_key_2026_abc
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_placeholder_key_id
RAZORPAY_KEY_SECRET=rzp_test_placeholder_key_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=bittaalo@gmail.com
SMTP_PASS=mock_app_password
EMAIL_FROM=BITTAALO <bittaalo@gmail.com>
```

Create `.env` in `client/`:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Seed Database

```bash
cd server
npm run seed
```
*(Note: If the database is empty upon starting the server, it will auto-seed automatically).*

### 4. Run Locally

**Start Server:**
```bash
cd server
npm start
# Server listens on http://localhost:5000
# Swagger API Docs available at http://localhost:5000/api-docs
```

**Start Client:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Testing

```bash
# Run backend API test suite (8 tests covering auth, catalog, orders, coupons, contact)
cd server
npm test

# Run frontend test suite (cart calculations, shipping rules, coupon deductions)
cd client
npm test
```

---

## 📡 REST API Overview (`/api/v1`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Register new customer account | Public |
| `POST` | `/auth/login` | Log in and receive JWT httpOnly cookies | Public |
| `POST` | `/auth/refresh` | Silent access token refresh | Public |
| `POST` | `/auth/logout` | Clear auth cookies | Authenticated |
| `GET` | `/auth/me` | Fetch active user profile | Authenticated |
| `GET` | `/products` | List accessories with filters, search & pagination | Public |
| `GET` | `/products/:slug` | Get product details by slug or ID | Public |
| `GET` | `/categories` | List all 12 categories with product counts | Public |
| `GET` | `/cart` | Fetch user's cart | Authenticated |
| `POST` | `/cart/sync` | Sync & merge guest localStorage cart to DB | Authenticated |
| `POST` | `/orders` | Place new order (COD or Razorpay) | Public / Auth |
| `POST` | `/payments/verify` | Verify Razorpay payment signature | Public / Auth |
| `POST` | `/coupons/validate` | Check coupon eligibility & calculate discount | Public |
| `POST` | `/contact` | Submit inquiry form (saved to DB & emailed) | Public |
| `GET` | `/admin/stats` | KPI revenue, orders, customers & charts | Admin Only |
| `POST` | `/admin/products` | Create catalog product | Admin Only |
| `PUT` | `/admin/orders/:id/status` | Update dispatch milestone & tracking number | Admin Only |

Full interactive API docs with live test requests: **`http://localhost:5000/api-docs`**.

---

## ☁️ Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist `0.0.0.0/0` (allow access from anywhere).
3. Copy your connection string: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/bittaalo?retryWrites=true&w=majority`.
4. Set `MONGODB_URI` in production environment variables.

### 2. Backend (Render / Railway)
1. Push code to GitHub.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service**.
3. Set Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables (`MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, etc.).

### 3. Frontend (Vercel / Netlify)
1. In [Vercel](https://vercel.com) or [Netlify](https://netlify.com), create a new project linked to your GitHub repo.
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api/v1`
7. For single-page app routing on Vercel, include `vercel.json`:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
