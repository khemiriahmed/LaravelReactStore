import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updatePassword } from "../../services/api/auth";

function Settings() {
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

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
    setMessage("");

    try {
      await updatePassword(form);

      setMessage("Password updated successfully ✅");

      setForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });

    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">

      {/* 🔹 Infos utilisateur */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Account Info ⚙️</h2>

        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Status:</strong> {user?.status}</p>
      </div>

      {/* 🔐 Change Password */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Change Password 🔐</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            name="current_password"
            placeholder="Current Password"
            value={form.current_password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors?.current_password && (
            <p className="text-red-500 text-sm">
              {errors.current_password[0]}
            </p>
          )}

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors?.password && (
            <p className="text-red-500 text-sm">
              {errors.password[0]}
            </p>
          )}

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Updating..." : "Update Password"}
          </button>

          {message && (
            <p className="text-green-600 text-center">{message}</p>
          )}

        </form>
      </div>

      {/* 🚪 Logout */}
      <div className="bg-white p-6 rounded shadow text-center">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded"
        >
          Logout 🚪
        </button>
      </div>

    </div>
  );
}

export default Settings;