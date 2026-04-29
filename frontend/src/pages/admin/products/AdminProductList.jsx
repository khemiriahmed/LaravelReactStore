import { useState } from "react";
import { useProducts } from "../../../context/ProductContext";
import { Link } from "react-router-dom";
import ProductSidebar from "../../../components/admin/ProductSidebar";
import ConfirmModal from "../../../components/ui/ConfirmModal";

function AdminProductList() {
  const { products, meta, fetchProducts, removeProduct } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] = useState("view");

  // =========================
  // DELETE
  // =========================
  const confirmDelete = async () => {
    await removeProduct(deleteId);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  // =========================
  // SIDEBAR
  // =========================
  const openSidebar = (product, type) => {
    setSelectedProduct(product);
    setMode(type);
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // =========================
  // STOCK BADGE
  // =========================
  const getStockBadge = (qty) => {
    if (qty <= 5)
      return { label: "LOW", color: "bg-red-500" };
    if (qty <= 20)
      return { label: "MEDIUM", color: "bg-yellow-500" };
    return { label: "HIGH", color: "bg-green-500" };
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          to="/admin/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Image</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">SKU</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {products.map((p, index) => {
              const badge = getStockBadge(p.quantity);

              return (
                <tr
                  key={p.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >

                  {/* ID */}
                  <td className="p-3 text-center">{p.id}</td>

                  {/* IMAGE */}
                  <td className="p-3 text-center">
                   {p.images[0].image_path && (
              <img height="50" width="50"
                src={p.images[0].image_path}
                className=" m-auto object-cover mb-3 rounded"
              />
            )}
                  </td>

                  {/* NAME */}
                  <td className="p-3 text-center font-medium">{p.name}</td>

                  {/* SKU */}
                  <td className="p-3 text-center text-gray-500">{p.sku}</td>

                  {/* PRICE */}
                  <td className="p-3 text-center text-blue-600 font-semibold">
                    {p.price} TND
                  </td>

                  {/* STOCK BADGE */}
                  <td className="p-3 text-center">
                    <span
                      className={`${badge.color} text-white px-2 py-1 text-xs rounded`}
                    >
                      {badge.label} ({p.quantity})
                    </span>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-3 text-center">
                    {p.category?.name || p.category_id}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-center space-x-2">

                    <button
                      onClick={() => openSidebar(p, "view")}
                      className="text-green-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => openSidebar(p, "edit")}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(p.id);
                        setSelectedProduct(p);
                        setIsModalOpen(true);
                      }}
                      className="text-red-500"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={meta.current_page === 1}
          onClick={() => fetchProducts(meta.current_page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        {[...Array(meta.last_page || 1)].map((_, i) => (
          <button
            key={i}
            onClick={() => fetchProducts(i + 1)}
            className={`px-3 py-1 border rounded ${
              meta.current_page === i + 1
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={meta.current_page === meta.last_page}
          onClick={() => fetchProducts(meta.current_page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* SIDEBAR */}
      {selectedProduct && (
        <ProductSidebar
          product={selectedProduct}
          isOpen={isOpen}
          onClose={closeSidebar}
          mode={mode}
          onUpdated={fetchProducts}
        />
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}" ?`}
        product={selectedProduct}
      />
    </div>
  );
}

export default AdminProductList;