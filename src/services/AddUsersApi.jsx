// src/services/AddUsersApi.jsx
import axios from "axios";
import { BASE_URL } from "../config"; // Make sure this path matches your setup

// ---------------- Add New User (Admin Only) ----------------
export const addUser = async (token, newUserData) => {
  try {

    // ✅ Log data before sending
    console.log("📤 Sending new user data to server:", newUserData);
    console.log("🔐 Using token:", token);

    const response = await axios.post(
      `${BASE_URL}/users/add`,
      newUserData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "User added successfully",
      data: response.data?.user || null,
    };
  } catch (error) {
    let errorMessage = "Unable to add user. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to add user.";

      // ✅ Log backend error response for debugging
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
