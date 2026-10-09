import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { getOrder, cancelOrder } from "../../services/api/orders";

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

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [justPlaced] = useState(location.state?.success === true);

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm("Annuler cette commande ?")) return;
    setCancelling(true);

    try {
      const res = await cancelOrder(id);
      setOrder(res);
    } catch (err) {
      alert(err.response?.data?.message || "Impossible d'annuler.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  if (!order) return <p className="p-6">Commande introuvable.</p>;

  const canCancel = ["pending", "processing"].includes(order.status);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {justPlaced && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6 font-semibold">
          ✓ Commande {order.order_number} confirmée avec succès !
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <Link
            to="/orders"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Retour à mes commandes
          </Link>
          <h1 className="text-3xl font-bold mt-1">
            Commande {order.order_number}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`${
              STATUS_COLORS[order.status] || "bg-gray-500"
            } text-white px-4 py-1.5 rounded-full font-medium`}
          >
            {STATUS_LABELS[order.status] || order.status}
          </span>

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded font-medium"
            >
              {cancelling ? "Annulation..." : "Annuler la commande"}
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ITEMS */}
        <div className="lg:col-span-2 bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Articles</h2>

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
                    {!item.product_id && " (produit supprimé)"}
                  </p>
                </div>
                <span className="font-semibold">
                  {parseFloat(item.subtotal).toFixed(2)} TND
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Résumé</h2>

            <div className="space-y-2">
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
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>{parseFloat(order.total).toFixed(2)} TND</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t text-sm space-y-1">
              <div className="flex justify-between">
                <span>Paiement</span>
                <span>
                  {order.payment_method === "cash_on_delivery"
                    ? "À la livraison"
                    : order.payment_method === "card"
                      ? "Carte bancaire"
                      : "Virement"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Statut paiement</span>
                <span>{order.payment_status === "paid" ? "Payé" : "Non payé"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Livraison</h2>

            <p className="font-semibold">{order.shipping_name}</p>
            <p className="text-gray-600">{order.shipping_phone}</p>
            <p className="text-gray-600 mt-2">
              {order.shipping_address}
            </p>
            <p className="text-gray-600">
              {order.shipping_city}
              {order.shipping_postal_code && `, ${order.shipping_postal_code}`}
            </p>
            <p className="text-gray-600">{order.shipping_country}</p>

            {order.notes && (
              <p className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                <strong>Note :</strong> {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;