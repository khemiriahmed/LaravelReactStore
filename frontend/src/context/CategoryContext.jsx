import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api/category";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await api.getCategories();
    setCategories(res.data.data || res.data);
  };

  const addCategory = async (data) => {
    await api.createCategory(data);
    fetchCategories();
  };

  const editCategory = async (id, data) => {
    await api.updateCategory(id, data);
    fetchCategories();
  };

  const removeCategory = async (id) => {
    await api.deleteCategory(id);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, fetchCategories, addCategory, editCategory, removeCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);