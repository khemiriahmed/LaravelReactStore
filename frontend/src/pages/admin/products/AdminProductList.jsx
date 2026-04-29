import { useMemo, useState } from "react";
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

  // 🔎 SEARCH + FILTER + SORT
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState("none");

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
    if (qty <= 5) return { label: "LOW", color: "bg-red-500" };
    if (qty <= 20) return { label: "MEDIUM", color: "bg-yellow-500" };
    return { label: "HIGH", color: "bg-green-500" };
  };

  // =========================
  // FILTER + SEARCH + SORT
  // =========================
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // SEARCH
    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // STOCK FILTER
    if (stockFilter === "low")
      data = data.filter((p) => p.quantity <= 5);

    if (stockFilter === "medium")
      data = data.filter((p) => p.quantity > 5 && p.quantity <= 20);

    if (stockFilter === "high")
      data = data.filter((p) => p.quantity > 20);

    // SORT PRICE
    if (sortPrice === "asc")
      data.sort((a, b) => a.price - b.price);

    if (sortPrice === "desc")
      data.sort((a, b) => b.price - a.price);

    return data;
  }, [products, search, stockFilter, sortPrice]);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          to="/admin/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* 🔥 SEARCH + FILTER + SORT */}
      <div className="flex gap-3 mb-4 flex-wrap">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        {/* STOCK FILTER */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Stock</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* PRICE SORT */}
        <select
          value={sortPrice}
          onChange={(e) => setSortPrice(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="none">Sort Price</option>
          <option value="asc">Price ↑</option>
          <option value="desc">Price ↓</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
               <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Image</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">SKU</th>
              <th className="p-3 ">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const badge = getStockBadge(p.quantity);

                return (
                  <tr key={p.id} className="border-t">

                    {/* IMAGE SAFE */}
                    <td className="p-3 text-center">{p.id}</td>
                    <td className="p-3 text-center">
                      {p.images?.length > 0 ? (
                        <img
                          src={p.images[0]?.image_path}
                          className="m-auto w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-3 text-center font-medium">{p.name}</td>

                    <td className="p-3 text-center text-blue-600">
                      {p.price} TND
                    </td>

                    <td className="p-3 text-center ">
                      <span
                        className={`${badge.color} text-white px-2 py-1 text-xs rounded`}
                      >
                        {badge.label} ({p.quantity})
                      </span>
                    </td>

                    <td className="p-3 text-center text-gray-500">{p.sku}</td>

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
              })
            )}
          </tbody>

        </table>
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
        message={`Delete "${selectedProduct?.name}" ?`}
      />
    </div>
  );
}

export default AdminProductList;