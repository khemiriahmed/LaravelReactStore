# 🚀 LaravelReactStore  – Full Stack E-commerce Platform

A modern and scalable **E-commerce web application** built with **Laravel API** and **React**.
This project demonstrates a real-world full stack architecture with authentication, product management, shopping cart, and order processing.

---

## 🚧 Project Status

✅ **Complete** – production-ready implementation including a full admin back-office, checkout flow, and order management.

##  Tech Stack

### 🔹 Backend

* Laravel (REST API)
* Laravel Sanctum (Authentication)
* MySQL

### 🔹 Frontend

* React (Vite)
* Axios
* React Router
* Tailwind CSS

---

##  Features

###  Authentication

* Register / Login
* Secure API authentication (Sanctum, bearer tokens)
* Role-based access (Admin / User) with `IsAdmin` middleware
* Persistent session + cart sync

###  Product Management

* Product listing with search, category filter, and sorting
* Multi-image gallery (primary + additional images)
* Product details page with quantity selector and stock badges

###  Shopping Cart

* Add / remove products
* Update quantities
* Badge item count in navbar

###  Orders & Checkout

* Place orders (shipping info + cash on delivery / card)
* Automatic `ORD-XXXX` order number and item snapshots
* Stock decrement on order, automatic restore on cancellation
* Order history & details (client + admin)

###  Admin Dashboard

* Dashboard with KPIs (revenue, orders, low stock, top products)
* Manage products (CRUD) and categories
* Manage orders (status + payment status) and users
* Protected routes (`/admin/*`) with role guard

---

##  Project Structure

```bash
LaravelReactStore /
│
├── backend/   # Laravel API
└── frontend/  # React App
```

---

##  Installation

### 🔹 Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env
php artisan migrate
php artisan db:seed            # creates demo data + admin account
php artisan storage:link       # serve product images
php artisan serve
```

**Demo admin account** (added by the seeder):

| Email          | Password | Role  |
| -------------- | -------- | ----- |
| admin@store.com | password | admin |

---

### 🔹 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:8000`.
Make sure `VITE_BACKEND_URL` points to the API in `frontend/.env`.

##  API Authentication

This project uses **Laravel Sanctum** for secure authentication.
Make sure to configure CORS and credentials correctly.

---

##  Author

**Ahmed Khemiri**
Full Stack Developer (Laravel & React)

---

##  Notes

This project is built as a **portfolio project** to demonstrate real-world development skills and best practices.

---

