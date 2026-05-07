import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD CART
  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ADD
  const addItem = async (productId, quantity = 1) => {
    const data = await addToCart({
      product_id: productId,
      quantity,
    });

    setCart(data);
  };

  // UPDATE
  const updateItem = async (id, quantity) => {
    const data = await updateCartItem(id, quantity);
    setCart(data);
  };

  // REMOVE
  const removeItem = async (id) => {
    const data = await removeCartItem(id);
    setCart(data);
  };

  // CLEAR
  const clear = async () => {
    const data = await clearCart();
    setCart(data);
  };

  // TOTAL PRICE
  const totalPrice =
    cart?.items?.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        clear,
        totalPrice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);