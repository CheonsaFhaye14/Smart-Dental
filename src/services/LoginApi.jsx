import axios from "axios";
import { BASE_URL } from "../config"; // Make sure this points to your backend

// ---------------- Login ----------------
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/website/login`, {
      username,
      password,
    });

    return {
      success: true,
      message: response.data.message,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    if (error.response) {
      const { message, errors } = error.response.data;
      return {
        success: false,
        message: message || (errors && errors[0]?.msg) || "Login failed.",
      };
    }
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
    };
  }
};

// ---------------- Forgot Password ----------------
export const forgotPassword = async (email) => { 
  try {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });

    // Check if backend explicitly sends a success flag
    if (response.data && response.data.success === false) {
      return {
        success: false,
        message: response.data.message || "Password reset failed.",
      };
    }

    return {
      success: true,
      message: response.data.message || "Password reset email sent successfully.",
    };
  } catch (error) {
    let errorMessage = "Unable to connect to the server. Please try again.";

    if (error.response) {
      const { message, errors } = error.response.data;
      errorMessage = message || (errors && errors[0]?.msg) || "Password reset failed.";
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const resetPassword = async (access_token, newPassword) => {

  try {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
      access_token,
      newPassword, // match backend
    });

    return {
      success: true,
      message: response.data.message || "Password reset successfully.",
    };
  } catch (error) {
    let errorMessage = "Server error. Please try again.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        (error.response.data?.errors && error.response.data.errors[0]?.msg) ||
        errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};


