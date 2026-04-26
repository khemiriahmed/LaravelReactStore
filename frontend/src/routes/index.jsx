import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";

// pages simples
const Home = () => <h1 className="text-center mt-10 text-2xl">Home 🏠</h1>;

const Dashboard = () => (
  <h1 className="text-center mt-10 text-2xl">Dashboard 🔐 (Protected)</h1>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },

  // pages sans navbar (auth)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
