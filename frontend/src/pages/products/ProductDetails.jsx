import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct } from "../../services/api/product";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    await addItem(product.id, quantity);
    navigate("/cart");
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  if (!product) return <p className="p-6">Produit introuvable.</p>;

  const image =
    product.images?.[0]?.image_path ||
    "https://via.placeholder.com/640x480?text=No+Image";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Retour aux produits
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div>
          <img
            src={image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow"
          />

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={img.image_path}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category?.name}
          </p>

          <h1 className="text-3xl font-bold mt-1 mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <p className="text-3xl font-bold text-blue-600">
              {product.price} TND
            </p>
            {product.compare_price && (
              <p className="text-gray-400 line-through">
                {product.compare_price} TND
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {product.description}
          </p>

          <p className="text-sm mb-4">
            SKU: <span className="font-medium">{product.sku}</span>
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.quantity, quantity + 1))
                }
                className="px-3 py-2"
              >
                +
              </button>
            </div>

            <span className="text-sm text-gray-500">
              {product.quantity} en stock
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.quantity <= 0}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {product.quantity <= 0 ? "Rupture de stock" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;