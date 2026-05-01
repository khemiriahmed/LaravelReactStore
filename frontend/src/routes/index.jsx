import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// USER
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";

// FRONT PRODUCTS
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/ProductDetails";

// ADMIN PRODUCTS
import AdminProductList from "../pages/admin/products/AdminProductList";
import AdminProductCreate from "../pages/admin/products/AdminProductCreate";
import AdminProductShow from "../pages/admin/products/AdminProductShow";

// 🆕 ADMIN CATEGORIES
import AdminCategoryList from "../pages/admin/categories/AdminCategoryList";
import AdminCategoryCreate from "../pages/admin/categories/AdminCategoryCreate";

// 🆕 ADMIN DASHBOARD
//import AdminDashboard from "../pages/admin/AdminDashboard";

// simple pages
const Home = () => <h1 className="text-center mt-10 text-2xl">Home</h1>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },

      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },

      // =========================
      // 🔐 ADMIN ROUTES (NEW STRUCTURE)
      // =========================
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),

        children: [
          // {
          //   path: "dashboard",
          //   element: <AdminDashboard />,
          // },

          {
            path: "products",
            element: <AdminProductList />,
          },
          {
            path: "products/create",
            element: <AdminProductCreate />,
          },
          {
            path: "products/:id",
            element: <AdminProductShow />,
          },

          //  CATEGORIES
          {
            path: "categories",
            element: <AdminCategoryList />,
          },

          {
            path: "categories/create",
            element: <AdminCategoryCreate />,
          },
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
]);
