import api from "./axios";

export const register = (data) => api.post("/register", data);
export const login = (data) => api.post("/login", data);
export const getUser = () => api.get("/user");
export const logout = () => api.post("/logout");