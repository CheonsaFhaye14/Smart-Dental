import axios from "axios";
import { BASE_URL } from "../config";

// ---------------- Get All Services Grouped By Category ----------------
export const getAllServices = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/services/grouped`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Correct key from backend
    const groupedServices = response.data.category || [];

    // Optional: Count total services
    const totalServices = groupedServices.reduce(
      (acc, category) => acc + category.services.length,
      0
    );

    console.log("Token used:", token);
    console.log(`Total services: ${totalServices}`);
    console.log("Grouped services:", groupedServices);

    return {
      success: true,
      message: "Services fetched successfully",
      data: groupedServices, // array of categories with services
    };
  } catch (error) {
    console.error("Error fetching services:", error);

    let errorMessage = "Unable to fetch services. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to load services.";
    }

    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};
