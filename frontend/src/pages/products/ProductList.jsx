import { useEffect, useState } from "react";
import { getProducts } from "../../services/api/product.js";
import ProductCard from "../../components/products/ProductCard.jsx";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data.data); // pagination
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
