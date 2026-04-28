import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../services/api/product";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const res = await getProduct(id);
    setProduct(res.data);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <img src={product.images?.[0]?.image_path} />

      <h1 className="text-2xl font-bold">{product.name}</h1>

      <p>{product.description}</p>

      <p className="text-blue-600">{product.price} TND</p>
    </div>
  );
}

export default ProductDetails;