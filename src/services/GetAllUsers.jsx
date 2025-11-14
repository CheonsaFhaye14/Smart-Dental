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

    const users = response.data;

    // Count users by type
    const userTypeCount = users.reduce((acc, user) => {
      const type = user.usertype || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    console.log("Token used:", token); // Log the token
    console.log(`Total users: ${users.length} | User count by type:`, userTypeCount);

    return {
      success: true,
      message: "Users fetched successfully",
      data: users, // the merged list of users
    };
  } catch (error) {
    console.error("Error fetching users:", error); // ✅ Log the error

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
