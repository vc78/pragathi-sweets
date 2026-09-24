🍬 Pragathi Sweets

Enterprise-Grade Indian Sweets & D2C E-Commerce Platform

<p align="center">
  <strong>Premium sweets • Secure checkout • Real-time order operations • Admin ERP</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-api-overview">API</a> •
  <a href="#-local-development">Development</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-security">Security</a>
</p>

📌 Overview

Pragathi Sweets is a full-stack, production-oriented e-commerce platform built for Indian sweets, savouries, dry fruits, and festive gift collections.

The platform combines a premium customer shopping experience with a secure Spring Boot backend, transactional checkout, Razorpay payments, Cash on Delivery, inventory management, coupon operations, order lifecycle tracking, and an administrative ERP-style dashboard.

The system is designed with seasonal commerce in mind, including festivals, weddings, and gifting seasons. fileciteturn2file0L7-L21

✨ Features

🛍️ Premium product discovery and catalog

🧁 Indian sweets, savouries, dry fruits & gift boxes

🛒 Per-user cart isolation

🔄 Guest-to-user cart migration

💳 Razorpay payments

💵 Cash on Delivery

🎟️ Server-side coupon validation

🚚 Delivery-fee calculation

📦 End-to-end order lifecycle

⭐ Product reviews

📊 Admin ERP dashboard

👥 Customer management

📦 Inventory management

🎫 Coupon management

🔐 JWT authentication & role-based authorization

🛡️ Login rate limiting and security headers

📱 Responsive customer experience

🐳 Dockerized deployment

⚙️ GitHub Actions CI

📚 OpenAPI / Swagger

🩺 Health and monitoring endpoints

🏗️ Architecture

                         ┌──────────────────────────────┐
                         │      Customer Browser        │
                         │     Desktop / Mobile         │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       Nginx Reverse Proxy    │
                         │          :80 / :443          │
                         └──────────────┬───────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                         ▼                             ▼
              ┌────────────────────┐        ┌────────────────────┐
              │ React 18 + Vite    │        │ Spring Boot API    │
              │ Tailwind + Redux   │        │ Java 21            │
              └────────────────────┘        └─────────┬──────────┘
                                                       │
                          ┌────────────────────────────┼──────────────────────┐
                          │                            │                      │
                          ▼                            ▼                      ▼
                 ┌────────────────┐          ┌────────────────┐      ┌───────────────┐
                 │    MySQL 8     │          │    Razorpay    │      │  SMTP / Mail  │
                 │   Persistence  │          │ Payments/API   │      │ Notifications │
                 └────────────────┘          └────────────────┘      └───────────────┘

The documented production architecture uses React/Vite behind Nginx, a Spring Boot API, MySQL persistence, Razorpay integration, SMTP, Docker Compose, and GitHub Actions CI. fileciteturn2file0L25-L103

🧰 Tech Stack

Layer

Technology

Frontend

React 18

Build Tool

Vite 5.4

Styling

TailwindCSS

State Management

Redux Toolkit

UI Icons

Lucide React

Animations

Framer Motion

HTTP

Axios

Backend

Java 21

Framework

Spring Boot 3.5.3

Security

Spring Security 6

Authentication

JWT / JJWT

Password Hashing

BCrypt

Persistence

Spring Data JPA

ORM

Hibernate

Database

MySQL 8

API Documentation

SpringDoc OpenAPI / Swagger

Payments

Razorpay

Web Server

Nginx Alpine

Containers

Docker / Docker Compose

CI

GitHub Actions

📁 Repository Structure

.
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── pragathi-sweets-backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ems/pragathisweets/
│       │   ├── config/
│       │   ├── controller/
│       │   │   └── admin/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── mapper/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       └── resources/
│           ├── application.properties
│           └── application-prod.properties
└── pragathi-sweets-frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/
        ├── hooks/
        ├── pages/
        ├── services/
        └── store/

The documented repository separates the React SPA from the Spring Boot API and organizes backend concerns into controllers, DTOs, entities, repositories, services, security, and configuration. fileciteturn2file0L107-L207

🛍️ Core Commerce

Customer Experience

Catalog discovery

Categories and featured products

Product details

Package-size selection

Customer reviews

Responsive product grids

Cart synchronization

Cart Isolation

Guest
  │
  ├── ps_cart_guest
  │
  ▼
Authentication
  │
  ▼
ps_cart_{userId}
  │
  └── Guest selections merged

The documented cart lifecycle isolates users and supports guest-to-user migration. fileciteturn2file0L213-L229

💳 Checkout & Payments

Delivery

Order < ₹999  →  ₹50 delivery
Order ≥ ₹999  →  Free priority delivery

Coupon validation and delivery pricing are enforced server-side. fileciteturn2file0L231-L240

Razorpay Flow

Customer
   │
   ▼
POST /api/payments/create-order
   │
   ▼
Spring Boot → Razorpay
   │
   ▼
Razorpay Checkout
   │
   ▼
POST /api/payments/verify
   │
   ▼
HMAC-SHA256 verification
   │
   ▼
Order CONFIRMED

The backend verifies the Razorpay signature before finalizing payment. fileciteturn2file0L241-L251

COD

COD bypasses the initial gateway payment and is reconciled during fulfillment. fileciteturn2file0L253-L257

📦 Order Lifecycle

PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
PREPARING
   ↓
SHIPPED
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED

Pre-dispatch orders may transition to CANCELLED with stock restoration. fileciteturn2file0L259-L311

🧑‍💼 Admin ERP

The administrative system provides:

Live order monitoring

Customer directory

Revenue metrics

Active-order metrics

Low-stock warnings

Product management

Inventory controls

Category controls

Coupon activation/deactivation

Customer order history

fileciteturn2file0L313-L323

🔐 Security

The application uses defense-in-depth security:

Stateless JWT authentication

24-hour token expiration

BCrypt password hashing

Role-based authorization

Login rate limiting

HSTS

X-Frame-Options: DENY

X-Content-Type-Options: nosniff

Strict referrer policy

Global exception handling

Request correlation IDs

Health probes

Frontend Error Boundary

GET retry handling for transient failures

fileciteturn2file0L327-L359

🔌 REST API

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Products

GET /api/products
GET /api/products/{id}
GET /api/products/featured
GET /api/categories

Cart

GET    /api/cart
POST   /api/cart/items
DELETE /api/cart

Orders

POST /api/orders/checkout
GET  /api/orders
GET  /api/orders/{id}

Payments

POST /api/payments/create-order
POST /api/payments/verify
POST /api/payments/webhook

Health

GET /api/health
GET /actuator/health

Admin

GET   /api/admin/orders
PATCH /api/admin/orders/{id}/status
GET   /api/admin/users
GET   /api/admin/products
POST  /api/admin/products
PUT   /api/admin/products/{id}
GET   /api/admin/coupons
POST  /api/admin/coupons
PATCH /api/admin/coupons/{id}/toggle

fileciteturn2file0L459-L519

🚀 Local Development

Prerequisites

Java 21

Node.js

npm

MySQL 8

Git

Database

CREATE DATABASE IF NOT EXISTS pragathi_sweets;

Backend

cd pragathi-sweets-backend
.\mvnw.cmd spring-boot:run

API:

http://localhost:8080

Swagger:

http://localhost:8080/swagger-ui.html

Frontend

cd pragathi-sweets-frontend
npm install
npm run dev

Frontend:

http://localhost:5173

fileciteturn2file0L523-L563

🐳 Docker Deployment

cp .env.example .env

Configure:

DB_NAME=pragathi_sweets
DB_ROOT_PASSWORD=<strong-secret>
DB_USER=<application-user>
DB_PASSWORD=<strong-secret>
JWT_SECRET=<strong-secret>
RAZORPAY_KEY_ID=<razorpay-key>
RAZORPAY_KEY_SECRET=<razorpay-secret>
DEFAULT_ADMIN_EMAIL=<admin-email>
DEFAULT_ADMIN_PASSWORD=<strong-secret>

Start:

docker compose up -d --build

Verify:

docker compose ps
curl http://localhost/api/health

The documented Docker deployment runs MySQL, Spring Boot, and Nginx/React as the production stack. fileciteturn2file0L567-L629

⚠️ Never commit .env, payment secrets, JWT secrets, database passwords, or other private credentials.

⚙️ CI/CD

GitHub Actions is configured under:

.github/workflows/ci.yml

The documented CI process validates backend Maven builds/tests and frontend production builds. fileciteturn2file0L101-L103

🧪 Quality Checklist

Before merging:

[ ] Backend tests pass
[ ] Frontend production build passes
[ ] Authentication tested
[ ] Authorization tested
[ ] Cart isolation tested
[ ] Checkout tested
[ ] Coupon validation tested
[ ] Razorpay verification tested
[ ] COD tested
[ ] Order lifecycle tested
[ ] Inventory tested
[ ] Admin APIs tested
[ ] Mobile UI tested
[ ] Docker build tested
[ ] Secrets checked

🤝 Contributing

Fork the repository.

Create a feature branch.

git checkout -b feature/your-feature

Make focused changes.

Run tests and production builds.

Review security implications.

Commit clearly.

git commit -m "feat: improve product recommendations"

Push:

git push origin feature/your-feature

Open a Pull Request.

For UI changes, include screenshots and explain relevant API, database, security, and deployment impact.

📄 License

Add the project's intended license before publishing the repository publicly.

Do not claim an open-source license unless the project owner has explicitly selected one.

🍬 Pragathi Sweets

Premium Customer Experience
          +
Secure Backend
          +
Transactional Commerce
          +
Payment Infrastructure
          +
Administrative Operations
          +
Containerized Deployment
          +
CI/CD

<p align="center">
  <strong>Pragathi Sweets</strong><br/>
  Crafted for sweets. Engineered for scale.
</p>
