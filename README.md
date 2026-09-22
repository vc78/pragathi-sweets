# 🍬 Pragathi Sweets — Enterprise E-Commerce Platform

[![CI Pipeline](https://github.com/vc78/pragathi-sweets/actions/workflows/ci.yml/badge.svg)](https://github.com/vc78/pragathi-sweets/actions)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-green?logo=springboot)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

A production-hardened, full-stack e-commerce platform designed for authentic Indian confections, savouries, dry fruits, and festive gift assortments. Built with **Java 21 (Spring Boot 3.5.3)**, **MySQL 8**, **React 18 (Vite 5)**, **TailwindCSS**, and **Docker**.

---

## 📖 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Key Features](#-key-features)
- [Quick Start with Docker Compose](#-quick-start-with-docker-compose)
- [Local Development Setup](#-local-development-setup)
- [Default Credentials](#-default-credentials)
- [API & Documentation](#-api--documentation)
- [Security & Production Hardening](#-security--production-hardening)
- [Repository Structure](#-repository-structure)

---

## 🏛 Architecture Overview

```
                                  [ Client Browsers / Devices ]
                                                 │
                                                 ▼
                                     ┌───────────────────────┐
                                     │     Nginx (Port 80)   │
                                     │  (Gzip, Cache, Proxy) │
                                     └───────────┬───────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │ Static Assets (SPA)                             │ /api/* Proxy
                        ▼                                                 ▼
             ┌─────────────────────┐                          ┌────────────────────────┐
             │  React + Vite SPA   │                          │  Spring Boot 3.5 API   │
             │ (Tailwind + Redux)  │                          │      (Port 8080)       │
             └─────────────────────┘                          └───────────┬────────────┘
                                                                          │
                                               ┌──────────────────────────┴──────────────────────────┐
                                               ▼                                                     ▼
                                     ┌──────────────────┐                                  ┌──────────────────┐
                                     │  MySQL 8.0 RDBMS │                                  │ Razorpay Gateway │
                                     │   (Port 3306)    │                                  │ (Online Payments)│
                                     └──────────────────┘                                  └──────────────────┘
```

For comprehensive deep-dive documentation, see [PROJECT_DOCUMENTATION.md](file:///c:/Training/Pragathi%20sweets/PROJECT_DOCUMENTATION.md).

---

## ✨ Key Features

### 🛒 Customer Experience
- **Artisanal Product Showcase**: Category filtering, live search, dietary badges, and package size selection (250g, 500g, 1kg).
- **Per-User Cart Isolation**: Separate cart storage per customer (`ps_cart_${userId}`) preventing cart bleeding between accounts.
- **Guest-to-User Cart Migration**: Selections made anonymously in `ps_cart_guest` merge automatically upon authentication.
- **Dynamic Coupons Engine**: Live promo code validation (`AZADI15`, `RAKHI200`, `SWEET10`) with minimum order requirements.
- **Dual Payment Workflows**:
  - **Razorpay**: Online payments with server-side HMAC-SHA256 signature verification.
  - **Cash on Delivery (COD)**: Post-delivery reconciliation and verification workflow.
- **Real-Time Order Tracking**: 8-stage progress tracker (`PENDING` → `CONFIRMED` → `PROCESSING` → `PREPARING` → `SHIPPED` → `OUT_FOR_DELIVERY` → `DELIVERED`).
- **Pragathi Royale Loyalty**: Client gold coin rewards system with instant redemption.

### 🛡 Administrative ERP Suite
- **Live Command Dashboard**: Real-time KPI summary cards (revenue, active orders, customer count, low-stock warnings).
- **Orders Management**: Live status updates with 10-second polling, customer phone calling shortcuts, and coupon breakdown.
- **Customer Directory**: Auto-matching order history across user IDs, emails, and full names.
- **Promotions & Offers Control**: One-click **Implement / Stop** switches to pause campaigns without deleting history.
- **Inventory Threshold Management**: Automatic flagging of products with inventory below 10 units.

---

## 🚀 Quick Start with Docker Compose

Deploy the entire stack (MySQL 8 + Backend API + Frontend SPA) with a single command:

```bash
# 1. Clone repository
git clone https://github.com/vc78/pragathi-sweets.git
cd pragathi-sweets

# 2. Copy environment template
cp .env.example .env

# 3. Start all containers
docker-compose up -d --build
```

Access the application:
- **Customer Storefront**: `http://localhost`
- **Admin Control Panel**: `http://localhost/admin/login`
- **Backend Healthcheck**: `http://localhost/api/health`

---

## 💻 Local Development Setup

### Prerequisites
- Java 21 JDK
- Node.js 20+ and npm
- MySQL 8.0 running locally on port 3306

### 1. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS pragathi_sweets;
```

### 2. Backend Setup
```bash
cd pragathi-sweets-backend
./mvnw clean spring-boot:run
```
- API Server runs at: `http://localhost:8080`
- Swagger OpenAPI documentation: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup
```bash
cd pragathi-sweets-frontend
npm install
npm run dev
```
- Frontend dev server runs at: `http://localhost:5173`

---

## 🔑 Default Credentials

On initial startup, the database auto-seeds a default administrative user:
- **Email**: `admin@pragathisweets.com`
- **Password**: `Admin@123`
- **Admin URL**: `http://localhost:5173/admin/login` (or `http://localhost/admin/login` in Docker)

---

## 📡 API & Documentation

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register new customer | Public |
| `/api/auth/login` | `POST` | Customer & admin login (JWT) | Public (Rate Limited) |
| `/api/products` | `GET` | Paginated product catalog | Public |
| `/api/categories` | `GET` | Active sweet categories | Public |
| `/api/cart` | `GET` / `POST` / `DELETE` | Shopping cart operations | Authenticated |
| `/api/orders/checkout` | `POST` | Atomic checkout transaction | Authenticated |
| `/api/orders` | `GET` | Customer order history | Authenticated |
| `/api/payments/verify` | `POST` | HMAC signature validation | Authenticated |
| `/api/health` | `GET` | Service uptime and heartbeat | Public |
| `/api/admin/orders` | `GET` / `PATCH` | Order processing & dispatch | Admin Only |
| `/api/admin/coupons` | `GET` / `PATCH` | Promotions & toggle controls | Admin Only |

Full interactive API contracts can be inspected via Swagger UI at `/swagger-ui.html`.

---

## 🔒 Security & Production Hardening

- **Sliding-Window Rate Limiting**: In-memory IP tracking on `/api/auth/login` throttles brute-force attempts to max 15 requests/minute.
- **Enterprise Headers**: Enforces HSTS (1 year), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict referrer policy.
- **Data Leak Prevention**: Global exception handler masks internal error messages and stack traces on 500 errors.
- **Distributed Tracing**: Generates `X-Request-ID` UUID per request, integrated into Logback's `MDC` context.
- **Resilient Frontend**: Top-level `ErrorBoundary` handles render glitches with one-click page reload recovery.

---

## 📂 Repository Structure

```
├── .github/workflows/ci.yml         # Automated GitHub Actions CI pipeline
├── docker-compose.yml               # Multi-container production deployment
├── .env.example                     # Environment template file
├── PROJECT_DOCUMENTATION.md         # Detailed technical and architecture guide
├── README.md                        # Project introduction and quickstart
├── pragathi-sweets-backend/         # Spring Boot 3.5 Java backend
│   ├── Dockerfile                   # Multi-stage JRE 21 Alpine image
│   └── src/main/                    # Source files, entities, security, configs
└── pragathi-sweets-frontend/        # React 18 + Vite frontend
    ├── Dockerfile                   # Multi-stage Nginx Alpine image
    ├── nginx.conf                   # Reverse proxy, caching & SPA routing
    └── src/                         # Components, pages, hooks, state store
```

---

## 📄 License
All rights reserved © 2026 Pragathi Sweets. Proprietary and confidential.
