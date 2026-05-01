import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../services/api/category";

function AdminCategoryCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    is_active: 1,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await createCategory(form);

      // redirect vers list
      navigate("/admin/categories");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

      <h1 className="text-xl font-bold mb-6">
        ➕ Create Category
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name[0]}</p>
          )}
        </div>

        {/* SLUG */}
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.slug && (
            <p className="text-red-500 text-sm">{errors.slug[0]}</p>
          )}
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active === 1}
            onChange={handleChange}
          />
          <label>Active</label>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Category"}
        </button>

      </form>
    </div>
  );
}

export default AdminCategoryCreate;