import { useState } from "react";
import { useCategories } from "../../../context/CategoryContext";
import CategorySidebar from "../../../components/admin/CategorySidebar";
import ConfirmModal from "../../../components/ui/ConfirmModal";

function AdminCategoryList() {
  const { categories, removeCategory, fetchCategories } = useCategories();

  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");
  const [isOpen, setIsOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openSidebar = (cat, type) => {
    setSelected(cat);
    setMode(type);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    await removeCategory(deleteId);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <table className="w-full bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t text-center">
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.slug}</td>

              <td className="space-x-2">
                <button onClick={() => openSidebar(c, "view")} className="text-green-600">
                  View
                </button>

                <button onClick={() => openSidebar(c, "edit")} className="text-blue-600">
                  Edit
                </button>

                <button
                  onClick={() => {
                    setDeleteId(c.id);
                    setSelected(c);
                    setIsModalOpen(true);
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sidebar */}
      <CategorySidebar
        category={selected}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
        onUpdated={fetchCategories}
      />

      {/* Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Delete "${selected?.name}" ?`}
      />
    </div>
  );
}

export default AdminCategoryList;