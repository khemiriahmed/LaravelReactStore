import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CartPage() {
  const { cart, loading, updateItem, removeItem, clear, totalPrice } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mon panier</h1>

        {cart?.items?.length > 0 && (
          <button
            onClick={clear}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Vider le panier
          </button>
        )}
      </div>

      {cart?.items?.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center">
          <p className="text-gray-500 mb-4">Votre panier est vide</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded inline-block"
          >
            Voir les produits
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded shadow p-4 flex gap-4 items-center"
              >
                <img
                  src={
                    item.product.images?.[0]?.image_path ||
                    "https://via.placeholder.com/640x480?text=No+Image"
                  }
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-semibold text-lg hover:text-blue-600"
                  >
                    {item.product.name}
                  </Link>

                  <p className="text-gray-500">{item.product.price} TND</p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    {(item.quantity * item.product.price).toFixed(2)} TND
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 mt-2 hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

            <div className="flex justify-between mb-2">
              <span>Articles</span>
              <span>{cart.items.reduce((a, b) => a + b.quantity, 0)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} TND</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
            >
              Passer au checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;