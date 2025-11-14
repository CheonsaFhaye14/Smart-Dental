// src/services/EditUsersApi.jsx
import axios from "axios";
import { BASE_URL } from "../config"; 

// ---------------- Edit Existing User (Admin Only) ----------------
export const editUser = async (token, authUid, updatedUserData) => {
  try {
    console.log("✏️ Editing user (auth_uid):", authUid);
    console.log("📤 Updated user data:", updatedUserData);
    console.log("🔐 Token used:", token);

    const response = await axios.put(
      `${BASE_URL}/users/edit/${authUid}`, // ✅ use auth_uid
      updatedUserData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "User updated successfully",
      data: response.data?.user || null,
    };
  } catch (error) {
    let errorMessage = "Unable to update user. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to update user.";

      console.error("❌ Server error:", error.response.data);
    } else {
      console.error("❌ Request failed:", error);
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};
