# ShopEZ

ShopEZ is a full-stack MERN shopping application with a redesigned storefront and an admin control center. It supports the complete demo shopping flow without a real payment gateway.

## Core capabilities

- Product catalog with search, category filters and sorting
- Product detail pages with ratings and customer reviews
- Browser-persisted shopping bag with quantity controls
- JWT-based customer/admin authentication
- Coupon validation and discount calculation
- Mock checkout and database-backed orders
- Customer order history and order confirmation
- Admin product CRUD
- Admin order-status management
- Admin coupon management
- Admin sales and top-product analytics

## Technology

- **Frontend:** React, Vite, React Router, Axios, Bootstrap 5
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT + bcrypt
- **Client state:** React Context + localStorage

## Run locally

### 1. Start the backend

```bash
cd server
npm install
npm run seed
npm run dev
```

The API runs on `http://localhost:5000`.

The seed creates a demo admin account:

- Email: `admin@shopez.com`
- Password: `admin123`
- Coupon: `NEXA10` (10% off)

If you use MongoDB Atlas, update `server/.env` with your connection string.

### 2. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will print the local frontend URL.

The frontend reads the API base URL from `client/.env`.

## Project structure

```text
shopez/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── index.html
└── server/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── seed.js
    └── server.js
```

## Checkout note

Checkout is intentionally simulated for this project. Placing an order creates an order in MongoDB and updates stock, but no real payment provider is contacted.

## Client-side storage

The current shopping bag and login session are kept in browser localStorage. The server remains responsible for users, products, reviews, coupons and orders.
