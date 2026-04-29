import { useState } from "react";
import { login } from "../../services/api/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await login(form);

      loginUser(res.data);

       const role = res.data.user.role;

    if (role === "admin") navigate("/admin/products");
    else if (role === "vendor") navigate("/vendor/dashboard");
    else navigate("/profile");
    } catch (err) {
      setErrors(err.response.data.errors);
      console.log(err.response.data);
      // setErrors({
      //   general: "Invalid credentials",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors?.email && <p className="text-red-500">{errors.email[0]}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors?.password && (
            <p className="text-red-500">{errors.password[0]}</p>
          )}

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
