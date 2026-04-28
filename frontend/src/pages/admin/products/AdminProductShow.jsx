import { useParams } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";

function AdminProductShow() {
  const { id } = useParams();
  const { products } = useProducts();

  const product = products.find((p) => p.id == id);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <p>Price: {product.price}</p>
      <p>Stock: {product.quantity}</p>

      {product.image && (
        <img src={product.image} className="w-40 mt-4" />
      )}
    </div>
  );
}

export default AdminProductShow;