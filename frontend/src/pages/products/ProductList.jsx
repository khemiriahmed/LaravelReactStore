import { useEffect, useState } from "react";
import { getProducts } from "../../services/api/product.js";
import { getCategories } from "../../services/api/category";
import ProductCard from "../../components/products/ProductCard.jsx";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const fetchProducts = async () => {
    const params = {
      per_page: 12,
      category_id: categoryId || undefined,
      sort,
      search: search || undefined,
    };

    const res = await getProducts(page, params);
    setProducts(res.data.data);
    setMeta(res.data);
  };

  useEffect(() => {
    getCategories({ is_active: 1 }).then((r) =>
      setCategories(r.data.data || r.data),
    );
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tous les produits</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-56"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Rechercher
          </button>
        </form>

        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="latest">Plus récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border px-4 py-2 rounded disabled:opacity-40"
          >
            ←
          </button>
          <span className="px-4 py-2">
            Page {meta.current_page} / {meta.last_page}
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

export default ProductList;