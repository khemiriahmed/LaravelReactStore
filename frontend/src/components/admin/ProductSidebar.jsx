import { useEffect, useState } from "react";
import { updateProduct } from "../../services/api/product";
import api from "../../api/axios";

function ProductSidebar({
  product,
  isOpen,
  onClose,
  mode = "view",
  onUpdated,
}) {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ load categories
  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  // ✅ INIT FORM
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
        description: product.description ?? "",
        sku: product.sku ?? "",
        category_id: product.category_id ?? "",
      });

      setPreview(product.image || null);
    }
  }, [product]);

  // scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      if (image) {
        formData.append("image", image);
      }

      formData.append("_method", "PUT");

      await updateProduct(product.id, formData);

      onUpdated();
      onClose();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;
console.log("PRODUCT:", product);
  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">

      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* sidebar */}
      <div
        className={`ml-auto w-full max-w-md h-full bg-white shadow-xl p-6 overflow-y-auto
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        pointer-events-auto`}
      >
        <button onClick={onClose} className="mb-4 text-gray-500">
          ✖ Close
        </button>

        {/* ================= VIEW MODE ================= */}
        {mode === "view" && (
          <>
            <h2 className="text-xl font-bold mb-3">{product.name} hhhhh</h2>

            {product.images[0].image_path && (
              <img
                src={product.images[0].image_path}
                className="w-full h-48 object-cover mb-3 rounded"
              />
            )}

            

            <div className="space-y-2 text-sm">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Price:</strong> {product.price}</p>
              <p><strong>Stock:</strong> {product.quantity}</p>

              <p>
                <strong>Category:</strong>{" "}
                {product.category?.name || "—"}
              </p>
            </div>

            <p className="mt-4 text-gray-600">
              {product.description}
            </p>
          </>
        )}

        {/* ================= EDIT MODE ================= */}
        {mode === "edit" && (
          <>
            <h2 className="text-xl font-bold mb-4">Edit Product ✏️</h2>

            <div className="space-y-4">

              {/* NAME */}
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm mb-1">SKU</label>
                <input
                  name="sku"
                  value={form.sku || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {errors.sku && <p className="text-red-500">{errors.sku[0]}</p>}
              </div>

              {/* PRICE */}
              <div>
                <label className="block text-sm mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* QUANTITY */}
              <div>
                <label className="block text-sm mb-1">Stock</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  name="category_id"
                  value={form.category_id || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-sm mb-1">Image</label>

                {preview && (
                  <img
                    src={preview}
                    className="w-full h-40 object-cover mb-2 rounded"
                  />
                )}

                <input type="file" onChange={handleImageChange} />
              </div>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductSidebar;