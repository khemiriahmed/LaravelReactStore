import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold cursor-pointer">
        LaravelReactStore
      </Link>

      <div className="flex items-center gap-5 relative">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>

        <Link to="/products" className="text-gray-700 hover:text-blue-600">
          Produits
        </Link>

        {/* CART */}
        <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
          <span className="text-xl">🛒</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </Link>

        {!user ? (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Register
            </Link>
          </div>
        ) : (
          <div ref={ref} className="relative">
            {/* bouton user */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={
                  user?.avatar ||
                  "https://ui-avatars.com/api/?name=" + user?.name
                }
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{user.name}</span>
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/orders");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Mes commandes
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </button>
                )}

                <hr />

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;