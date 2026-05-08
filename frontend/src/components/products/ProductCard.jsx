import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg">
      <img
        src={product.images?.[0]?.image_path}
        alt={product.name}
        className="h-40 w-full object-cover"
      />

      <h2 className="font-bold mt-2">{product.name}</h2>

      <p className="text-blue-600 font-semibold">{product.price} TND</p>

      <Link to={`/products/${product.id}`} className="text-sm text-blue-500">
        View Details
      </Link>

      <button
        onClick={() => addItem(product.id)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add To Cart
      </button>
    </div>
  );
}

export default ProductCard;
