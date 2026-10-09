import api from "../../api/axios";

// =======================
// CUSTOMER ORDERS
// =======================

export const getOrders = async (page = 1) => {
  const res = await api.get("/orders", {
    params: { page },
  });
  return res.data;
};

export const getOrder = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data.data;
};

export const cancelOrder = async (id) => {
  const res = await api.post(`/orders/${id}/cancel`);
  return res.data.data;
};

// =======================
// ADMIN ORDERS
// =======================

export const getAdminOrders = async (page = 1, params = {}) => {
  const res = await api.get("/admin/orders", {
    params: { page, ...params },
  });
  return res.data;
};

export const getAdminOrder = async (id) => {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data.data;
};

export const updateOrderStatus = async (id, data) => {
  const res = await api.put(`/admin/orders/${id}`, data);
  return res.data.data;
};

// =======================
// ADMIN DASHBOARD
// =======================

export const getStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data.data;
};