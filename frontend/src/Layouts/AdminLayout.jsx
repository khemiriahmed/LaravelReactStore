import { Outlet, Link } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl mb-4">Admin</h2>

        <nav className="space-y-2">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/categories">Categories</Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;