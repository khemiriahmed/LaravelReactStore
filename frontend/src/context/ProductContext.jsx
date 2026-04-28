import { createContext, useContext, useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../services/api/product";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});

  const fetchProducts = async (page = 1) => {
    const res = await getProducts({ page });

    setProducts(res.data.data);
    setMeta(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    await deleteProduct(id);
    fetchProducts(meta.current_page); // refresh page
  };

  return (
    <ProductContext.Provider value={{ products, meta, fetchProducts, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);