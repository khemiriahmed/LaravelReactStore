import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      const res = await register(form);

      // sauvegarder token
      localStorage.setItem("token", res.data.token);

      // redirection
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: ["Something went wrong"] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors?.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors?.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password[0]}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* General error */}
          {errors?.general && (
            <p className="text-red-500 text-sm text-center">
              {errors.general[0]}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* Link login */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;