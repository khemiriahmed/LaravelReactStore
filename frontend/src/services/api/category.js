import api from "../../api/axios";

export const getCategories = (params) =>
  api.get("/categories", { params });

export const createCategory = (data) =>
  api.post("/categories", data);

export const updateCategory = (id, data) =>
  api.post(`/categories/${id}`, data); // _method PUT

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);