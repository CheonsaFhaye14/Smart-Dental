import { useState, useEffect } from "react";
import FloatingInput from "../utils/InputForm";
import CustomSelect from "../utils/CustomSelect";
import CustomSelectMultiple from "../utils/CustomSelectMultiple";
import CustomDate from "../utils/CustomDate";
import PasswordToggleIcon from "../utils/PasswordToggleIcon";
import "./AddModal.css";

export default function EditModal({ isOpen, data, fields = [], onSubmit, onClose }) {
  const [formValues, setFormValues] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState({});

useEffect(() => {
  const initValues = {};
  const passState = {};

  fields.forEach((f) => {
    let value;

    /* ------------------------------
       CHECKBOX
    ------------------------------ */
    if (f.type === "checkbox") {
      value = data?.[f.name] ?? f.defaultValue ?? false;
    }

    /* ------------------------------
       MULTI-SELECT
    ------------------------------ */
    else if (f.type === "select-multiple") {
      const current = data?.[f.name] || f.defaultValue || [];
      value = current.map(v => {
        if (v.label !== undefined && v.value !== undefined) return { label: v.label, value: Number(v.value) };
        if (v.name !== undefined && v.value !== undefined) return { label: v.name, value: Number(v.value) };
        return { label: String(v), value: Number(v) };
      });
    }

    /* ------------------------------
       SINGLE SELECT
    ------------------------------ */
    else if (f.type === "select") {
      const current = data?.[f.name] || f.defaultValue || null;

      if (!current) {
        value = null;
      } 
      // Already {label, value}
      else if (current.label !== undefined && current.value !== undefined) {
        value = { label: current.label, value: current.value };
      } 
      // {name, id} shape
      else if (current.name !== undefined && current.id !== undefined) {
        value = { label: current.name, value: Number(current.id) };
      } 
      // {name, value} shape
      else if (current.name !== undefined && current.value !== undefined) {
        value = { label: current.name, value: Number(current.value) };
      } 
      // primitive fallback
      else {
        value = f.options?.find(opt => opt.value === current) || null;
      }
    }

    /* ------------------------------
       DEFAULT INPUT
    ------------------------------ */
    else {
      value = data?.[f.name] ?? f.defaultValue ?? "";
    }

    /* ------------------------------
       NORMALIZATION
    ------------------------------ */
    if (f.normalize && typeof f.normalize === "function") {
      value = f.normalize(value);
    }

    initValues[f.name] = value;

    if (f.type === "password") passState[f.name] = false;
  });

  setFormValues(initValues);
  setShowPasswordFields(passState);

  console.log("📄 Form initialized with values:");
  fields.forEach(f => console.log(`- ${f.name}:`, initValues[f.name]));
}, [data, fields]);

  if (!isOpen || !data) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleMultiSelectChange = (name, selectedOptions) => {
  // selectedOptions is already [{label, value}], so just store it directly
  setFormValues(prev => ({ ...prev, [name]: selectedOptions || [] }));
};

  const togglePassword = (name) => {
    setShowPasswordFields((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    // ✅ Step 3: Apply transformations before submitting (e.g. "Yes" → true)
    const transformedValues = { ...formValues };
    fields.forEach((f) => {
      if (f.transform && typeof f.transform === "function") {
        transformedValues[f.name] = f.transform(formValues[f.name]);
      }
    });

    onSubmit({ ...data, ...transformedValues });
  };

  const handleCancel = () => onClose();

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="modal-title">Edit {data.name || data.firstname || "Item"}</h2>
        <div className="modal-body">
          <div className="modal-form">
            {fields.map((field) => {
              if (field.showIf && typeof field.showIf === "function" && !field.showIf(formValues, field)) {
                return null;
              }

              const value = formValues[field.name];

              // Single-select
              if (field.type === "select") {
                const selectedOption = field.options.find(opt => opt.value === value) || null;
                return (
                  <div key={field.name} className="input-container">
                    <CustomSelect
                      name={field.name}
                      value={selectedOption}
                      onChange={(selected) =>
                        setFormValues(prev => ({ ...prev, [field.name]: selected?.value || "" }))
                      }
                      options={field.options || []}
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              }

             // Multi-select
if (field.type === "select-multiple") {
  const selectedOptions = value || [];
  return (
    <div key={field.name} className="input-container">
      <CustomSelectMultiple
        name={field.name}
        options={field.options || []}
        value={selectedOptions} // pass full objects
        onChange={(selected) => handleMultiSelectChange(field.name, selected)}
        placeholder={field.placeholder}
      />
    </div>
  );
}


              // Date
              if (field.type === "date") {
                return (
                  <div key={field.name} className="input-container">
                    <CustomDate
                      name={field.name}
                      value={value}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              }

              // Checkbox
              if (field.type === "checkbox") {
                return (
                  <div key={field.name} className="input-container">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={value || false}
                      onChange={handleChange}
                      className="modal-input"
                    />
                    <label className="modal-label">{field.placeholder}</label>
                  </div>
                );
              }

              // Password
              if (field.type === "password") {
                return (
                  <div key={field.name} className="input-container password-wrapper" style={{ position: "relative" }}>
                    <input
                      type={showPasswordFields[field.name] ? "text" : "password"}
                      name={field.name}
                      value={value || ""}
                      onChange={handleChange}
                      className="floating-input"
                      placeholder=" "
                    />
                    <label className={`floating-label ${value ? "has-value" : ""}`}>{field.placeholder}</label>
                    <PasswordToggleIcon
                      show={showPasswordFields[field.name]}
                      onToggle={() => togglePassword(field.name)}
                      style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" }}
                    />
                  </div>
                );
              }

              // Default text
              return (
                <div key={field.name} className="input-container">
                  <FloatingInput
                    name={field.name}
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
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
