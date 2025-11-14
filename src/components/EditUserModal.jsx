import { useState, useEffect, useMemo, useRef } from "react";
import FloatingInput from "../utils/InputForm";
import CustomSelect from "../utils/CustomSelect";
import CustomDate from "../utils/CustomDate";
import PasswordToggleIcon from "../utils/PasswordToggleIcon";
import { UsersOwnField } from "../data/UsersOwnField";
import "./AddModal.css";

export default function EditUserModal({ isOpen, data, onSubmit, onClose }) {
  const [formValues, setFormValues] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState({});
const originalValues = useRef({});

 useEffect(() => {
  if (!data) return;

  const normalized = { ...data };

  if (normalized.birthdate) {
    normalized.birthday = normalized.birthdate;
    delete normalized.birthdate;
  }
  if (normalized.allergies !== undefined) {
    normalized.allergy = normalized.allergies;
    delete normalized.allergies;
  }
  if (normalized.medicalhistory !== undefined) {
    normalized.medicalHistory = normalized.medicalhistory;
    delete normalized.medicalhistory;
  }

  const rawType = normalized.usertype;
  const type = rawType?.toLowerCase();
  const matchedKey = Object.keys(UsersOwnField).find(
    (key) => key.toLowerCase() === type
  );

  const initValues = {};
  const passState = {};

  (UsersOwnField[matchedKey] || []).forEach((f) => {
    initValues[f.name] = normalized[f.name] ?? "";
    if (f.type === "password") passState[f.name] = false;
  });

  setFormValues(initValues);
  setShowPasswordFields(passState);

  // ✅ Save original values for reset
  originalValues.current = initValues;

}, [data]);


 const dynamicFields = useMemo(() => {
  const rawType = formValues.usertype || data?.usertype || "patient";
  const type = rawType.toLowerCase(); 

  // Match keys in UsersOwnField ignoring case
  const matchedKey = Object.keys(UsersOwnField).find(
    (key) => key.toLowerCase() === type
  );

  return UsersOwnField[matchedKey] || [];
}, [formValues.usertype, data]);




  if (!isOpen || !data) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = (name) => {
    setShowPasswordFields((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    const updated = { ...data, ...formValues };

    if (updated.birthday) {
      updated.birthdate = updated.birthday;
      delete updated.birthday;
    }
    if (updated.allergy !== undefined) {
      updated.allergies = updated.allergy;
      delete updated.allergy;
    }
    if (updated.medicalHistory !== undefined) {
      updated.medicalhistory = updated.medicalHistory;
      delete updated.medicalHistory;
    }

    onSubmit(updated);
  };

  const handleCancel = () => {
  setFormValues(originalValues.current); // reset form to original values
  onClose(); // close the modal
};

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="modal-title">Edit {data.firstname ?? "User"}</h2>

        <div className="modal-body">
          <div className="modal-form">
            {dynamicFields.map((field) => {
              const labelText = field.placeholder;

              if (field.type === "select") {
                return (
                  <div key={field.name} className="input-container">
                    <CustomSelect
                      name={field.name}
                      value={formValues[field.name]}
                      onChange={handleChange}
                      options={field.options}
                      placeholder={labelText}
                    />
                  </div>
                );
              }

              if (field.type === "date") {
                return (
                  <div key={field.name} className="input-container">
                    <CustomDate
                      name={field.name}
                      value={formValues[field.name]}
                      onChange={handleChange}
                      placeholder={labelText}
                    />
                  </div>
                );
              }

              if (field.type === "password") {
                return (
                  <div key={field.name} className="input-container password-wrapper">
                    <input
                      type={showPasswordFields[field.name] ? "text" : "password"}
                      name={field.name}
                      value={formValues[field.name] || ""}
                      onChange={handleChange}
                      className="floating-input"
                      placeholder=" "
                    />
                    <label className={`floating-label ${formValues[field.name] ? "has-value" : ""}`}>
                      {labelText}
                    </label>
                    <PasswordToggleIcon
                      show={showPasswordFields[field.name]}
                      onToggle={() => togglePassword(field.name)}
                      style={{ right: "1rem" }}
                    />
                  </div>
                );
              }

              return (
                <div key={field.name} className="input-container">
                  <FloatingInput
                    name={field.name}
                    value={formValues[field.name] || ""}
                    onChange={handleChange}
                    placeholder={labelText}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn-submit" onClick={handleSubmit}>Save</button>
<button className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
