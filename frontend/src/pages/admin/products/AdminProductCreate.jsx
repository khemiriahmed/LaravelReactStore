import { useEffect, useState } from "react";
import { createProduct } from "../../../services/api/product";
import api from "../../../api/axios";

function AdminProductCreate() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category_id: "",
    sku: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  //  load categories
  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await createProduct(formData);
      alert(" Product created");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Create Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          name="name"
          placeholder="Product name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name[0]}</p>}

        {/* Price */}
        <input
          name="price"
          placeholder="Price"
          type="number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
          {errors.price && <p className="text-red-500">{errors.price[0]}</p>}

        {/* Quantity */}
        <input
          name="quantity"
          placeholder="Stock"
          type="number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
          {errors.quantity && <p className="text-red-500">{errors.quantity[0]}</p>}

        {/* SKU */}
        <input
          name="sku"
          placeholder="SKU"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

          {errors.sku && <p className="text-red-500">{errors.sku[0]}</p>}

        {/* Category */}
        <select
          name="category_id"
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

        {errors.category_id && <p className="text-red-500">{errors.category_id[0]}</p>}
        

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
        

        {/* Image upload */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        

        {/* Submit */}
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Create Product
        </button>
      </form>
    </div>
  );
}

export default AdminProductCreate;