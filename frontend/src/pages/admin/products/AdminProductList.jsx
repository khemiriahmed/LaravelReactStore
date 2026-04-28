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
  const [loading, setLoading] = useState(false);
const [mode, setMode] = useState("view");
  const handleDelete = (id) => {
    if (window.confirm(" Delete this product?")) {
      removeProduct(id);
    }
  };

  const openSidebar = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);

    //⏱ attendre animation avant supprimer
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

const confirmDelete = async () => {
  setLoading(true);
  await removeProduct(deleteId);
  setLoading(false);
  closeModal();

  
};

const closeModal = () => {
  setIsModalOpen(false);
  setDeleteId(null);
};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          to="/admin/products/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3">id</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr
                key={p.id}
                className={`border-t hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-blue-600">{p.price} TND</td>
                <td className="p-3">{p.quantity}</td>

                <td className="p-3 space-x-3">
               <button
  onClick={() => {
    setSelectedProduct(p);
    setMode("view");
    setIsOpen(true);
  }}
  className="text-green-600"
>
  View
</button>

<button
  onClick={() => {
    setSelectedProduct(p);
    setMode("edit");
    setIsOpen(true);
  }}
  className="text-blue-600"
>
  Edit
</button>
                  {/* <Link
                    to={`/admin/products/${p.id}`}
                    className="text-green-600 hover:underline"
                  >
                    View
                  </Link> */}

                  <button
                    onClick={() => {
                      setDeleteId(p.id);
                       setSelectedProduct(p);
                      setIsModalOpen(true);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={meta.current_page === 1}
          onClick={() => fetchProducts(meta.current_page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(meta.last_page || 1)].map((_, i) => (
          <button
            key={i}
            onClick={() => fetchProducts(i + 1)}
            className={`px-3 py-1 border rounded ${
              meta.current_page === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={meta.current_page === meta.last_page}
          onClick={() => fetchProducts(meta.current_page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Sidebar */}
      {selectedProduct && (
       <ProductSidebar
  product={selectedProduct}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  mode={mode}
  onUpdated={fetchProducts}
/>
      )}


      <ConfirmModal
  isOpen={isModalOpen}
  onClose={closeModal}
  onConfirm={confirmDelete}
  title="Delete Product"
  message="Are you sure you want to delete this product?"
 product={selectedProduct}
/>
    </div>
  );
}

export default AdminProductList;
