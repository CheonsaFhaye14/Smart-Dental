// pages/Users/components/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import { faUserShield, faTooth, faHospitalUser, faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import AppModal from "../../../components/common/AppModal";
import AppInput from "../../../components/common/AppInput";
import AppDatePicker from "../../../components/common/AppDatePicker";
import AppSelect from "../../../components/common/AppSelect";
import AppMultiSelect from "../../../components/common/AppMultiSelect";
import SegmentedPicker from "../../../components/common/SegmentedPicker";
import Button from "../../../components/ui/Buttons/Button";
import { validateUserForm, hasUserErrors } from "../validators/userValidators";
import { addUser, editUser } from "../services/usersService";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import "./UserFormModal.css";

const roleOptions = [
  { value: "admin", label: "Admin", icon: faUserShield },
  { value: "dentist", label: "Dentist", icon: faTooth },
  { value: "patient", label: "Patient", icon: faHospitalUser },
];

const statusOptions = [
  { value: true, label: "Active", icon: faCircleCheck },
  { value: false, label: "Inactive", icon: faCircleXmark },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const emptyForm = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  role: "patient",
  is_active: true,
  birthdate: "",
  contact: "",
  address: "",
  gender: "",
  allergies: [],
  medicalhistory: [],
};

export default function UserFormModal({
  isOpen,
  mode = "add", // "add" | "edit"
  initialData = null,
  onClose,
  onSuccess,
  allergyOptions = [],
  conditionOptions = [],
  onAddAllergy,
  onAddCondition,
}) {
  const { token } = useAdminAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        const allergies = Array.isArray(initialData.allergies)
          ? initialData.allergies
          : initialData.allergies
          ? Object.values(initialData.allergies)
          : [];

        const medicalhistory = Array.isArray(initialData.medicalhistory)
          ? initialData.medicalhistory
          : initialData.medicalhistory
          ? Object.values(initialData.medicalhistory)
          : [];

        setForm({
          username: initialData.username || "",
          firstname: initialData.firstname || "",
          lastname: initialData.lastname || "",
          email: initialData.email || "",
          role: initialData.role || "patient",
          is_active:
            initialData.is_active !== undefined ? initialData.is_active : true,
          birthdate: initialData.birthdate || "",
          contact: initialData.contact || "",
          address: initialData.address || "",
          gender: initialData.gender || "",
          allergies,
          medicalhistory,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
      setFormError("");
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const validationErrors = validateUserForm(form, mode);
    if (hasUserErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result =
      mode === "edit"
        ? await editUser(token, initialData.id, form)
        : await addUser(token, form);
    setSubmitting(false);

    if (result.success) {
      onSuccess?.(result.data);
    } else {
      setFormError(result.message || "Something went wrong.");
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Edit User" : "Add User"}
      maxWidth="1200px"
      className="user-form-modal"
    >
      <form onSubmit={handleSubmit} className="user-form">

        <div className="user-form__sections">
          <div className="user-form__section">
            <h4 className="user-form__section-title">Access</h4>
            <div className="user-form__grid">
              <div className="user-form__wide">
                <SegmentedPicker
                  label="Role"
                  value={form.role}
                  onChange={handleChange("role")}
                  options={roleOptions}
                />
              </div>
              <div className="user-form__wide">
                <SegmentedPicker
                  label="Status"
                  value={form.is_active}
                  onChange={handleChange("is_active")}
                  options={statusOptions.map((s) => ({ ...s, variant: s.value ? "success" : "danger" }))}
                />
              </div>
            </div>
          </div>

          <div className="user-form__section">
            <h4 className="user-form__section-title">Personal Info</h4>
            <div className="user-form__grid">
              <AppInput label="First Name" value={form.firstname} onChange={handleChange("firstname")} error={errors.firstname} />
              <AppInput label="Last Name" value={form.lastname} onChange={handleChange("lastname")} error={errors.lastname} />
              <AppDatePicker label="Birthdate" value={form.birthdate} onChange={handleChange("birthdate")} error={errors.birthdate} maxDate={new Date().toISOString().split("T")[0]} />
              <AppSelect label="Gender" value={form.gender} onChange={handleChange("gender")} options={genderOptions} error={errors.gender} />
            </div>
          </div>

          <div className="user-form__section">
            <h4 className="user-form__section-title">Account</h4>
            <div className="user-form__grid">
              <AppInput
                label="Username"
                value={form.username}
                onChange={handleChange("username")}
                error={errors.username}
              />
              <AppInput
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                error={errors.email}
              />
            </div>
          </div>

          <div className="user-form__section">
            <h4 className="user-form__section-title">Contact</h4>
            <div className="user-form__grid">
              <AppInput label="Contact Number" value={form.contact} onChange={handleChange("contact")} error={errors.contact} />
              <AppInput label="Address" value={form.address} onChange={handleChange("address")} error={errors.address} />
            </div>
          </div>

          {form.role === "patient" && (
            <div className="user-form__section" style={{ gridColumn: "1 / -1" }}>
              <h4 className="user-form__section-title">Medical Information</h4>
              <div className="user-form__grid">
                <AppMultiSelect
                  label="Allergies"
                  value={form.allergies}
                  onChange={(vals) => setForm((prev) => ({ ...prev, allergies: vals }))}
                  options={allergyOptions}
                  onAddCustom={onAddAllergy}
                  error={errors.allergies}
                />
                <AppMultiSelect
                  label="Medical History"
                  value={form.medicalhistory}
                  onChange={(vals) => setForm((prev) => ({ ...prev, medicalhistory: vals }))}
                  options={conditionOptions}
                  onAddCustom={onAddCondition}
                  error={errors.medicalhistory}
                />
              </div>
            </div>
          )}
        </div>

        {formError && <p className="user-form__error">{formError}</p>}

        <div className="user-form__actions">
          <Button type="button" variant="outline" onClick={onClose} text="Cancel" />
          <Button type="submit" disabled={submitting} text={submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add User"} />
        </div>
      </form>
    </AppModal>
  );
}