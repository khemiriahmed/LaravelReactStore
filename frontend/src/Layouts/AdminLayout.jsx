import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Package, Folder } from "lucide-react";

function AdminLayout() {
  const { user, logout } = useAuth();

  const navItem =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-800";

  const activeItem =
    "bg-blue-600 text-white";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">

        {/* LOGO */}
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-wide">
            ⚡ Admin Panel
          </h2>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            📦 Products
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            🗂 Categories
          </NavLink>

        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800 text-sm">
          <p className="mb-2">👤 {user?.name}</p>
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        {/* <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.email}
            </span>

            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header> */}

        {/* PAGE CONTENT */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;