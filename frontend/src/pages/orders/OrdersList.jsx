import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/api/orders";

const STATUS_COLORS = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-indigo-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const STATUS_LABELS = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders(page)
      .then((res) => {
        setOrders(res.data);
        setMeta(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center">
          <p className="text-gray-500 mb-4">Aucune commande pour le moment.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded inline-block"
          >
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">N°</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Articles</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Paiement</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 font-mono">{order.order_number}</td>
                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {order.items?.reduce((a, b) => a + b.quantity, 0)}
                  </td>
                  <td className="p-3 font-semibold">{order.total} TND</td>
                  <td className="p-3 text-gray-600">
                    {order.payment_status === "paid" ? "Payée" : "À payer"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`${
                        STATUS_COLORS[order.status] || "bg-gray-500"
                      } text-white px-2 py-1 text-xs rounded`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default OrdersList;