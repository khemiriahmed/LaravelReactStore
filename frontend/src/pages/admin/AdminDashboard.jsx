import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../../services/api/orders";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;

  const cards = [
    { label: "Utilisateurs", value: stats?.users, color: "bg-blue-500", link: "/admin/users" },
    { label: "Produits", value: stats?.products, color: "bg-indigo-500", link: "/admin/products" },
    { label: "Catégories", value: stats?.categories, color: "bg-violet-500", link: "/admin/categories" },
    { label: "Commandes", value: stats?.orders, color: "bg-purple-500", link: "/admin/orders" },
    { label: "En attente", value: stats?.orders_pending, color: "bg-amber-500", link: "/admin/orders" },
    { label: "Chiffre d'affaires", value: `${stats?.revenue} TND`, color: "bg-emerald-500" },
    { label: "Stock faible", value: stats?.low_stock, color: "bg-red-500", link: "/admin/products" },
    { label: "Produits inactifs", value: stats?.inactive_products, color: "bg-gray-500", link: "/admin/products" },
  ];

  const orderStatus = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-indigo-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link || "#"}
            className={`${card.color} text-white rounded-xl p-5 shadow hover:opacity-90 transition`}
          >
            <p className="text-sm opacity-90">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Dernières commandes</h2>
            <Link to="/admin/orders" className="text-blue-600 text-sm">
              Tout voir →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recent_orders?.length === 0 && (
              <p className="text-gray-500 text-sm">Aucune commande.</p>
            )}

            {stats?.recent_orders?.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm">{order.order_number}</p>
                  <p className="text-xs text-gray-500">
                    {order.user?.name} · {order.total} TND
                  </p>
                </div>
                <span
                  className={`${
                    orderStatus[order.status] || "bg-gray-500"
                  } text-white text-xs px-2 py-1 rounded`}
                >
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Stock faible</h2>
            <Link to="/admin/products" className="text-blue-600 text-sm">
              Gérer →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.low_stock_products?.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun produit en rupture.</p>
            )}

            {stats?.low_stock_products?.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-2"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {product.category?.name} · {product.price} TND
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded text-white ${
                    product.quantity <= 5 ? "bg-red-500" : "bg-amber-500"
                  }`}
                >
                  {product.quantity} restant
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;