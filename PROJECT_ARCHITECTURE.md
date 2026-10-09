# System & Software Architecture: Arabian Chick, N

> **Project Identity:** Arabian Chick, N — Fast Food & Pizza Restaurant Web Platform  
> **Location:** Gulbahar No. 2, Peshawar, Khyber Pakhtunkhwa, Pakistan  
> **Live Production Storefront:** [arabian-chicken.lovable.app](https://arabian-chicken.lovable.app)  
> **Document Version:** 1.0.0  
> **Status:** Production-Ready & Deployed  

---

## Table of Contents
1. [Executive Summary & System Goals](#1-executive-summary--system-goals)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Technology Stack & Dependency Matrix](#3-technology-stack--dependency-matrix)
4. [Frontend Architecture & Component Tree](#4-frontend-architecture--component-tree)
   - [SSR Entry Points & Hydration Pipeline](#ssr-entry-points--hydration-pipeline)
   - [Routing Topology](#routing-topology)
   - [Design System & Theme Tokens](#design-system--theme-tokens)
   - [Component Decomposition](#component-decomposition)
5. [Backend Architecture & API Specification](#5-backend-architecture--api-specification)
   - [Express v5 Server Pipeline](#express-v5-server-pipeline)
   - [Security & Authentication Layer](#security--authentication-layer)
   - [Database Schema (Mongoose / MongoDB)](#database-schema-mongoose--mongodb)
   - [Cloudinary Media Pipeline](#cloudinary-media-pipeline)
   - [Complete REST API Reference](#complete-rest-api-reference)
6. [End-to-End Workflows & Data Pipelines](#6-end-to-end-workflows--data-pipelines)
   - [Workflow 1: Resilient Menu Ingestion & Client Hydration](#workflow-1-resilient-menu-ingestion--client-hydration)
   - [Workflow 2: Item Customization & Cart WhatsApp Checkout](#workflow-2-item-customization--cart-whatsapp-checkout)
   - [Workflow 3: Admin Auth, Cloudinary Ingestion & Database CRUD](#workflow-3-admin-auth-cloudinary-ingestion--database-crud)
   - [Workflow 4: Seeding & Catalog Synchronization](#workflow-4-seeding--catalog-synchronization)
7. [Repository File Map & Directory Structure](#7-repository-file-map--directory-structure)
8. [Configuration & Environment Matrix](#8-configuration--environment-matrix)
9. [Deployment & Infrastructure Topology](#9-deployment--infrastructure-topology)
10. [Maintenance, Runbooks & Developer Guide](#10-maintenance-runbooks--developer-guide)

---

## 1. Executive Summary & System Goals

**Arabian Chick, N** is a full-stack, enterprise-grade restaurant web presence and order management solution engineered specifically for high-speed online food ordering, brand discovery, and menu administration.

### Core Objectives:
1. **Frictionless Consumer Ordering:** Direct serverless checkout via WhatsApp deep-links with pre-computed item variants, dynamic pizza toppings, localized pricing (PKR), and integrated payment instructions (Easypaisa, JazzCash, Cash on Delivery).
2. **Dynamic Menu Management:** Full administrative CMS enabling restaurant operators to upload food photos to Cloudinary, modify prices, add food items or deals, reorder offerings, and toggle real-time item availability (Sold Out vs. In Stock).
3. **Resilience & High Availability:** Hybrid data layer supporting offline fallback to local static data (`menu.ts`) if the remote MongoDB/Express API experiences cold boots or downtime.
4. **Dark-First Brand Aesthetics:** Styled with a custom OKLCH design system utilizing Arabian Chick's signature charcoal, crimson red (`#dc2626` / `oklch(0.55 0.24 28)`), and golden saffron (`oklch(0.79 0.17 75)`).

---

## 2. High-Level System Architecture

The solution adopts a decoupled client-server architecture:
- **Client/SSR Edge:** TanStack Start & TanStack Router running React 19 on Vite, producing Server-Side Rendered HTML and client-side hydrated single-page navigation.
- **API Engine:** Node.js Express 5 microservice managing CRUD operations, token validation, rate-limiting, and media uploads.
- **Persistence & Media Layer:** MongoDB Atlas for document storage and Cloudinary for media transformation and global asset delivery.
- **External Interfaces:** WhatsApp Messaging API (`wa.me`) for instant order dispatch and Google Maps Iframe for branch geolocation.

```mermaid
flowchart TB
    subgraph Clients["Clients & Visitors"]
        Mobile["Mobile Browser (PWA/Responsive)"]
        Desktop["Desktop Browser"]
        AdminUser["Restaurant Administrator"]
    end

    subgraph Edge["Frontend Tier (TanStack Start / Vite)"]
        Nitro["TanStack Start Nitro / SSR Gateway"]
        Router["TanStack Router (File-Based)"]
        ReactApp["React 19 Application (Tailwind CSS v4)"]
        CartEngine["Cart & Toppings State Machine (React Context)"]
        DataCache["TanStack Query & Local Fallback Cache"]
    end

    subgraph API["Backend Tier (Express v5 on Node.js)"]
        Middleware["Security Suite (Helmet, CORS, RateLimit)"]
        AuthModule["Admin Auth (Timing-Safe SHA256 & JWT)"]
        ItemsController["Items & Deals Controller"]
        UploadHandler["Multer Memory Stream & Cloudinary SDK"]
    end

    subgraph External["External Services & Cloud Storage"]
        Mongo["MongoDB Atlas (Item & Deal Collections)"]
        CloudinaryCDN["Cloudinary Media Cloud ('arabian-chick')"]
        WhatsAppAPI["WhatsApp Business Gateway (+92 334 8457676)"]
        PaymentProviders["Payment Channels (JazzCash / Easypaisa)"]
    end

    Mobile --> Nitro
    Desktop --> Nitro
    Nitro --> Router --> ReactApp
    ReactApp --> CartEngine
    ReactApp --> DataCache

    DataCache -- "1. GET /api/items & /api/deals" --> Middleware
    AdminUser -- "2. Admin Actions (JWT Auth)" --> Middleware
    Middleware --> AuthModule
    Middleware --> ItemsController
    Middleware --> UploadHandler

    ItemsController <--> Mongo
    UploadHandler --> CloudinaryCDN
    CartEngine -- "3. Generate Order Payload" --> WhatsAppAPI
    WhatsAppAPI --> PaymentProviders
```

---

## 3. Technology Stack & Dependency Matrix

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime & Bundler** | Vite | `8.1.5` | Next-generation ESM development & build server |
| **Frontend Framework** | React | `19.2.0` | Declarative UI rendering & state management |
| **Routing & SSR** | `@tanstack/react-start` & `@tanstack/react-router` | `1.168.32` / `1.170.18` | Type-safe file-based routing and SSR execution |
| **Data Fetching** | `@tanstack/react-query` | `5.101.1` | Client-side query caching and synchronization |
| **Styling Engine** | Tailwind CSS v4 & `@tailwindcss/vite` | `4.2.1` | OKLCH modern CSS tokens and atomic utilities |
| **UI Components** | Radix UI Primitives | Latest | Accessible unstyled headless components (Dialog, Sheet, Accordion, etc.) |
| **Icons & Typography** | Lucide React / Poppins & Inter | `0.575.0` | Vector icons and Google web typography |
| **Backend Runtime** | Node.js (ES Modules) | `v20+` | Server execution environment |
| **Server Framework** | Express | `5.2.1` | High-throughput HTTP API engine |
| **Database ODM** | Mongoose | `9.10.3` | Schema definition and MongoDB communication |
| **Security Suite** | Helmet / express-rate-limit | `8.3.0` / `8.7.0` | HTTP headers hardening and brute-force protection |
| **Authentication** | jsonwebtoken & crypto | `9.0.3` | JWT issuance, verification, and timing-safe equal comparison |
| **Media Pipeline** | Cloudinary v2 & Multer | `2.11.0` / `2.4.0` | In-memory multipart handling and cloud asset CDN storage |

---

## 4. Frontend Architecture & Component Tree

### SSR Entry Points & Hydration Pipeline

1. **[src/start.ts](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/start.ts)**: Configures the TanStack Start instance. Registers custom server middleware including `errorMiddleware` (which renders unified error HTML on catastrophic SSR failures) and `csrfMiddleware` (protecting server functions from cross-site request forgery).
2. **[src/server.ts](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/server.ts)**: Intercepts Nitro/H3 SSR requests, captures server exceptions via [src/lib/error-capture.ts](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/lib/error-capture.ts), normalizes swallowed H3 errors, and serves static fallback HTML if the server bundle encounters uncaught throws.
3. **[src/router.tsx](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/router.tsx)**: Factory function `getRouter()` generating a query-client-aware TanStack Router bound to [src/routeTree.gen.ts](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/routeTree.gen.ts).

### Routing Topology

```
src/routes/
├── __root.tsx     # Global HTML shell, SEO Meta tags, Google Fonts, QueryClientProvider, 404/500 handlers
├── index.tsx      # Public Storefront (Main Landing Page, Cart Provider, Section Assembler)
└── admin.tsx      # Protected Administrative Portal (Login, Catalog Management, Cloudinary uploader)
```

- **Root Route (`__root.tsx`):**
  - Defines the global `<head>` (Viewport, Charset, OG metadata, Favicon).
  - Preconnects and fetches Google Fonts: *Poppins* (600, 700, 800, 900) and *Inter* (400, 500, 600, 700).
  - Embeds `<Outlet />` inside `<QueryClientProvider>`.
  - Implements custom fallback error boundaries (`ErrorComponent` and `NotFoundComponent`).
- **Home Route (`index.tsx`):**
  - Wraps the entire tree in `<CartProvider>`.
  - Assembles all structural page sections into a single, cohesive vertical layout.
- **Admin Route (`admin.tsx`):**
  - Standalone SPA view at `/admin`.
  - Checks client-side token in `localStorage("admin_token")`.
  - Houses the complete login form, tabs for Menu Items and Deals, creation/edition modals, live image uploads, and quick availability toggling.

### Design System & Theme Tokens

Located in [src/styles.css](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/styles.css) and driven by Tailwind CSS v4 `@theme inline`:
- **Palette (OKLCH Standard):**
  - `--brand-red`: `oklch(0.55 0.24 28)` — Signature brand crimson.
  - `--brand-red-deep`: `oklch(0.44 0.21 28)` — Hover and gradient termination.
  - `--brand-gold`: `oklch(0.79 0.17 75)` — Warm amber accent.
  - `--charcoal-deep`: `oklch(0.16 0 0)` — Elevated dark background.
  - `--charcoal`: `oklch(0.21 0 0)` — Base page background.
  - `--charcoal-card`: `oklch(0.26 0 0)` — Elevated surface containers.
- **Fonts:**
  - `font-display`: `"Poppins", "Inter", sans-serif`
  - `font-sans`: `"Inter", sans-serif`

### Component Decomposition

```
src/components/
├── Navbar.tsx         # Sticky glassmorphism header, active scrollspy, cart badge, mobile drawer
├── Hero.tsx           # Full-width showcase banner, promotional hooks, primary CTAs
├── BestOffer.tsx      # Highlighted featured promotions & discounts
├── MenuSection.tsx    # Categorized catalog with interactive pizza toppings & multi-tier pricing
├── Deals.tsx          # Student, double, and family deals with quick-add actions
├── DeliveryBanner.tsx # Delivery hotline badges, zone info (Gulbahar, Peshawar)
├── About.tsx          # Culinary philosophy, hygiene standards, dining ambience
├── Gallery.tsx        # High-resolution visual masonry grid of dishes
├── Contact.tsx        # Physical address, branch phones, Google Maps embed, operating hours
├── Footer.tsx         # Legal info, social links, opening hours, developer attributions
├── CartWidget.tsx     # Slide-over order drawer with item controls and WhatsApp checkout trigger
├── cart.tsx           # Global cart context, item increment/decrement, WhatsApp URL encoder
├── SearchBox.tsx      # Instant search dialog filtering items/deals by name or tag
├── SmartImage.tsx     # Cloudinary-aware progressive image component with fallbacks
├── PaymentInfo.tsx    # Easypaisa/JazzCash account details (Tariq & Shahid Mehmood)
├── Logo.tsx           # Scalable Arabian Chick vector badge
└── ui/                # 46 modular Radix UI + CVA primitives (buttons, dialogs, sheets, etc.)
```

---

## 5. Backend Architecture & API Specification

### Express v5 Server Pipeline

Implemented in [server/index.js](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/server/index.js):
1. **Proxy Trust:** `app.set("trust proxy", 1)` enables accurate client IP identification behind Render / Cloudflare reverse proxies.
2. **Security Headers:** Initialized via `helmet()` to enforce strict CSP, HSTS, frameguard, and referrers.
3. **CORS Control:** Configured with whitelist parsing via `CLIENT_ORIGIN` allowing cross-origin calls exclusively from allowed production and local origins.
4. **Rate Limiting:** Protects `/api/admin/login` against brute force (Max 10 requests per 15-minute sliding window).

### Security & Authentication Layer

- **Timing-Safe Credentials Check:**
  ```javascript
  function safeEqual(a, b) {
    const x = crypto.createHash("sha256").update(String(a)).digest();
    const y = crypto.createHash("sha256").update(String(b)).digest();
    return crypto.timingSafeEqual(x, y);
  }
  ```
  Prevents side-channel timing attacks by hashing incoming usernames/passwords to fixed-length SHA-256 digests prior to timing-safe comparison against `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- **JWT Protection:** Valid admin requests require an `Authorization: Bearer <TOKEN>` header signed by `JWT_SECRET` with a 7-day expiration.

### Database Schema (Mongoose / MongoDB)

Defined in [server/models.js](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/server/models.js):

#### 1. Item Model (`Item`)
Represents an individual food item (Burgers, Pizzas, Meals, Wings, etc.).
```typescript
interface IItem {
  slug: string;             // Unique slug identifier, e.g., 'fajita-sicilian-1712345678'
  name: string;             // Item display name
  category: string;         // 'pizza' | 'meals' | 'burgers' | 'fried-chicken' | etc.
  group?: string;           // Optional sub-group ('hot' | 'crust' | 'extras')
  description?: string;     // Ingredients or preparation notes
  tag?: string;             // Promotional tag ('Hot', 'Bestseller', 'New')
  imageUrl?: string;        // Cloudinary CDN URL or local static asset path
  prices: Array<{           // Multi-variant pricing model
    label: string;          // e.g., 'Regular', 'Large', 'S 7in', 'Single'
    value: number;          // Price in PKR (e.g., 450, 1250)
  }>;
  available: boolean;       // Real-time stock toggle (default: true)
  order: number;            // Display sequencing weight (default: 0)
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Deal Model (`Deal`)
Represents bundled offers, combo deals, or family feasts.
```typescript
interface IDeal {
  slug: string;             // Unique slug identifier, e.g., 'student-deal-1-1712345678'
  badge: string;            // Badge label, e.g., 'Student Deal 1', 'Family Deal 3'
  title: string;            // Headline, e.g., '1 Zinger Burger + Fries + 345ml Drink'
  contents: string;         // Detailed list of included items
  price: number;            // Fixed combo price in PKR
  group: string;            // 'deal' (pizza deals) | 'double' (double deals) | 'family' (family deals)
  imageUrl?: string;        // Cloudinary CDN asset URL
  available: boolean;       // Availability switch (default: true)
  order: number;            // Display sorting order
  createdAt: Date;
  updatedAt: Date;
}
```

### Cloudinary Media Pipeline

- **Multer Memory Buffer:** Restricts files to 5MB and validates MIME types (`jpeg`, `png`, `webp`, `avif`, `gif`).
- **Streaming Ingestion:** `cloudinary.uploader.upload_stream` pipes raw in-memory buffers into the remote folder `arabian-chick` without storing intermediate files on disk. Returns persistent SSL CDN links.

### Complete REST API Reference

| Endpoint | Method | Auth | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | Public | Ping endpoint for UptimeRobot / Render keep-alive | `200` |
| `/api/items` | `GET` | Public | Retrieves all active menu items sorted by `order` | `200` |
| `/api/deals` | `GET` | Public | Retrieves all active combo deals sorted by `order` | `200` |
| `/api/admin/login` | `POST` | Public (Rate-Limited) | Authenticates admin using username/password; returns JWT | `200`, `401`, `429` |
| `/api/items` | `POST` | Admin (`Bearer`) | Creates a new menu item | `200`, `400`, `401` |
| `/api/items/:id` | `PUT` | Admin (`Bearer`) | Updates an existing item or toggles `available` | `200`, `400`, `401`, `404` |
| `/api/items/:id` | `DELETE`| Admin (`Bearer`) | Removes a menu item | `200`, `401`, `404` |
| `/api/deals` | `POST` | Admin (`Bearer`) | Creates a new combo deal | `200`, `400`, `401` |
| `/api/deals/:id` | `PUT` | Admin (`Bearer`) | Updates deal parameters or toggles availability | `200`, `400`, `401`, `404` |
| `/api/deals/:id` | `DELETE`| Admin (`Bearer`) | Deletes a deal | `200`, `401`, `404` |
| `/api/upload` | `POST` | Admin (`Bearer`) | Multipart single image upload (`image`) to Cloudinary | `200`, `400`, `401`, `500` |

---

## 6. End-to-End Workflows & Data Pipelines

### Workflow 1: Resilient Menu Ingestion & Client Hydration

This workflow guarantees the storefront never renders blank or crashes if the API server is spinning up or offline.

```mermaid
sequenceDiagram
    autonumber
    participant Client as User Browser
    participant Hook as useMenuData()
    participant API as Express API (/api/*)
    participant Local as Static Fallback (src/data/menu.ts)

    Client->>Hook: Component mounts (MenuSection / Deals)
    Hook->>API: Promise.all([GET /api/items, GET /api/deals])
    alt API Responds Successfully (HTTP 200)
        API-->>Hook: Return MongoDB items & deals
        Hook->>Hook: Filter { available: true }
        Hook-->>Client: Update state with live server catalog
    else API Times Out or Returns Error (Cold Boot / Network Down)
        API--xHook: Network Exception
        Hook->>Local: Import MENU_ITEMS & DEALS static dataset
        Hook-->>Client: Fallback to bundled menu data immediately
    end
```

### Workflow 2: Item Customization & Cart WhatsApp Checkout

The client utilizes a serverless ordering pipeline that encodes item options, pizza sizes, extra toppings, and customer payment details into a formatted WhatsApp link.

```mermaid
sequenceDiagram
    autonumber
    participant Customer as Customer
    participant Card as MenuItemCard
    participant Cart as CartContext
    participant Widget as CartWidget
    participant WhatsApp as WhatsApp Engine (+92 334 8457676)

    Customer->>Card: Select Pizza Size ("M 10in") & Toppings ("Extra Cheese", "Mushrooms")
    Card->>Card: Calculate Price: Base (Rs.1050) + 2x Toppings (Rs.150 ea) = Rs.1350
    Customer->>Card: Click "Add to Order"
    Card->>Cart: addItem({ key, name, option, price: 1350, qty: 1 })
    Cart->>Cart: Deduplicate or increment count
    Customer->>Widget: Open "My Order" Drawer
    Widget->>Cart: Read total, items, and format WhatsApp text
    Customer->>Widget: Click "Send Order via WhatsApp"
    Widget->>WhatsApp: Open wa.me link with encoded order lines & account details
    WhatsApp-->>Customer: WhatsApp opens with pre-filled order draft
```

#### Order Payload Format Sent to WhatsApp:
```text
Assalam-o-Alaikum! I would like to order:

• 1× Chicken Fajita Pizza (M 10in + Extra Cheese + Mushrooms) — Rs.1,350
• 2× Zinger Burger (Single) — Rs.760
• 1× Student Deal 1 (Regular) — Rs.490

Total: Rs.2,600

Payment: Easypaisa / JazzCash - Tariq Mehmood (03151997888) / Shahid Mehmood (03459495524) or Cash on Delivery.
If I have paid online, I am sending the screenshot in this chat.
```

### Workflow 3: Admin Auth, Cloudinary Ingestion & Database CRUD

```mermaid
sequenceDiagram
    autonumber
    participant Admin as Restaurant Owner
    participant Portal as /admin Route
    participant Express as Express Server
    participant Cloudinary as Cloudinary API
    participant Mongo as MongoDB Atlas

    Admin->>Portal: Enter Username & Password
    Portal->>Express: POST /api/admin/login
    Express->>Express: Hash credentials & timingSafeEqual() check
    Express-->>Portal: Issue 7-Day JWT Token
    Portal->>Portal: Store token in localStorage("admin_token")
    Admin->>Portal: Select image & fill item details
    Portal->>Express: POST /api/upload (Multipart image)
    Express->>Cloudinary: Upload stream to folder 'arabian-chick'
    Cloudinary-->>Express: Return secure HTTPS image URL
    Express-->>Portal: Return { url: "https://res.cloudinary.com/..." }
    Portal->>Express: POST /api/items (with JWT & Cloudinary URL)
    Express->>Mongo: Item.create({ ...itemData, slug })
    Mongo-->>Express: Item record created
    Express-->>Portal: Return created item
    Portal-->>Admin: Show success toast & live update table
```

### Workflow 4: Seeding & Catalog Synchronization

The project provides automated migration utilities in `server/seed.js` and `server/seed-extra.js`:
1. Reads all legacy images in `src/assets` and `src/assets/menu`.
2. Verifies whether each asset exists in Cloudinary; uploads new files under folder `arabian-chick`.
3. Verifies `process.env.ALLOW_SEED === "true"` to prevent accidental production database resets.
4. Clears existing `items` and `deals` collections.
5. Ingests all records defined in [src/data/menu.ts](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/data/menu.ts) with mapped Cloudinary URLs and incremental ordering indexes.

---

## 7. Repository File Map & Directory Structure

```
arabian-chicken/
├── .lovable/                      # Lovable IDE deployment and agent configuration
├── public/                        # Static assets (Favicons, robots.txt, manifests)
│   ├── favicon.ico
│   └── placeholder.svg
├── server/                        # Standalone Express backend API
│   ├── .env                       # Backend secrets (MongoDB, Cloudinary, JWT)
│   ├── .gitignore
│   ├── index.js                   # Primary Express server application & routes
│   ├── models.js                  # Mongoose schemas for Item and Deal
│   ├── package.json               # Backend dependencies & npm scripts
│   ├── seed.js                    # Automated seeding & Cloudinary upload script
│   └── seed-extra.js              # Additional categorized seed batcher
├── src/                           # Frontend application source
│   ├── assets/                    # Bundled graphic assets (Logos, hero photography)
│   │   ├── Arabian.jpeg
│   │   └── menu/                  # Local food photography cache
│   ├── components/                # React presentation and logic components
│   │   ├── ui/                    # 46 accessible Radix UI wrappers (dialog, card, etc.)
│   │   ├── About.tsx              # Brand story and hygiene commitment
│   │   ├── BestOffer.tsx          # Featured promotional badges
│   │   ├── CartWidget.tsx         # Slide-over order panel with price calculation
│   │   ├── cart.tsx               # Cart context provider and state reducer
│   │   ├── Contact.tsx            # Contact information, phone cards, Google Maps
│   │   ├── Deals.tsx              # Student, double, and family deals section
│   │   ├── DeliveryBanner.tsx     # Delivery hotline notice and coverage
│   │   ├── Footer.tsx             # Page footer with navigation and social handles
│   │   ├── Gallery.tsx            # Responsive photography grid
│   │   ├── Hero.tsx               # Page header showcase with CTA buttons
│   │   ├── Logo.tsx               # Brand vector logo component
│   │   ├── MenuSection.tsx        # Multi-tab catalog with live pizza topping selector
│   │   ├── Navbar.tsx             # Header navigation bar with scrollspy and cart trigger
│   │   ├── PaymentInfo.tsx        # Mobile banking payment details display
│   │   ├── SearchBox.tsx          # Real-time search modal for dishes and deals
│   │   └── SmartImage.tsx         # Image component with error handling and fallback
│   ├── data/                      # Data schemas, static fallbacks, and fetchers
│   │   ├── images.ts              # Local image mappings for menu items
│   │   ├── menu.ts                # Master static food catalog, deals, and payment constants
│   │   └── useMenuData.ts         # Hook fetching live API data with offline fallback
│   ├── hooks/                     # Custom React hooks
│   │   └── use-mobile.tsx         # Responsive viewport detection hook
│   ├── lib/                       # Utility functions & logging
│   │   ├── error-capture.ts       # SSR error capture handler
│   │   ├── error-page.ts          # Server-rendered error HTML template
│   │   ├── lovable-error-reporting.ts # Error telemetry reporter
│   │   └── utils.ts               # Class name merging utility (clsx + twMerge)
│   ├── routes/                    # File-based routing declarations
│   │   ├── __root.tsx             # Root document shell, HeadContent, QueryProvider
│   │   ├── index.tsx              # Public home page
│   │   └── admin.tsx              # Admin dashboard and content management
│   ├── routeTree.gen.ts           # Automatically generated TanStack route tree
│   ├── router.tsx                 # Router factory function
│   ├── server.ts                  # TanStack Start SSR entry and exception normalizer
│   ├── start.ts                   # TanStack Start configuration and middleware
│   └── styles.css                 # Master Tailwind CSS v4 design tokens and styles
├── AGENTS.md                      # Lovable repository guidelines
├── bunfig.toml                    # Bun package manager configuration
├── components.json                # shadcn / Radix CLI configuration
├── eslint.config.js               # ESLint linting configuration
├── package.json                   # Frontend dependencies, scripts, and overrides
├── tsconfig.json                  # TypeScript compiler settings and path aliases (`@/*`)
└── vite.config.ts                 # Vite bundler configuration with TanStack Start plugin
```

---

## 8. Configuration & Environment Matrix

### Client Environment Variables (`.env` / Hosting Dashboard)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the deployed Express backend | `http://localhost:4000` or `https://arabian-api.onrender.com` |

### Server Environment Variables (`server/.env`)
| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `PORT` | Listening port for Express | No | `4000` |
| `MONGODB_URI` | MongoDB Atlas connection string | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/arabian` |
| `JWT_SECRET` | Secret key for signing admin tokens | **Yes** | `super-strong-jwt-secret-key-32-chars` |
| `ADMIN_USERNAME` | Administrator login username | No | `admin` |
| `ADMIN_PASSWORD` | Administrator login password | **Yes** | `secure-pass-hash-value` |
| `CLIENT_ORIGIN` | Whitelist of allowed frontend origins (comma-separated) | **Yes** | `http://localhost:5173,https://arabian-chicken.lovable.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud identifier | **Yes** | `dnxyz123` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | **Yes** | `123456789012345` |
| `CLOUDINARY_API_SECRET`| Cloudinary API Secret | **Yes** | `abcdefghijklmnopqrstuv` |
| `ALLOW_SEED` | Guard flag for running database reset scripts | No | `true` |

---

## 9. Deployment & Infrastructure Topology

```mermaid
graph LR
    subgraph CDN["Edge & CDN Tier"]
        Cloudflare["Cloudflare / Lovable Edge"]
        Cloudinary["Cloudinary Media CDN"]
    end

    subgraph Compute["Application Compute"]
        SSR["TanStack Start SSR Engine (Nitro)"]
        API["Node.js Express Server (Render / Linux VPS)"]
    end

    subgraph Data["Persistent Storage"]
        Atlas["MongoDB Atlas Cluster (Primary / Replicas)"]
    end

    Cloudflare -- "Static Assets & HTML" --> SSR
    SSR -- "API Requests" --> API
    API -- "Media Uploads" --> Cloudinary
    API -- "Queries / Mutations" --> Atlas
    Cloudinary -- "Image Delivery" --> Cloudflare
```

1. **Frontend Hosting:** Deployed on **Lovable / Cloudflare Pages / Nitro**, with automatic builds triggered on Git commits to `main`.
2. **Backend API Hosting:** Deployed on **Render** (or equivalent container runtime). The `/health` endpoint is pinged by Uptime monitoring services (e.g., UptimeRobot) every 5 minutes to prevent cold boot delays on free tiers.
3. **Database Hosting:** **MongoDB Atlas (M0/M2 Tier)** with IP Access List whitelisting and auto-reconnecting Mongoose driver.
4. **Media CDN:** **Cloudinary** automatically serves responsive, optimized images (`f_auto,q_auto`) globally.

---

## 10. Maintenance, Runbooks & Developer Guide

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd arabian-chicken
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   npm run dev
   ```
   *Frontend starts on `http://localhost:5173` (or port selected by Vite).*

3. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Configure server/.env with your MongoDB and Cloudinary credentials
   npm run dev
   ```
   *Backend starts on `http://localhost:4000`.*

### Database Seeding & Migration Runbook

To reset or seed the database from local menu items and upload all images to Cloudinary:
```bash
cd server
ALLOW_SEED=true npm run seed
```
*(Use `npm run seed:extra` if executing supplementary category batches).*

### Adding a New Food Category or Deal
1. **Frontend Category Tab:** Add the new category slug and title to `CATEGORIES` in [src/data/menu.ts](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/data/menu.ts) and [src/routes/admin.tsx](file:///c:/Users/Hp/OneDrive/Desktop/All%20files/arabian-chicken/src/routes/admin.tsx).
2. **Database:** Add items via the `/admin` portal GUI or push seed data directly via `server/seed.js`.

---
*Documented with dedication for **Arabian Chick, N** — Peshawar, Pakistan.*
