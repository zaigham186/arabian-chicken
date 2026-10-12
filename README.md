# Arabian Chick, N — Full-Stack Web Application

A modern, high-performance web presence and ordering system for **Arabian Chick, N** (Peshawar), built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB Atlas, and Cloudinary.

---

## 🚀 Production Deployment Guide

This project is completely production-ready. You can deploy it using any of the three standard methods below.

### Pre-Deployment Checklist: Environment Variables

Before deploying, make sure you configure these environment variables in your hosting provider's dashboard (see `.env.example`):

| Variable                | Description                                  | Example / Required                                   |
| :---------------------- | :------------------------------------------- | :--------------------------------------------------- |
| `MONGODB_URI`           | MongoDB Atlas connection string              | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `ADMIN_PASSWORD`        | Strong password to access `/admin`           | `YourSecretAdminPassword123!`                        |
| `JWT_SECRET`            | 32+ character random secret for JWT signing  | `openssl rand -base64 32`                            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier                  | `your_cloud_name`                                    |
| `CLOUDINARY_API_KEY`    | Cloudinary API Key                           | `123456789012345`                                    |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret                        | `your_api_secret`                                    |
| `NEXT_PUBLIC_APP_URL`   | Production website URL (for SEO / OpenGraph) | `https://arabianchicken.com`                         |

> **MongoDB Atlas Note**: In your MongoDB Atlas dashboard under **Network Access**, ensure your hosting platform's IP address (or `0.0.0.0/0` for serverless hosts like Vercel) is added to the IP Access List.

---

### Option 1: Deploy to Vercel (Recommended & Easiest)

1. Push your branch to GitHub (`git push origin feat/nextjs-migration` or merge to `main`).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset will automatically detect **Next.js**.
5. In the **Environment Variables** section, paste all values from `.env.example`.
6. Click **Deploy**. Vercel will build and launch your live application with global CDN caching.

---

### Option 2: Deploy with Docker (Render, Railway, Fly.io, Cloud Run)

The repository includes a production multi-stage `Dockerfile` and `.dockerignore`.

1. **Render**:
   - Create a **Web Service** connected to your repo.
   - Choose **Docker** as the runtime.
   - Add your environment variables under **Environment**.
   - Click **Create Web Service**.

2. **Railway**:
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Railway automatically detects the `Dockerfile` and builds the container.
   - Add your environment variables in the **Variables** tab.

3. **Local or VPS Docker Run**:
   ```bash
   docker build -t arabian-chicken .
   docker run -p 3000:3000 --env-file .env.local arabian-chicken
   ```

---

### Option 3: Deploy to a Linux VPS (Ubuntu / PM2 / NGINX)

1. **Clone and Install**:

   ```bash
   git clone <repo-url>
   cd arabian-chicken
   npm ci
   ```

2. **Set Environment**:

   ```bash
   cp .env.example .env.local
   nano .env.local   # fill in production secrets
   ```

3. **Build & Run with PM2**:

   ```bash
   npm run build
   pm2 start "npm run start" --name "arabian-chicken"
   pm2 save
   pm2 startup
   ```

4. Configure NGINX reverse proxy pointing `http://127.0.0.1:3000` to port 80/443 with Let's Encrypt SSL.

---

## 🛠 Local Development & Testing

```bash
# Run local development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Run comprehensive test suite (Phases 1 - 5)
npm test

# Run production runtime simulation
npm run test:prod
```

---

## 🛡 Features & Architecture

- **Next.js App Router**: Server-side rendering, streaming metadata, dynamic sitemap (`/sitemap.xml`), robots exclusion (`/robots.txt`), PWA manifest (`/manifest.webmanifest`), and custom 404/Error boundaries (`error.tsx`, `global-error.tsx`).
- **Security**: HttpOnly SameSite session cookies, binary magic-byte validation on file uploads, strict rate-limiting on admin login, HSTS (`Strict-Transport-Security`), DNS prefetch controls, X-Frame-Options, and disabled technology fingerprints (`poweredByHeader: false`).
- **Cloudinary Direct Stream**: Resilient image upload and optimization for menu items and deals.
- **WhatsApp Checkout**: Interactive cart drawer generating formatted WhatsApp orders directly to restaurant staff.
- **Admin Dashboard (`/admin`)**: Complete real-time menu management, category grouping, pricing, stock toggling, and image uploads protected with `noindex, nofollow` crawler isolation.
- **Zero-Warning Code Quality**: Full TypeScript strict compliance (`npm run typecheck`) and ESLint validation (`npm run lint`).
