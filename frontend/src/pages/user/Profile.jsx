import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { updateProfile } from "../../services/api/user";

function Profile() {
  const { user, loginUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    // 👁 preview image
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await updateProfile(formData);

      //  update user global
      loginUser({
        user: res.data.user,
        token: localStorage.getItem("token"),
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
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Profile 👤</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <img
            src={
              preview
                ? preview
                : user?.avatar
                ? "http://localhost:8000" + user.avatar
                : "https://ui-avatars.com/api/?name=" + user?.name
            }
            className="w-16 h-16 rounded-full"
          />

          <input type="file" onChange={handleFile} />

        </div>

        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.name && (
          <p className="text-red-500 text-sm">{errors.name[0]}</p>
        )}

        {/* Phone */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.phone && (
          <p className="text-red-500 text-sm">{errors.phone[0]}</p>
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </form>
    </div>
  );
}

export default Profile;