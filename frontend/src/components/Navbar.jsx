import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(user?.avatar || null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const ref = useRef();

useEffect(() => {
  const handler = (e) => {
    if (!ref.current.contains(e.target)) {
      setOpen(false);
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        LaravelReactStore 
      </h1>

      <div className="flex items-center gap-4 relative">

        <button onClick={() => navigate("/")}>Home</button>

        {!user ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Register
            </button>
          </>
        ) : (
          <div ref={ref} className="relative">

            {/*  bouton user */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={
            
              preview
                ? preview
                : user?.avatar
                ? "http://localhost:8000" + user.avatar
                : "https://ui-avatars.com/api/?name=" + user?.name
            }
            className="w-10 h-10 rounded-full"
        />
              <span>{user.name}</span>
            </div>

            {/*  Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">

                {/* Profile */}
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                   Profile
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                   Settings
                </button>

                {/* Admin */}
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                     Admin Dashboard
                  </button>
                )}

                <hr />

                {/* Logout */}
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