import api from "../../api/axios";

// GET CART
export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data.data;
};

// ADD ITEM
export const addToCart = async (data) => {
  const res = await api.post("/cart/items", data);
  return res.data.data;
};

// UPDATE ITEM
export const updateCartItem = async (id, quantity) => {
  const res = await api.put(`/cart/items/${id}`, {
    quantity,
  });

  return res.data.data;
};

// REMOVE ITEM
export const removeCartItem = async (id) => {
  const res = await api.delete(`/cart/items/${id}`);
  return res.data.data;
};

// CLEAR CART
export const clearCart = async () => {
  const res = await api.delete("/cart/clear");
  return res.data.data;
};