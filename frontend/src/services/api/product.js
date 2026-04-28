import api from "../../api/axios";

//  get products


export const createProduct = (data) => {
  return api.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const updateProduct = (id, data) => {
  return api.post(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = (params = {}) => {
  return api.get("/products", { params });
};

//  get single product
export const getProduct = (id) => {
  return api.get(`/products/${id}`);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};
