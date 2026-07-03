import React, { useState, useEffect, useCallback } from "react";
import UsersTable from "./components/UsersTable";
import UsersStatsCards from "./components/UsersStatsCards";
import UserFormModal from "./components/UserFormModal";
import Button from "../../components/ui/Buttons/Button";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import {
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  sendPasswordReset,
} from "./services/usersService";
import {
  getMedicalReferenceItems,
  addMedicalReferenceItem,
} from "../../services/medicalReferenceService";
import "./Users.css";

import PageSpinner from "../../components/ui/LoadingScreen/PageSpinner";
import MessageModal from "../../components/ui/Modals/MessageModal";
import ConfirmModal from "../../components/ui/Modals/ConfirmModal";

export default function Users() {
  const { token } = useAdminAuth();
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Medical reference data (allergies / conditions) ───
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);

  // ── Form modal state ──────────────────────────────────
  const [formModal, setFormModal] = useState({
    isOpen: false,
    mode: "add",
    user: null,
  });

  const openAddModal = () =>
    setFormModal({ isOpen: true, mode: "add", user: null });

  const openEditModal = (row) =>
    setFormModal({ isOpen: true, mode: "edit", user: row });

  const closeFormModal = () =>
    setFormModal({ isOpen: false, mode: "add", user: null });

  // ── Toast state ───────────────────────────────────────
  const [toast, setToast] = useState({ message: "", type: "info" });

  // ── Confirm state ─────────────────────────────────────
  const [confirm, setConfirm] = useState({
    message: "",
    onConfirm: null,
    variant: "danger",
    confirmLabel: "Confirm",
  });

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const showConfirm = ({ message, onConfirm, variant = "danger", confirmLabel = "Confirm" }) =>
    setConfirm({ message, onConfirm, variant, confirmLabel });

  const closeConfirm = () =>
    setConfirm({ message: "", onConfirm: null, variant: "danger", confirmLabel: "Confirm" });

  // ── Fetch users ───────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    const result = await getAllUsers(token, {
      search: filters.search || "",
      role: filters.role || "",
    });

    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }, [token, filters.search, filters.role]);

  // ── Fetch medical reference data (once, on page load) ─
  const fetchMedicalReferenceData = useCallback(async () => {
    if (!token) return;

    const [allergyRes, conditionRes] = await Promise.all([
      getMedicalReferenceItems(token, "allergy"),
      getMedicalReferenceItems(token, "condition"),
    ]);

    if (allergyRes.success) {
      setAllergyOptions(allergyRes.data.map((item) => item.label));
    }
    if (conditionRes.success) {
      setConditionOptions(conditionRes.data.map((item) => item.label));
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchMedicalReferenceData();
  }, [fetchMedicalReferenceData]);

  // ── Handlers ──────────────────────────────────────────
  const handleEdit = (row) => {
    openEditModal(row);
  };

  const handleFormSuccess = () => {
    closeFormModal();
    showToast(
      formModal.mode === "edit"
        ? "User updated successfully."
        : "User added successfully.",
      "success"
    );
    fetchUsers();
  };

  const handleDelete = (row) => {
    showConfirm({
      message: `Delete ${row.firstname} ${row.lastname}?`,
      variant: "danger",
      confirmLabel: "Delete",
      onConfirm: async () => {
        closeConfirm();
        const result = await deleteUser(token, row.id);
        if (result.success) {
          showToast("User deleted successfully.", "success");
          fetchUsers();
        } else {
          showToast(result.message, "error");
        }
      },
    });
  };

  const handleToggleActive = (row) => {
    showConfirm({
      message: `${row.is_active ? "Deactivate" : "Activate"} ${row.firstname} ${row.lastname}?`,
      variant: row.is_active ? "warning" : "default",
      confirmLabel: row.is_active ? "Deactivate" : "Activate",
      onConfirm: async () => {
        closeConfirm();
        const result = await toggleUserStatus(token, row.id);
        if (result.success) {
          showToast(
            `User ${row.is_active ? "deactivated" : "activated"} successfully.`,
            "success"
          );
          fetchUsers();
        } else {
          showToast(result.message, "error");
        }
      },
    });
  };

  const handleSendReset = (row) => {
    showConfirm({
      message: `Send password reset email to ${row.email}?`,
      variant: "default",
      confirmLabel: "Send",
      onConfirm: async () => {
        closeConfirm();
        const result = await sendPasswordReset(token, row.id);
        showToast(result.message, result.success ? "success" : "error");
      },
    });
  };

  // ── Add a new allergy/condition option (from inside the modal) ─
  const handleAddAllergy = async (label) => {
    setAllergyOptions((prev) => (prev.includes(label) ? prev : [...prev, label].sort()));
    const result = await addMedicalReferenceItem(token, "allergy", label);
    if (!result.success) {
      showToast(result.message, "error");
    }
  };

  const handleAddCondition = async (label) => {
    setConditionOptions((prev) => (prev.includes(label) ? prev : [...prev, label].sort()));
    const result = await addMedicalReferenceItem(token, "condition", label);
    if (!result.success) {
      showToast(result.message, "error");
    }
  };

  // ── Render ────────────────────────────────────────────
  if (loading) return <PageSpinner />;

  return (
    <div className="users-page">
      {/* ── Toasts + Confirms ── */}
      <MessageModal
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
      <ConfirmModal
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
        variant={confirm.variant}
        confirmLabel={confirm.confirmLabel}
      />

      <UserFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        initialData={formModal.user}
        onClose={closeFormModal}
        onSuccess={handleFormSuccess}
        allergyOptions={allergyOptions}
        conditionOptions={conditionOptions}
        onAddAllergy={handleAddAllergy}
        onAddCondition={handleAddCondition}
      />

      <div className="same-row">
        <h1>Users</h1>
        <Button 
        onClick={openAddModal}
        text="Add User" 
        />
      </div>

      <UsersStatsCards users={users} loading={loading} />

      {error && <p className="error-text">{error}</p>}

      <UsersTable
        users={users}
        loading={loading}
        filters={filters}
        setFilters={setFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onSendReset={handleSendReset}
      />
    </div>
  );
}