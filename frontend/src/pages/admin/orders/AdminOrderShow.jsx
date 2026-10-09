import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getAdminOrder,
  updateOrderStatus,
} from "../../../services/api/orders";

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

function AdminOrderShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    getAdminOrder(id)
      .then((res) => {
setOrder(res);
      setStatus(res.status);
      setPaymentStatus(res.payment_status);
    })
    .catch(() => navigate("/admin/orders"))
    .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await updateOrderStatus(id, {
        status,
        payment_status: paymentStatus,
      });
      setOrder(res);
    } catch {
      alert("Mise à jour impossible.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (!order) return <p>Commande introuvable.</p>;

  return (
    <div className="max-w-5xl">
      <Link to="/admin/orders" className="text-blue-600 hover:underline text-sm">
        ← Retour aux commandes
      </Link>

      <h1 className="text-2xl font-bold mt-1 mb-6">Commande {order.order_number}</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ITEMS */}
        <div className="lg:col-span-2 bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-4">Articles</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={
                    item.product_image ||
                    "https://via.placeholder.com/640x480?text=No+Image"
                  }
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {parseFloat(item.product_price).toFixed(2)} TND
                  </p>
                </div>
                <span className="font-semibold">
                  {parseFloat(item.subtotal).toFixed(2)} TND
                </span>
              </div>
            ))}
          </div>

          {/* CUSTOMER */}
          <div className="border-t mt-6 pt-6">
            <h2 className="text-lg font-bold mb-3">Client</h2>
            <p className="font-semibold">{order.user?.name}</p>
            <p className="text-gray-600">{order.user?.email}</p>
            <p className="text-gray-600">{order.user?.phone}</p>
          </div>
        </div>

        {/* SIDE */}
        <div className="space-y-6">
          {/* STATUS */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-4">Statut</h2>

            <label className="block text-sm mb-1">Commande</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Paiement</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="unpaid">Non payé</option>
              <option value="paid">Payé</option>
              <option value="refunded">Remboursé</option>
            </select>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>

            <div className="mt-4">
              <span
                className={`${STATUS_COLORS[order.status] || "bg-gray-500"} text-white px-3 py-1 rounded-full text-sm`}
              >
                Actuel : {order.status}
              </span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-4">Résumé</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{parseFloat(order.subtotal).toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>
                  {order.shipping_cost > 0
                    ? `${parseFloat(order.shipping_cost).toFixed(2)} TND`
                    : "Gratuite"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>{parseFloat(order.total).toFixed(2)} TND</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Méthode</span>
                <span>
                  {order.payment_method === "cash_on_delivery"
                    ? "À la livraison"
                    : order.payment_method === "card"
                      ? "Carte"
                      : "Virement"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Créée le</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* SHIPPING */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-3">Livraison</h2>
            <p className="font-semibold">{order.shipping_name}</p>
            <p className="text-gray-600">{order.shipping_phone}</p>
            <p className="text-gray-600 mt-2">
              {order.shipping_address}, {order.shipping_city}
              {order.shipping_postal_code && ` ${order.shipping_postal_code}`}
            </p>
            <p className="text-gray-600">{order.shipping_country}</p>
            {order.notes && (
              <p className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
                <strong>Note :</strong> {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderShow;