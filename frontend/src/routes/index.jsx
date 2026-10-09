import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// PAGES
import Home from "../pages/Home";

// USER
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";

// CART & CHECKOUT
import CartPage from "../pages/cart/CartPage";
import Checkout from "../pages/checkout/Checkout";

// ORDERS
import OrdersList from "../pages/orders/OrdersList";
import OrderDetails from "../pages/orders/OrderDetails";

// FRONT PRODUCTS
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/ProductDetails";

// ADMIN
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/orders/AdminOrders";
import AdminOrderShow from "../pages/admin/orders/AdminOrderShow";
import AdminUsers from "../pages/admin/users/AdminUsers";

// ADMIN PRODUCTS
import AdminProductList from "../pages/admin/products/AdminProductList";
import AdminProductCreate from "../pages/admin/products/AdminProductCreate";
import AdminProductShow from "../pages/admin/products/AdminProductShow";

// ADMIN CATEGORIES
import AdminCategoryList from "../pages/admin/categories/AdminCategoryList";
import AdminCategoryCreate from "../pages/admin/categories/AdminCategoryCreate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: "products", element: <ProductList /> },
      { path: "products/:id", element: <ProductDetails /> },

      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },

      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersList />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },

      // =========================
      // 🔐 ADMIN ROUTES
      // =========================
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },

          { path: "products", element: <AdminProductList /> },
          { path: "products/create", element: <AdminProductCreate /> },
          { path: "products/:id", element: <AdminProductShow /> },

          { path: "categories", element: <AdminCategoryList /> },
          { path: "categories/create", element: <AdminCategoryCreate /> },

          { path: "orders", element: <AdminOrders /> },
          { path: "orders/:id", element: <AdminOrderShow /> },

          { path: "users", element: <AdminUsers /> },
        ],
      },
    ],
  },

  // AUTH (no layout)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);