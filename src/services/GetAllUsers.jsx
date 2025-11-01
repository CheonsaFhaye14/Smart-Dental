import axios from "axios";
import { BASE_URL } from "../config"; // Same style as your other APIs

// ---------------- Get All Users (Admin Only) ----------------
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: "Users fetched successfully",
      data: response.data, // the merged list of users
    };
  } catch (error) {
    let errorMessage = "Unable to fetch users. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to load users.";
    }

    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};
