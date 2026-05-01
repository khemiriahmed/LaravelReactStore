import { useMemo, useState } from "react";
import { useCategories } from "../../../context/CategoryContext";
import { Link } from "react-router-dom";
import CategorySidebar from "../../../components/admin/CategorySidebar";
import ConfirmModal from "../../../components/ui/ConfirmModal";

function AdminCategoryList() {
  const { categories, removeCategory, fetchCategories } = useCategories();

  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");
  const [isOpen, setIsOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔎 SEARCH + SORT
  const [search, setSearch] = useState("");
  const [sortName, setSortName] = useState("none");

  // =========================
  // SIDEBAR
  // =========================
  const openSidebar = (cat, type) => {
    setSelected(cat);
    setMode(type);
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  // =========================
  // DELETE
  // =========================
  const confirmDelete = async () => {
    await removeCategory(deleteId);
    setIsModalOpen(false);
  };

  // =========================
  // FILTER + SEARCH + SORT
  // =========================
  const filteredCategories = useMemo(() => {
    let data = [...categories];

    // SEARCH
    if (search) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SORT
    if (sortName === "asc") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortName === "desc") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    return data;
  }, [categories, search, sortName]);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>

        {/*  ADD BUTTON */}
        <Link
          to="/admin/categories/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Category
        </Link>
      </div>

      {/*  SEARCH + SORT */}
      <div className="flex gap-3 mb-4 flex-wrap">

        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={sortName}
          onChange={(e) => setSortName(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="none">Sort Name</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Slug</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredCategories.map((c, index) => (
                <tr
                  key={c.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 text-center">{c.id}</td>

                  <td className="p-3 text-center font-medium">{c.name}</td>

                  <td className="p-3 text-center text-gray-500">
                    {c.slug}
                  </td>

                  {/* STATUS */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded text-white ${
                        c.is_active
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-center space-x-2">

                    <button
                      onClick={() => openSidebar(c, "view")}
                      className="text-green-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => openSidebar(c, "edit")}
                      className="text-blue-600"
                    >
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
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* SIDEBAR */}
      {selected && (
        <CategorySidebar
          category={selected}
          isOpen={isOpen}
          onClose={closeSidebar}
          mode={mode}
          onUpdated={fetchCategories}
        />
      )}

      {/* DELETE MODAL */}
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