# Pragathi Sweets — Backend

A production-structured Spring Boot backend for the Pragathi Sweets e-commerce platform.
Built with Java 21, Spring Boot 3.5, Spring Security (JWT), Spring Data JPA (MySQL), Razorpay, and springdoc-openapi (Swagger UI).

## Stack

- **Java 21**, **Spring Boot 3.5**
- **Spring Web**, **Spring Data JPA**, **Spring Security**, **Spring Validation**, **Spring Mail**
- **MySQL** (via `mysql-connector-j`)
- **JWT** auth via `jjwt`
- **Razorpay** payment gateway integration
- **springdoc-openapi** for Swagger UI
- **Lombok**

## Project layout

```
src/main/java/com/ems/pragathisweets/
├── PragathiSweetsApplication.java
├── config/            # Security, CORS, Razorpay, Swagger, DB bootstrap
├── controller/         # Public REST controllers
│   └── admin/           # Admin-only REST controllers
├── dto/                # Request/response payloads
│   └── admin/
├── entity/             # JPA entities
├── exception/           # Custom exceptions + global handler
├── mapper/              # Entity <-> DTO mappers
├── repository/           # Spring Data JPA repositories
├── security/            # JWT filter/service, UserDetails
└── service/             # Business logic
    └── admin/
```

## Getting started

### 1. Prerequisites
- JDK 21+
- Maven 3.9+ (or use the bundled `./mvnw`)
- MySQL 8+ running locally (or update `DB_URL` to point elsewhere)

### 2. Configure environment variables

All secrets are externalized — nothing sensitive is hardcoded. Copy these into your shell,
an `.env` file loaded by your process manager, or your IDE run configuration:

| Variable | Purpose | Default |
|---|---|---|
| `DB_URL` | JDBC URL | `jdbc:mysql://localhost:3306/pragathi_sweets?...` |
| `DB_USERNAME` / `DB_PASSWORD` | MySQL credentials | `root` / `root` |
| `JWT_SECRET` | Base64-encoded HS256 key (256-bit+) | dev placeholder — **change in prod** |
| `JWT_EXPIRATION_MS` | Access token lifetime | `86400000` (24h) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials | test placeholders |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP credentials | empty |
| `MAIL_ENABLED` | Turn on real email sending | `false` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins | `http://localhost:3000,http://localhost:5173` |
| `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` | Bootstrap admin account created on first run | `admin@pragathisweets.com` / `Admin@123` |

> ⚠️ The placeholder values in `application.properties` are for local development only.
> Generate a real secret for `JWT_SECRET` (e.g. `openssl rand -base64 64`), use real Razorpay
> keys, and change the default admin password immediately in any shared or production environment.

### 3. Run

```bash
./mvnw spring-boot:run
```

The app starts on `http://localhost:8080`. Swagger UI is available at
`http://localhost:8080/swagger-ui.html`.

On first boot, a default admin account is created automatically (see `DEFAULT_ADMIN_EMAIL` above)
so you can log in and start managing products/categories/orders right away.

### 4. Build a jar

```bash
./mvnw clean package
java -jar target/pragathi-sweets-backend-1.0.0.jar
```

## Authentication

JWT bearer tokens. Register/login via `/api/auth/*`, then send:

```
Authorization: Bearer <token>
```

on subsequent requests. Admin-only endpoints live under `/api/admin/**` and require a user
with role `ROLE_ADMIN` (use `/api/admin/users/{id}/role` as an existing admin to promote a user).

## API overview

### Public
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/categories`, `GET /api/categories/{id}`
- `GET /api/products`, `/api/products/category/{id}`, `/api/products/search`, `/api/products/featured`, `/api/products/{id}`
- `GET /api/reviews/product/{productId}`
- `GET /api/festival-offers`

### Authenticated (shopper)
- `GET/POST/PUT/DELETE /api/cart`, `/api/cart/items/**`
- `POST /api/orders/checkout`, `GET /api/orders`, `GET /api/orders/{id}`, `POST /api/orders/{id}/cancel`
- `POST /api/payments/razorpay/create/{orderNumber}`, `POST /api/payments/razorpay/verify`
- `GET /api/coupons/validate`
- `POST /api/reviews`, `DELETE /api/reviews/{id}`

### Admin (`ROLE_ADMIN`)
- `/api/admin/users/**` — list/view users, change role/status
- `/api/admin/products/**`, `/api/admin/categories/**` — catalog management
- `/api/admin/orders/**` — view orders, update status
- `/api/admin/inventory/**` — low-stock report, stock adjustment
- `/api/admin/coupons/**` — coupon CRUD
- `/api/admin/festival-offers/**` — seasonal offer CRUD
- `/api/admin/analytics/dashboard`, `/api/admin/analytics/sales-report`

## Order & payment flow

1. Shopper adds items to `/api/cart`.
2. `POST /api/orders/checkout` (paymentMethod = `COD` or `RAZORPAY`) creates the order,
   decrements stock, applies a coupon if provided, and clears the cart.
3. For `RAZORPAY` orders, the frontend calls `POST /api/payments/razorpay/create/{orderNumber}`
   to get a Razorpay order id, opens Razorpay Checkout, then calls
   `POST /api/payments/razorpay/verify` with the returned payment id/signature to confirm payment.
4. Cancelling an order (`POST /api/orders/{id}/cancel`) restocks the items automatically.

## Notes for production hardening

- Rotate `JWT_SECRET` and store it in a secrets manager, not in `application.properties`.
- Configure the Razorpay webhook secret and implement signature verification in
  `PaymentController#handleWebhook` before trusting webhook payloads.
- Set `spring.jpa.hibernate.ddl-auto` to `validate` and manage schema via a migration tool
  (Flyway/Liquibase) once the schema stabilizes.
- Put the app behind HTTPS and restrict `CORS_ALLOWED_ORIGINS` to your real frontend domain(s).
