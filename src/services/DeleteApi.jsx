import axios from "axios";
import { BASE_URL } from "../config"; // Same style as your other APIs

// ---------------- Delete User (Soft Delete, Admin Only) ----------------
export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: response.data.message || "User deleted successfully",
      data: response.data.user,
    };
  } catch (error) {
    let errorMessage = "Unable to delete user. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to delete user.";
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};
