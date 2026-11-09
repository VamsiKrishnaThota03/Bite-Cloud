# Bite-Cloud

A MERN food ordering app: browse a categorized menu stored in MongoDB, search dishes, pick a size and quantity, and manage a cart.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)

## Overview

Bite-Cloud has two parts. `frontend/` is a React (Create React App) client, and `backend/` is an Express API backed by MongoDB. The home page loads food categories and food items from the API and groups the items by category. Users can sign up and log in, and logged-in users get a cart.

## Features

- Home page with an image carousel and a search box that filters dishes by name.
- Menu grouped by category (for example, Biryani/Rice), with each item's image, description and size options (such as half/full).
- Food cards with quantity and size selectors. The price updates as you change them.
- A cart (React Context + `useReducer`) in a modal: add items, remove items, and see the total price.
- Sign up and log in, with request validation (`express-validator`), bcrypt password hashing and a JWT stored in `localStorage`.
- A dark Bootstrap theme (`bootstrap-dark-5`).

The **Check Out** button and a "My Orders" view are not implemented yet. The cart lives only in browser memory.

## Tech stack

| Layer    | Technology                                                                   |
| -------- | ---------------------------------------------------------------------------- |
| Frontend | React 18, React Router 6, React Bootstrap, Bootstrap 5 / bootstrap-dark-5    |
| Backend  | Node.js, Express 4, express-validator, bcryptjs, jsonwebtoken, cors, nodemon |
| Database | MongoDB (Atlas or local) with Mongoose 7                                     |

## Project structure

```
Bite-Cloud/
├── backend/
│   ├── models/           # User, food_category, food_items schemas
│   ├── routes/
│   │   ├── CreateUser.js # sign up / log in
│   │   └── DisplayData.js# menu data
│   ├── db.js             # MongoDB connection
│   └── index.js          # Express entry point (port 5000)
└── frontend/
    ├── public/
    └── src/
        ├── components/   # Navbar, Card, Carousal, Footer, ContextReducer (cart)
        ├── screens/      # Home, Login, Signup, Cart
        └── Modal.js
```

## Getting started

### Prerequisites

- Node.js 16 or later and npm
- A MongoDB database (local or MongoDB Atlas) with `food_category` and `food-items` collections

### Backend

```bash
cd backend
npm install
npx nodemon index.js     # or: node index.js — runs on http://localhost:5000
```

The connection string and JWT secret are currently hard-coded. Set them to your own values, ideally from environment variables:

| Setting      | File                         | Example placeholder                                       |
| ------------ | ---------------------------- | --------------------------------------------------------- |
| `MONGO_URI`  | `backend/db.js`              | `mongodb+srv://<user>:<password>@<cluster>/<db>`          |
| `JWT_SECRET` | `backend/routes/CreateUser.js` | `<your-jwt-secret>`                                     |

### Frontend

```bash
cd frontend
npm install
npm start                # http://localhost:3000
```

The frontend calls the API at `http://localhost:5000`.

## API

| Method | Path              | Purpose                                                      |
| ------ | ----------------- | ------------------------------------------------------------ |
| POST   | `/api/createUser` | Register a user (`name`, `email`, `password`, `location`)    |
| POST   | `/api/loginuser`  | Log in and return `authToken` (JWT)                          |
| POST   | `/api/foodData`   | Return `[foodItems, foodCategories]`                         |
| GET    | `/foodCategory`   | Debug route that loads categories and logs them on the server (no response body) |
