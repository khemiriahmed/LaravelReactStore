import { useEffect, useState } from "react";
import api from "../../../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users", { params: { page, per_page: 10 } })
      .then((res) => {
        setUsers(res.data.data);
        setMeta(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Utilisateurs</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Rôle</th>
              <th className="p-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded text-white ${
                        user.role === "admin" ? "bg-blue-600" : "bg-gray-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded text-white ${
                        user.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border px-4 py-2 rounded disabled:opacity-40"
          >
            ←
          </button>
          <span className="px-4 py-2">
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={page >= meta.last_page}
            className="border px-4 py-2 rounded disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;