# 🚀 LaravelReactStore  – Full Stack E-commerce Platform

A modern and scalable **E-commerce web application** built with **Laravel API** and **React**.
This project demonstrates a real-world full stack architecture with authentication, product management, shopping cart, and order processing.

---

## 🧠 Tech Stack

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

## ✨ Features

### 👤 Authentication

* Register / Login
* Secure API authentication (Sanctum)
* Role-based access (Admin / User)

### 🛍️ Product Management

* Product listing
* Categories filtering
* Product details page

### 🛒 Shopping Cart

* Add / remove products
* Update quantities

### 💳 Orders & Checkout

* Place orders
* Order history
* Shipping information

### 🧑‍💼 Admin Dashboard

* Manage products (CRUD)
* Manage categories
* View customer orders

---

## 🧱 Project Structure

```bash
LaravelReactStore /
│
├── backend/   # Laravel API
└── frontend/  # React App
```

---

## ⚙️ Installation

### 🔹 Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env
php artisan migrate
php artisan serve
```

---

### 🔹 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 API Authentication

This project uses **Laravel Sanctum** for secure authentication.
Make sure to configure CORS and credentials correctly.


---

## 🧑‍💻 Author

**Ahmed Khemiri**
Full Stack Developer (Laravel & React)

---

## 📌 Notes

This project is built as a **portfolio project** to demonstrate real-world development skills and best practices.

---

