import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const image =
    product.images?.[0]?.image_path ||
    "https://via.placeholder.com/640x480?text=No+Image";

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col bg-white">
      <Link to={`/products/${product.id}`}>
        <img
          src={image}
          alt={product.name}
          className="h-44 w-full object-cover rounded"
        />
      </Link>

      <h2 className="font-bold mt-3 text-lg">{product.name}</h2>

      <p className="text-blue-600 font-semibold">{product.price} TND</p>

      {product.quantity <= 5 && (
        <p className="text-xs text-red-500 font-medium mt-1">
          Plus que {product.quantity} en stock
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <Link to={`/products/${product.id}`} className="text-sm text-blue-500">
          Voir détails
        </Link>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default ProductCard;