import axios from "axios";
import { BASE_URL } from "../config"; // Adjust path if needed

// ---------------- Edit Category (Admin Only) ----------------
export const editCategory = async (token, categoryId, updatedCategoryData) => {
  try {
    console.log("📤 Sending updated category data:", updatedCategoryData);

    const response = await axios.put(
      `${BASE_URL}/services/categories/${categoryId}`,
      updatedCategoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Category updated successfully",
      data: response.data?.category || null,
    };
  } catch (error) {
    let errorMessage = "Unable to update category. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to update category.";

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

// ---------------- Edit Service (Admin Only) ----------------
export const editService = async (token, serviceId, updatedServiceData) => {
  try {
    console.log("📤 Sending updated service data:", updatedServiceData);

    const response = await axios.put(
      `${BASE_URL}/services/${serviceId}`, // Your backend route for updating service
      updatedServiceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Service updated successfully",
      data: response.data?.service || null,
    };
  } catch (error) {
    let errorMessage = "Unable to update service. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to update service.";

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
