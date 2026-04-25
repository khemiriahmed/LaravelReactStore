import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        LaravelReactStore 🚀
      </h1>

      {/* Links */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/")}>Home</button>

        {token ? (
          <>
            <button onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;