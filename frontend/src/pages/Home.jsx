import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api/product";
import ProductCard from "../components/products/ProductCard";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(1, { featured: 1, per_page: 4 })
      .then((r) => setFeatured(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-widest text-blue-200 text-sm mb-3">
              Full Stack E-commerce
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Bienvenue sur <span className="text-amber-400">LaravelReactStore</span>
            </h1>
            <p className="text-blue-100 mb-8 text-lg">
              Des produits soigneusement sélectionnés, un panier simple et un
              checkout rapide. Laravel API + React SPA.
            </p>

            <div className="flex gap-4">
              <Link
                to="/products"
                className="bg-amber-400 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-amber-300 transition"
              >
                Voir les produits
              </Link>
              <Link
                to="/register"
                className="border border-white/40 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition"
              >
                Créer un compte
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-amber-400">50+</p>
                  <p className="text-blue-100 text-sm">Produits</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">4</p>
                  <p className="text-blue-100 text-sm">Catégories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">2</p>
                  <p className="text-blue-100 text-sm">Rôles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">100%</p>
                  <p className="text-blue-100 text-sm">API Rest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Produits en vedette</h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            Tout voir →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="font-semibold mb-1">Panier intelligent</h3>
            <p className="text-gray-500 text-sm">
              Ajoutez, modifiez et supprimez vos articles en un clic.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-semibold mb-1">Suivi des commandes</h3>
            <p className="text-gray-500 text-sm">
              Suivez l'état de vos commandes depuis votre espace.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="font-semibold mb-1">Authentification sécurisée</h3>
            <p className="text-gray-500 text-sm">
              Laravel Sanctum protège votre compte et vos données.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;