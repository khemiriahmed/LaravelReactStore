import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders, updateOrderStatus } from "../../../services/api/orders";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "processing", label: "En traitement" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

const STATUS_COLORS = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-indigo-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const params = {
        status: status || undefined,
        search: search || undefined,
        per_page: 10,
      };

      const res = await getAdminOrders(page, params);
      setOrders(res.data);
      setMeta(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, { status: newStatus });
    fetchOrders();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="N° de commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-56"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Rechercher
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchOrders}
          className="border px-4 py-2 rounded hover:bg-gray-50"
        >
          Actualiser
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">N°</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Articles</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Paiement</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 font-mono">{order.order_number}</td>
                  <td className="p-3">{order.user?.name}</td>
                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {order.items?.reduce((a, b) => a + b.quantity, 0)}
                  </td>
                  <td className="p-3 font-semibold">{order.total} TND</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded text-white ${
                        order.payment_status === "paid"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Payé" : "Non payé"}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`${STATUS_COLORS[order.status] || "bg-gray-500"} text-white text-xs px-2 py-1 rounded cursor-pointer`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value} className="text-black bg-white">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border px-4 py-2 rounded disabled:opacity-40"
          >
            ←
          </button>
          <span className="px-4 py-2">
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={page >= meta.last_page}
            className="border px-4 py-2 rounded disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;