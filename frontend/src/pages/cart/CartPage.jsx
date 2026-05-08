import { useCart } from "../../context/CartContext";

function CartPage() {
  const { cart, loading, updateItem, removeItem, clear, totalPrice } =
    useCart();

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        {cart?.items?.length > 0 && (
          <button
            onClick={clear}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart?.items?.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center">
          <p className="text-gray-500">Your cart is empty</p>
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
                {/* IMAGE */}
                <img
                  src={item.product.images?.[0]?.image_path}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.product.name}</h2>

                  <p className="text-gray-500">{item.product.price} TND</p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 border rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {(item.quantity * item.product.price).toFixed(2)} TND
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{cart.items.reduce((a, b) => a + b.quantity, 0)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} TND</span>
            </div>

            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
