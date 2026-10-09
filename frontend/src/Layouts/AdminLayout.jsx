import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItem =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-800";

  const activeItem = "bg-blue-600 text-white";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* LOGO */}
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-wide">⚡ Admin Panel</h2>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin"
            end
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
            📦 Produits
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            🗂 Catégories
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            🛒 Commandes
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            👥 Utilisateurs
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800 text-sm">
          <p className="mb-2">👤 {user?.name}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-700 hover:bg-gray-600 mb-2 py-2 rounded"
          >
            Voir le site
          </button>
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
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;