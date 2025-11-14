import axios from "axios";
import { BASE_URL } from "../config"; // Adjust path if needed

// ---------------- Add New Category (Admin Only) ----------------
export const addCategory = async (token, newCategoryData) => {
  try {
    console.log("📤 Sending new category data:", newCategoryData);

    const response = await axios.post(
      `${BASE_URL}/services/categories`,
      newCategoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Category added successfully",
      data: response.data?.category || null,
    };
  } catch (error) {
    let errorMessage = "Unable to add category. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to add category.";

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


// ---------------- Add New Service (Admin Only) ----------------
export const addService = async (token, newServiceData) => {
  try {
    console.log("📤 Sending new service data:", newServiceData);

    const response = await axios.post(
      `${BASE_URL}/services`, // Your backend route for services
      newServiceData, // should match your form data
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Service added successfully",
      data: response.data?.service || null,
    };
  } catch (error) {
    let errorMessage = "Unable to add service. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to add service.";

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
