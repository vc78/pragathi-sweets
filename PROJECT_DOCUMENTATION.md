# Pragathi Sweets — Enterprise E-Commerce Platform
## Comprehensive Technical & Architecture Documentation

---

## 1. Executive Summary

**Pragathi Sweets** is a full-stack, enterprise-grade e-commerce application designed specifically for artisanal Indian sweets, savouries, dry fruits, and festive gift boxes. The system is engineered to handle high-throughput seasonal traffic (e.g., Diwali, Raksha Bandhan, wedding seasons), offering seamless customer ordering, automated coupon/promotions enforcement, reliable payment gateways (Razorpay and Cash on Delivery), real-time order tracking, and an administrative ERP suite.

### Key Objectives Achieved
- **Clean Customer Journey**: Fast catalog discovery, rich visual presentation, transparent pricing, dynamic offers, real-time cart synchronization, and single-page checkout.
- **Cart Isolation & Security**: Per-user cart isolation preventing data leakage between shared devices, with automatic guest-to-user cart migration upon authentication.
- **Resilient Financial Transactions**: Server-side HMAC-SHA256 signature verification for Razorpay, atomic database stock reservation, and clear post-delivery COD reconciliations.
- **Real-Time Administrative Suite**: Live order monitoring, multi-attribute customer tracking, instant coupon activation/deactivation toggles, and inventory threshold alerts.
- **Production Architecture**: Multi-stage Docker packaging, SPA Nginx reverse proxy with gzip and caching, sliding-window login rate limiting, distributed request correlation IDs, and automated GitHub Actions CI.

---

## 2. Architecture & Technology Stack

### High-Level System Architecture

```
                                  [ Web Browser / Mobile Client ]
                                                 │
                                                 ▼
                                     ┌───────────────────────┐
                                     │  Nginx Web Server /   │
                                     │     Reverse Proxy     │
                                     │ (Port 80 / SSL 443)   │
                                     └───────────┬───────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │ Static Assets (SPA)                             │ /api/* Proxy
                        ▼                                                 ▼
             ┌─────────────────────┐                          ┌────────────────────────┐
             │ React 18 + Vite SPA │                          │  Spring Boot 3.5.3 API │
             │  TailwindCSS + Redux│                          │     (Port 8080)        │
             └─────────────────────┘                          └───────────┬────────────┘
                                                                          │
                                               ┌──────────────────────────┼──────────────────────────┐
                                               ▼                          ▼                          ▼
                                     ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
                                     │  MySQL 8.0 RDBMS │       │ Razorpay Gateway │       │ SMTP Mail Server │
                                     │   (Port 3306)    │       │ (Webhooks & API) │       │ (Order Receipts) │
                                     └──────────────────┘       └──────────────────┘       └──────────────────┘
```

### Technology Matrix

| Layer | Technologies & Libraries | Rationale |
|---|---|---|
| **Frontend Framework** | React 18, Vite 5.4 | High-performance build tooling, sub-second HMR, optimized production chunks |
| **State Management** | Redux Toolkit, Custom React Hooks | Predictable authentication state, isolated cart lifecycle, responsive UI |
| **Styling & UI** | TailwindCSS, Lucide React, Framer Motion | Modern artisanal aesthetics, fluid micro-interactions, responsive grid |
| **HTTP Client** | Axios | Request interceptors, JWT attachment, automatic exponential backoff retry for GETs |
| **Backend Framework** | Java 21, Spring Boot 3.5.3 | High-throughput virtual threads capability, modern LTS Java, robust dependency ecosystem |
| **Security & Auth** | Spring Security 6, JJWT (0.12.6), BCrypt | Stateless JWT authorization, role-based controls (`ROLE_USER`, `ROLE_ADMIN`), HSTS |
| **Persistence & ORM** | Spring Data JPA, Hibernate, MySQL 8 | Relational integrity, ACID transactional checkouts, optimized composite indexing |
| **API Documentation**| SpringDoc OpenAPI 3, Swagger UI | Interactive REST contract testing, standardized schema generation |
| **DevOps & Containers**| Docker, Docker Compose, Nginx Alpine | Multi-stage minimal builds, reproducible local & staging environments, unprivileged users |
| **CI / CD** | GitHub Actions | Automated Maven compiling, test validation, and Vite production bundle builds on push |

---

## 3. Project Directory Structure

```
c:\Training\Pragathi sweets/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions Continuous Integration pipeline
├── docker-compose.yml                  # Multi-container orchestration (MySQL, Backend, Frontend)
├── .env.example                        # Template for containerized environment variables
├── pragathi-sweets-backend/            # Spring Boot REST API
│   ├── Dockerfile                      # Multi-stage Maven -> JRE 21 Alpine container
│   ├── pom.xml                         # Maven dependencies & build plugins
│   └── src/main/
│       ├── java/com/ems/pragathisweets/
│       │   ├── PragathiSweetsApplication.java
│       │   ├── config/                 # SecurityConfig, CorsConfig, RequestCorrelationFilter, DataInitializer
│       │   ├── controller/             # AuthController, ProductController, CartController, OrderController, etc.
│       │   │   └── admin/              # AdminUserController, AdminOrderController, AdminCouponController, etc.
│       │   ├── dto/                    # Request/Response Data Transfer Objects
│       │   ├── entity/                 # JPA Entities (User, Product, Order, OrderItem, Coupon, Category)
│       │   ├── exception/              # GlobalExceptionHandler and domain exceptions
│       │   ├── mapper/                 # Entity-DTO mapping components
│       │   ├── repository/             # Spring Data JPA interfaces
│       │   ├── security/               # JwtService, JwtAuthenticationFilter, LoginRateLimiterFilter
│       │   └── service/                # Business logic & transactional operations
│       └── resources/
│           ├── application.properties  # Base configuration with environment overrides
│           └── application-prod.properties # Hardened production profile
└── pragathi-sweets-frontend/           # React + Vite Single Page Application
    ├── Dockerfile                      # Multi-stage Node 20 -> Nginx Alpine container
    ├── nginx.conf                      # Production Nginx configuration (gzip, SPA routes, API proxy)
    ├── package.json                    # Frontend dependencies & build scripts
    ├── index.html                      # Entry HTML with meta & SEO tags
    └── src/
        ├── App.jsx                     # Application router & route guards
        ├── main.jsx                    # React root with ErrorBoundary & Redux Provider
        ├── components/
        │   ├── admin/                  # AdminLayout, DataTable, MetricCards
        │   ├── common/                 # ErrorBoundary, ReliableImage, SkeletonLoaders
        │   └── customer/               # Navbar, Footer, SweetCard, OfferBanner
        ├── hooks/
        │   └── useCart.js              # Per-user isolated cart hook with guest migration
        ├── pages/
        │   ├── admin/                  # Dashboard, OrdersManagement, Customers, Inventory, Coupons
        │   └── customer/               # Home, Products, ProductDetails, Cart, Checkout, Orders, Profile
        ├── services/
        │   ├── api.js                  # Axios instance with timeout, retry, and auth interceptors
        │   ├── authService.js          # Authentication API calls
        │   ├── adminService.js         # Administrative operations
        │   ├── orderService.js         # Order creation & history APIs
        │   └── productService.js       # Catalog querying APIs
        └── store/                      # Redux store and authSlice
```

---

## 4. Key Functional Modules

### 4.1 Customer Experience & Catalog Discovery
- **Hero & Curated Showcase**: Features seasonal hero banners, highlighted bestseller carousels, and quick-filter category chips without disruptive popups.
- **Product Details & Nutritional Badges**: Rich imagery with fallbacks, package size selection (250g, 500g, 1kg, gift pack), shelf-life guidelines, and customer reviews.
- **Per-User Cart Lifecycle**:
  - Unauthenticated visitors store items under `ps_cart_guest`.
  - When an authenticated customer logs in, their cart key switches to `ps_cart_{userId}`.
  - Any items chosen while browsing anonymously are automatically merged into their account cart without losing selections.
  - Logging out immediately purges sensitive session states and clears guest bleed.

### 4.2 Order Checkout & Payment Processing
- **Server-Side Delivery Fee Engine**: Orders below ₹999 incur a standard delivery fee of ₹50; orders of ₹999 or higher qualify for free priority delivery.
- **Dynamic Coupon Validation**:
  - The client submits coupon codes to `POST /api/coupons/apply`.
  - The server verifies minimum spend, expiry date, usage limit, and active status before returning the precise discount amount.
- **Payment Method A — Razorpay (Card / UPI / NetBanking)**:
  1. Frontend calls `/api/payments/create-order`.
  2. Backend generates a Razorpay Order ID using official SDK credentials.
  3. Customer completes authentication inside Razorpay's checkout modal.
  4. Frontend sends signature back to `/api/payments/verify`.
  5. Backend recalculates HMAC-SHA256 using the server's private secret and transitions the order status to `CONFIRMED`.
- **Payment Method B — Cash on Delivery (COD)**:
  - Bypasses payment gateways initially; places order in `PENDING` payment status and `CONFIRMED` fulfillment status.
  - Upon physical delivery, delivery staff collects payment, and administrators update the order to `DELIVERED` with `paymentStatus = PAID`.

### 4.3 Order State Lifecycle Machine
The system strictly tracks order progress through an 8-stage state machine:
```
  [ Customer Places Order ]
             │
             ▼
        [ PENDING ] ────────( Payment Confirmed / COD Selected )
             │
             ▼
       [ CONFIRMED ]
             │
             ▼
       [ PROCESSING ]
             │
             ▼
       [ PREPARING ] ─── (Kitchen confectionery packaging)
             │
             ▼
        [ SHIPPED ]
             │
             ▼
   [ OUT_FOR_DELIVERY ] ── (Courier on transit to doorstep)
             │
             ▼
       [ DELIVERED ] ──── (Order fulfilled & settled)

   * Any pre-dispatch stage can transition to [ CANCELLED ] with atomic stock restocking.
```

### 4.4 Admin ERP Panel
- **Real-Time Dashboard**: Metric cards calculating Total Gross Revenue, Active Orders count, Total Registered Customers, and Low-Stock Warnings.
- **Live Orders Management**: Polling every 10 seconds; enables status transitions, customer phone calling shortcuts, and coupon discount inspection.
- **Real-Time Customer Directory**: Automatically cross-references order histories by User ID, Email, and Customer Name, calculating life-time orders count and expenditure.
- **Coupons Management**: Interactive **Implement / Stop** toggle controls enabling instant pause on promotional codes without deleting historical ledger records.
- **Inventory & Category Controls**: Add, edit, disable, or adjust stock quantity with live visual indicators for low inventory (< 10 units).

---

## 5. Security & Reliability Architecture

### 5.1 Defense in Depth
1. **Stateless JWT**: Standard Bearer token authentication signed via HMAC-SHA256 with 24-hour expiration.
2. **Login Rate Limiter (`LoginRateLimiterFilter`)**: Sliding window tracking in memory. Blocks IP addresses making more than 15 login attempts per minute with HTTP 429 Too Many Requests.
3. **HTTP Security Headers**:
   - `Strict-Transport-Security`: `max-age=31536000; includeSubDomains`
   - `X-Frame-Options`: `DENY` (prevents Clickjacking)
   - `X-Content-Type-Options`: `nosniff` (prevents MIME sniffing)
   - `Referrer-Policy`: `strict-origin-when-cross-origin`
4. **Data Sanitization**: Global Exception Handler intercepts 500 errors and suppresses stack traces from client JSON responses while recording complete logs on the server.

### 5.2 Observability & Reliability
- **Distributed Request Correlation**: Every incoming request is assigned an `X-Request-ID` UUID via `RequestCorrelationFilter`, attached to HTTP response headers and bound to Logback's `MDC` for centralized log aggregation.
- **Health Probes**:
  - `GET /api/health` — Application-level liveness check returning uptime and service name.
  - `GET /actuator/health` — Spring Boot Actuator infrastructure probe.
- **Frontend Error Resilience**: Top-level `ErrorBoundary` catches unexpected component render errors and provides user recovery options without white-screening.
- **Network Resilience**: Axios client incorporates a 10s timeout and automatic backoff retry (up to 2 attempts) for idempotent `GET` requests encountering transient gateway issues.

---

## 6. Database Schema & Entities

```
 ┌──────────────────────┐         ┌──────────────────────┐
 │        users         │         │      categories      │
 ├──────────────────────┤         ├──────────────────────┤
 │ id (PK)              │         │ id (PK)              │
 │ email (UQ, IDX)      │         │ name (UQ)            │
 │ password             │         │ description          │
 │ full_name            │         │ image_url            │
 │ phone                │         │ active               │
 │ role (USER/ADMIN)    │         └──────────┬───────────┘
 │ enabled              │                    │
 └──────────┬───────────┘                    │ 1:N
            │                                ▼
            │ 1:N                 ┌──────────────────────┐
            │                     │       products       │
            ▼                     ├──────────────────────┤
 ┌──────────────────────┐         │ id (PK)              │
 │        orders        │         │ name                 │
 ├──────────────────────┤         │ sku (UQ)             │
 │ id (PK)              │         │ price, discount_price│
 │ order_number (UQ,IDX)│         │ stock_quantity       │
 │ user_id (FK, IDX)    │◄───┐    │ category_id (FK, IDX)│
 │ total_amount         │    │    │ active (IDX)         │
 │ discount_amount      │    │    └──────────┬───────────┘
 │ final_amount         │    │               │
 │ coupon_code          │    │               │ 1:N
 │ status (IDX)         │    │               ▼
 │ payment_method       │    │    ┌──────────────────────┐
 │ payment_status       │    │    │     order_items      │
 │ shipping_address     │    │    ├──────────────────────┤
 │ contact_phone        │    │    │ id (PK)              │
 └──────────┬───────────┘    │    │ order_id (FK)        │
            │                │    │ product_id (FK)      │
            │ 1:N            │    │ product_name         │
            ▼                │    │ quantity, unit_price │
 ┌──────────────────────┐    │    │ total_price          │
 │       coupons        │    │    └──────────────────────┘
 ├──────────────────────┤    │
 │ id (PK)              │    │
 │ code (UQ)            │    │
 │ discount_type        │    │
 │ discount_value       │    │
 │ min_order_amount     │    │
 │ active               │    │
 └──────────────────────┘    │
```

---

## 7. REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new customer account.
- `POST /api/auth/login`: Authenticate customer or administrator; returns JWT bearer token.
- `GET /api/auth/me`: Retrieve current profile of authenticated user.

### Products & Categories (`/api/products`, `/api/categories`)
- `GET /api/products`: Retrieve paginated products with filtering by category, price, and search query.
- `GET /api/products/{id}`: Detailed product specifications, inventory count, and customer reviews.
- `GET /api/products/featured`: Top bestseller confections.
- `GET /api/categories`: List all active product categories.

### Cart & Orders (`/api/cart`, `/api/orders`)
- `GET /api/cart`: Retrieve current user's database cart items.
- `POST /api/cart/items`: Add or update item quantity in cart.
- `DELETE /api/cart`: Empty database cart.
- `POST /api/orders/checkout`: Atomic transactional checkout. Validates coupon, reserves stock, creates order.
- `GET /api/orders`: Paginated list of past orders for authenticated user.
- `GET /api/orders/{id}`: Specific order tracking details.

### Payments (`/api/payments`)
- `POST /api/payments/create-order`: Generate Razorpay transaction token.
- `POST /api/payments/verify`: Validate HMAC signature and finalize payment.
- `POST /api/payments/webhook`: Asynchronous payment status callbacks from Razorpay.

### Health & Monitoring (`/api/health`, `/actuator/health`)
- `GET /api/health`: JSON heartbeat with server uptime and timestamp.
- `GET /actuator/health`: Spring Boot Actuator health status.

### Admin Operations (`/api/admin/**`)
- `GET /api/admin/orders`: Complete order records across all customers with live status filter.
- `PATCH /api/admin/orders/{id}/status`: Advance order lifecycle status (`CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, etc.).
- `GET /api/admin/users`: Registered client directory.
- `GET /api/admin/products`, `POST /api/admin/products`, `PUT /api/admin/products/{id}`: Manage inventory and catalog.
- `GET /api/admin/coupons`, `POST /api/admin/coupons`: Manage promotional campaigns.
- `PATCH /api/admin/coupons/{id}/toggle`: Instant activation/deactivation of coupon codes.

---

## 8. Deployment & Operations Guide

### 8.1 Local Development

#### 1. Start MySQL
Ensure MySQL 8 is running locally on port 3306 with database `pragathi_sweets`:
```sql
CREATE DATABASE IF NOT EXISTS pragathi_sweets;
```

#### 2. Start Backend
```powershell
cd "c:\Training\Pragathi sweets\pragathi-sweets-backend"
.\mvnw.cmd spring-boot:run
```
API available at `http://localhost:8080`.
Interactive Swagger UI: `http://localhost:8080/swagger-ui.html`.

#### 3. Start Frontend
```powershell
cd "c:\Training\Pragathi sweets\pragathi-sweets-frontend"
npm install
npm run dev
```
Application UI available at `http://localhost:5173`.

---

### 8.2 Production Container Deployment (Docker Compose)

The repository provides a complete, production-ready multi-container configuration in [docker-compose.yml](file:///c:/Training/Pragathi%20sweets/docker-compose.yml).

#### 1. Setup Environment
Copy the template configuration and fill in your production secrets:
```powershell
cp .env.example .env
```

Edit `.env`:
```env
DB_NAME=pragathi_sweets
DB_ROOT_PASSWORD=SecureRootPasswordHere_2026
DB_USER=pragathi_app
DB_PASSWORD=SecureAppPasswordHere_2026

JWT_SECRET=YourProductionBase64EncodedSecretAtLeast256BitsLong
RAZORPAY_KEY_ID=rzp_live_YourKey
RAZORPAY_KEY_SECRET=YourRazorpaySecret

DEFAULT_ADMIN_EMAIL=admin@pragathisweets.com
DEFAULT_ADMIN_PASSWORD=YourStrongAdminPassword
```

#### 2. Launch Entire Stack
```powershell
docker-compose up -d --build
```
This starts:
1. `pragathi-mysql`: MySQL 8 container with persistent volume and automatic healthcheck.
2. `pragathi-backend`: Compiled Spring Boot 3 JRE 21 container running under unprivileged user `appuser`.
3. `pragathi-frontend`: Nginx Alpine container serving optimized React assets with gzip, caching, and API reverse proxy on port 80.

#### 3. Verification
```powershell
docker-compose ps
curl http://localhost/api/health
```

---

## 9. Default Administrator Credentials

On first run, the system automatically initializes an administrative user:
- **Email**: `admin@pragathisweets.com`
- **Password**: `Admin@123` (or the value set in `DEFAULT_ADMIN_PASSWORD`)
- **Admin Portal URL**: `http://localhost:5173/admin/login`

> [!IMPORTANT]
> Change the default admin password immediately in production via the administrative profile settings or by configuring `DEFAULT_ADMIN_PASSWORD` in `.env`.
