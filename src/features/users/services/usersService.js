import axios from "axios";
import { BASE_URL } from "../../../config";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ---------------- Get All Users ----------------
export const getAllUsers = async (token, { search = "", role = "" } = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/all`, {
      ...authHeader(token),
      params: { search, role },
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

// ---------------- Add User ----------------
export const addUser = async (token, payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/add`, payload, authHeader(token));

    return {
      success: true,
      message: response.data.message,
      user: response.data.user,
    };
  } catch (error) {
    let errorMessage = "Unable to add user. Please try again.";

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

// ---------------- Edit User ----------------
export const editUser = async (token, userId, payload) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/edit/${userId}`, payload, authHeader(token));

    return {
      success: true,
      message: response.data.message,
      user: response.data.user,
    };
  } catch (error) {
    let errorMessage = "Unable to update user. Please try again.";

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

// ---------------- Delete (Soft) User ----------------
export const deleteUser = async (token, userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/delete/${userId}`, authHeader(token));

    return {
      success: true,
      message: response.data.message,
      user: response.data.user,
    };
  } catch (error) {
    let errorMessage = "Unable to delete user. Please try again.";

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// ---------------- Toggle User Status ----------------
export const toggleUserStatus = async (token, userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/toggle-status/${userId}`, {}, authHeader(token));

    return {
      success: true,
      message: response.data.message,
      is_active: response.data.is_active,
    };
  } catch (error) {
    let errorMessage = "Unable to update user status. Please try again.";

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// ---------------- Send Password Reset ----------------
export const sendPasswordReset = async (token, userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/send-password-reset/${userId}`, {}, authHeader(token));

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    let errorMessage = "Unable to send password reset. Please try again.";

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};