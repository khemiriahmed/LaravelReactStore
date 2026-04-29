import { useEffect, useState } from "react";
import { useCategories } from "../../context/CategoryContext";

function CategorySidebar({ category, isOpen, onClose, mode, onUpdated }) {
  const { editCategory } = useCategories();

  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setForm({ name: category.name || "" });
    }
  }, [category]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("_method", "PUT");

      await editCategory(category.id, formData);

      onUpdated();
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    }
  };

  if (!category) return null;

  return (
    <div className={`fixed inset-0 z-50 flex ${isOpen ? "" : "pointer-events-none"}`}>

      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/40 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* sidebar */}
      <div
        className={`ml-auto w-full max-w-md bg-white p-6 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={onClose}>✖</button>

        {mode === "view" && (
          <>
            <h2 className="text-xl font-bold">{category.name}</h2>
            <p>ID: {category.id}</p>
            <p>Slug: {category.slug}</p>
          </>
        )}

        {mode === "edit" && (
          <>
            <h2 className="font-bold mb-4">Edit Category</h2>

            <input
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              className="border p-2 w-full"
            />

            {errors.name && <p className="text-red-500">{errors.name[0]}</p>}

            <button onClick={handleUpdate} className="bg-blue-600 text-white mt-4 p-2 w-full">
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CategorySidebar;