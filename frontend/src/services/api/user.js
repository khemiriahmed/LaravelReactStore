import api from "../../api/axios";

// 👤 update profile
export const updateProfile = (formData) => {
  return api.post("/profile/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};