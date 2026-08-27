# Pragathi Sweets — Frontend

React (Vite) storefront + admin panel for Pragathi Sweets, built to pair with the
`pragathi-sweets-backend` Spring Boot API.

## Stack
- React 18 + Vite
- React Router v6 (customer + admin routing, role-protected)
- Redux Toolkit (auth session state — `store/authSlice.js`)
- Axios (API layer in `services/`, one file per backend controller group)
- Tailwind CSS (custom "sweet box seal" brand theme — see `tailwind.config.js` / `index.css`)
- Recharts (Sales/analytics charts in the admin panel)
- Razorpay Checkout.js (loaded at runtime in `pages/customer/Checkout.jsx`)

## Getting started

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your backend, e.g. http://localhost:8080/api
npm run dev
```

The app runs at http://localhost:5173.

## Backend not running yet?

Every function in `src/services/*.js` calls the real API first and, if the
request fails (e.g. backend isn't up), falls back to realistic mock data from
`services/mockData.js`. This means the entire storefront and admin panel are
clickable and demoable **even with zero backend**, and will start hitting real
endpoints automatically the moment `pragathi-sweets-backend` is reachable at
`VITE_API_URL`.

## Folder structure

```
src/
├── pages/
│   ├── customer/   Home, Products, ProductDetails, Cart, Checkout, Orders, Profile
│   ├── auth/       Login, Register
│   └── admin/      AdminLogin, Dashboard, ProductsManagement, AddProduct,
│                    OrdersManagement, Customers, Inventory, Offers, Reviews, Analytics
├── components/
│   ├── customer/   Navbar, Footer, SweetCard
│   └── admin/      AdminSidebar, AdminNavbar, AdminLayout, StatCard, SalesChart, DataTable
├── routes/         AppRoutes.jsx, ProtectedRoute.jsx
├── services/       api.js (axios instance), authService, productService,
│                    orderService, adminService, mockData.js
├── store/          index.js (Redux store), authSlice.js
└── hooks/          useCart.js (localStorage-backed cart, shared across pages)
```

## Auth & routing

- `/login`, `/register` → customer auth
- `/admin/login` → separate admin auth
- `ProtectedRoute` guards `/checkout`, `/orders`, `/profile` (role `CUSTOMER`)
  and every `/admin/*` page except `/admin/login` (role `ADMIN`)
- Session (`user`, `token`) lives in Redux + localStorage via `authSlice.js`

## Payments

Checkout supports **Razorpay** (loaded dynamically, creates the internal order,
then calls `POST /payments/razorpay/create/{orderNumber}` and
`POST /payments/razorpay/verify` on your backend) and
**Cash on Delivery**. Set `VITE_RAZORPAY_KEY_ID` in `.env` for your Razorpay
test/live key — falls back to a placeholder key in mock mode.

## Notes / next steps for the backend team

- Expected REST endpoints are visible directly in `src/services/*.js` — this
  file set is effectively the API contract the frontend expects from
  `pragathi-sweets-backend` (AuthController, ProductController, OrderController,
  PaymentController, ReviewController, and the `admin/*` controllers).
- JWT is sent as `Authorization: Bearer <token>` on every request (see
  `services/api.js`); a 401 response automatically logs the user out.
