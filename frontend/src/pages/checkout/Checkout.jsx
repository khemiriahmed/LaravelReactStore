import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/api/orders";

function Checkout() {
  const navigate = useNavigate();
  const { cart, loading, totalPrice, fetchCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    shipping_name: user?.name || "",
    shipping_phone: user?.phone || "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    shipping_country: "Tunisia",
    payment_method: "cash_on_delivery",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setErrors({});

    try {
      const order = await createOrder(form);
      await fetchCart();

      // clear local form
      navigate(`/orders/${order.id}`, {
        state: { success: true },
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ general: [err.response.data.message] });
      } else {
        setErrors({ general: ["Une erreur est survenue. Réessayez."] });
      }
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  if (!cart?.items?.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center bg-white rounded shadow mt-10">
        <p className="text-gray-500 mb-4">Votre panier est vide.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded">
          Voir les produits
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded mb-6">
          {errors.general[0]}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* SHIPPING */}
          <div className="bg-white rounded shadow p-6 space-y-4">
            <h2 className="text-xl font-bold">Adresse de livraison</h2>

            <div>
              <input
                name="shipping_name"
                placeholder="Nom complet"
                value={form.shipping_name}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.shipping_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shipping_name[0]}
                </p>
              )}
            </div>

            <div>
              <input
                name="shipping_phone"
                placeholder="Téléphone"
                value={form.shipping_phone}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.shipping_phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shipping_phone[0]}
                </p>
              )}
            </div>

            <div>
              <input
                name="shipping_address"
                placeholder="Adresse"
                value={form.shipping_address}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.shipping_address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shipping_address[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="shipping_city"
                  placeholder="Ville"
                  value={form.shipping_city}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.shipping_city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shipping_city[0]}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="shipping_postal_code"
                  placeholder="Code postal"
                  value={form.shipping_postal_code}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded shadow p-6 space-y-4">
            <h2 className="text-xl font-bold">Paiement</h2>

            {[
              { value: "cash_on_delivery", label: "💵 Paiement à la livraison" },
              { value: "card", label: "💳 Carte bancaire" },
              { value: "bank_transfer", label: "🏦 Virement bancaire" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 border rounded p-3 cursor-pointer ${
                  form.payment_method === opt.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={opt.value}
                  checked={form.payment_method === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}

            {errors.payment_method && (
              <p className="text-red-500 text-sm">
                {errors.payment_method[0]}
              </p>
            )}
          </div>

          {/* NOTES */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Notes (optionnel)</h2>
            <textarea
              name="notes"
              placeholder="Instructions de livraison..."
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className={inputClass}
            />
          </div>
        </form>

        {/* SUMMARY */}
        <div className="bg-white rounded shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Votre commande</h2>

          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={
                    item.product.images?.[0]?.image_path ||
                    "https://via.placeholder.com/640x480?text=No+Image"
                  }
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {item.product.price} TND
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {(item.quantity * item.product.price).toFixed(2)} TND
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{totalPrice.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} TND</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={placing}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded font-semibold"
          >
            {placing ? "Validation..." : "Confirmer la commande"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;