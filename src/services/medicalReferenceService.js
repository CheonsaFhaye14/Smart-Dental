import axios from "axios";
import { BASE_URL } from "../config";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ---------------- Get Reference Items ----------------
export const getMedicalReferenceItems = async (token, category = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/medical-reference`, {
      ...authHeader(token),
      params: { category },
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    let errorMessage = "Unable to connect to the server. Please try again.";

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// ---------------- Add Reference Item ----------------
export const addMedicalReferenceItem = async (token, category, label) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/medical-reference`,
      { category, label },
      authHeader(token)
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    let errorMessage = "Unable to add item. Please try again.";

    if (error.response) {
      const { message, errors } = error.response.data;
      errorMessage = message || (errors && errors[0]?.msg) || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// ---------------- Delete (Soft) Reference Item ----------------
export const deleteMedicalReferenceItem = async (token, id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/medical-reference/${id}`, authHeader(token));

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    let errorMessage = "Unable to delete item. Please try again.";

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};