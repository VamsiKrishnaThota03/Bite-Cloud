# Bite-Cloud

A MERN food ordering app: browse a categorized menu stored in MongoDB, search dishes, pick a size and quantity, and manage a cart.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)

[![CI](https://github.com/VamsiKrishnaThota03/bite-cloud/actions/workflows/ci.yml/badge.svg)](https://github.com/VamsiKrishnaThota03/bite-cloud/actions/workflows/ci.yml)
[![CodeQL](https://github.com/VamsiKrishnaThota03/bite-cloud/actions/workflows/codeql.yml/badge.svg)](https://github.com/VamsiKrishnaThota03/bite-cloud/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Menu](docs/screenshots/home.png)

| Cart | Mobile |
| ---- | ------ |
| ![Cart](docs/screenshots/cart.png) | <img src="docs/screenshots/mobile.png" alt="Mobile view" width="260" /> |

## Overview

Bite-Cloud has two parts. `frontend/` is a React (Create React App) client, and `backend/` is an Express API backed by MongoDB. The home page loads food categories and food items from the API and groups the items by category. Users can sign up and log in, and logged-in users get a cart.

## Features

- Hero banner with a search box that filters dishes by name, plus category filter chips.
- Menu grouped by category (Biryani/Rice, Starter, Pizza in the sample data), with each item's image, description and its real size options (half/full or regular/medium/large).
- Food cards with quantity and size selectors. The price updates as you change them.
- A cart (React Context + `useReducer`) in a modal: add items (the same dish and size are merged), remove items, clear the cart and see the total.
- Sign up and log in with request validation (`express-validator`), bcrypt password hashing and a JWT (7-day expiry) stored in `localStorage`. Errors are shown inline.
- Loading, empty and error states for the menu, and a dark Bootstrap 5.3 theme (`data-bs-theme="dark"`).
- A seed script that loads a sample menu into MongoDB.

## Tech stack

| Layer    | Technology                                                           |
| -------- | -------------------------------------------------------------------- |
| Frontend | React 18, React Router 6, React Bootstrap, Bootstrap 5.3             |
| Backend  | Node.js, Express 4, express-validator, bcryptjs, jsonwebtoken, cors, dotenv |
| Database | MongoDB (Atlas or local) with Mongoose 7                             |

## Project structure

```
Bite-Cloud/
├── backend/
│   ├── data/foodItems.json # sample menu used by the seed script
│   ├── models/             # User, food_category, food_items schemas
│   ├── routes/
│   │   ├── CreateUser.js   # sign up / log in
│   │   └── DisplayData.js  # menu data
│   ├── config.js           # reads and validates environment variables
│   ├── db.js               # MongoDB connection
│   ├── seed.js             # loads data/foodItems.json into MongoDB
│   └── index.js            # Express entry point
└── frontend/
    ├── public/
    └── src/
        ├── api.js          # API base URL and fetch helper
        ├── components/     # Navbar, Card, Footer, ContextReducer (cart)
        ├── screens/        # Home, Login, Signup, Cart, AuthLayout
        └── Modal.js
```

## Getting started

### Prerequisites

- Node.js 18 or later and npm
- A MongoDB database (local `mongod` or MongoDB Atlas)

### Backend

```bash
cd backend
cp .env.example .env     # then edit the values
npm install
npm run seed             # optional: load the sample menu (replaces existing menu data)
npm run dev              # or: npm start — runs on http://localhost:5000
```

The server exits with a clear message if `MONGO_URI` or `JWT_SECRET` is missing.

### Frontend

```bash
cd frontend
npm install
npm start                # http://localhost:3000
```

In development the CRA proxy forwards `/api/*` to `http://localhost:5000`, so no frontend configuration is needed. For a production build, set `REACT_APP_API_URL` to the deployed API origin before `npm run build`.

Other scripts: `npm test` (Jest + Testing Library) and `npm run build`.

## Environment variables

Backend (`backend/.env`, see `backend/.env.example`):

| Variable      | Required | Description                                                     |
| ------------- | -------- | --------------------------------------------------------------- |
| `MONGO_URI`   | yes      | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/bitecloud` |
| `JWT_SECRET`  | yes      | Long random string used to sign login tokens                    |
| `PORT`        | no       | API port (default `5000`)                                       |
| `HOST`        | no       | Bind address (default `127.0.0.1`; set `0.0.0.0` on Render or similar hosts) |
| `CORS_ORIGIN` | no       | Comma-separated allowed browser origins (default `http://localhost:3000`) |

Frontend (`frontend/.env`, see `frontend/.env.example`):

| Variable            | Required        | Description                                         |
| ------------------- | --------------- | --------------------------------------------------- |
| `REACT_APP_API_URL` | production only | Backend origin, e.g. `https://your-api.example.com` |

## API

| Method   | Path              | Purpose                                                   |
| -------- | ----------------- | --------------------------------------------------------- |
| POST     | `/api/createUser` | Register a user (`name`, `email`, `password`, `location`) |
| POST     | `/api/loginuser`  | Log in and return `authToken` (JWT)                       |
| GET/POST | `/api/foodData`   | Return `[foodItems, foodCategories]`                      |

## Known limitations

- Checkout and order history are not implemented. The cart lives in browser memory and is cleared on reload.
- The JWT is stored in `localStorage` and is not yet required by any API route.
- Dish images are hot-linked from Unsplash, iStock and Pixabay. One sample image no longer loads and shows a placeholder.
- `npm audit` still reports issues in Create React App's build tooling (`react-scripts` 5) that can only be fixed with a breaking upgrade.


## Hardening, testing and operations

The backend is split into `app.js` (the Express application) and `index.js`
(connect, bind, shut down), so tests can drive the app on an ephemeral loopback
port instead of the real one.

Fixed in the process:

- **No 404 handler and no error handler.** An unknown path and a malformed JSON
  body both produced Express's default HTML error page, from an API that returns
  JSON everywhere else. Both now return JSON, and a malformed body is a 400.
- **`express.json()` had no size limit**, so one request could stream an
  arbitrarily large body into memory. Capped at 100 kB, with a 413 when exceeded.
- **`app.disable('x-powered-by')` was missing**, so responses advertised Express.
- **`mongoDB().then(...)` had no `.catch()`**, so any startup error other than
  the one `db.js` handles itself would have been a silent unhandled rejection.

Added:

- **helmet** with a deny-all CSP (this is a JSON API; nothing is ever loaded
  from it as a subresource), `nosniff` and `no-referrer`.
- **Rate limiting**: a global ceiling, plus a tighter limiter on the two
  credential routes keyed on IP **plus the submitted email**, so one attacker
  behind a shared address cannot lock out everyone else. Successes count as well
  as failures, so a valid login cannot refill the budget. The public menu route
  is deliberately *not* behind the auth limiter — there is a test for that.
  `trust proxy` is set to exactly one hop, so `X-Forwarded-For` cannot be
  spoofed to bypass the limits.
- **Split health probes.** `GET /api/health` is liveness and never touches
  Mongo, so a database blip cannot cause a restart loop. `GET /api/health/ready`
  reports Mongoose's connection state and answers 503 with `Retry-After`.
- **Graceful shutdown** on SIGTERM/SIGINT that drains requests then closes Mongo.

### Tests

```bash
cd backend
npm test              # 13 tests, no database needed
npm run test:coverage
```

They cover the liveness/readiness split, the security headers, the JSON 404 and
400 paths, the 413 on an oversized body, full validation on register and login,
the auth limiter firing and keying per email, and that the public menu stays
reachable while the credential routes are limited.

### Continuous integration

| Job | What it proves |
| --- | --- |
| `backend` (Node 20, 22) | The 13-test suite, with coverage on 20 |
| `integration` | Against MongoDB 7: reads `ss -ltn` to confirm no `0.0.0.0` listener by default, readiness turns green, the menu seeds and serves anonymously, register/login round-trip, no password hash in any response, clean `SIGTERM`, and `HOST=0.0.0.0` still honoured |
| `frontend` | Jest + Testing Library tests and a production build |
| `docker` | The image builds and refuses to start with no configuration |

CodeQL runs weekly and on every push; Dependabot groups weekly patch/minor
bumps per package.

### Docker

```bash
printf 'MONGO_PASSWORD=%s\nJWT_SECRET=%s\n' \
  "$(openssl rand -hex 16)" "$(openssl rand -hex 32)" > .env

docker compose up --build
docker compose exec api node seed.js   # load the menu
```

MongoDB and the API both publish to `127.0.0.1` only, so neither is reachable
from your network, and Compose fails fast with a named error if either variable
is missing.

### Known limitations

- Rate limit counters live in process memory, so the ceilings are per instance.
  Scaling past one would need a shared store (Redis).
- The cart is client-side only; there is no order persistence or checkout.
