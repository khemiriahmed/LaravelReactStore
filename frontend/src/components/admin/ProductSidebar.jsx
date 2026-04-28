import { useEffect, useState } from "react";
import { updateProduct } from "../../services/api/product";

function ProductSidebar({ product, isOpen, onClose, mode = "view", onUpdated }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    await updateProduct(product.id, formData);

    onUpdated(); // refresh list
    onClose();
  };

  if (!product) return null;

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
        <button onClick={onClose} className="mb-4">✖</button>

        {/* VIEW MODE */}
        {mode === "view" && (
          <>
            <h2 className="text-xl font-bold mb-3">{product.name}</h2>

            {product.image && (
              <img src={product.image} className="w-full h-48 object-cover mb-3" />
            )}

            <p><strong>Price:</strong> {product.price}</p>
            <p><strong>Stock:</strong> {product.quantity}</p>
            <p className="mt-3 text-gray-600">{product.description}</p>
          </>
        )}

        {/* EDIT MODE */}
        {mode === "edit" && (
          <>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <div className="space-y-3">

              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="price"
                value={form.price || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="quantity"
                value={form.quantity || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <button
                onClick={handleUpdate}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Save Changes
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default ProductSidebar;