import { useState, useEffect } from "react";
import fieldTemplates from "../data/fieldTemplates";
import PasswordToggleIcon from "../utils/PasswordToggleIcon";
import CustomSelect from "../utils/CustomSelect";
import CustomDate from "../utils/CustomDate";
import FloatingInput from "../utils/InputForm"; // your floating label input
import "./AddModal.css";
 import { validateUserForm } from "../utils/validateUserForm"; // adjust path


export default function AddModal({ choices, selected, onClose, onSubmit })
{
  const [currentType, setCurrentType] = useState(selected);
  const [showPasswordFields, setShowPasswordFields] = useState({});
  const [errors, setErrors] = useState({});


  const initializeFormValues = (type) => {
    const fields = fieldTemplates[type] || [];
    const initValues = fields.reduce((acc, field) => {
      if (field.type === "checkbox") acc[field.name] = false;
      else if (field.type === "multi-select") acc[field.name] = [];
      else acc[field.name] = "";
      return acc;
    }, {});

    const passwordStates = fields
      .filter((f) => f.type === "password")
      .reduce((acc, f) => {
        acc[f.name] = false;
        return acc;
      }, {});
    setShowPasswordFields(passwordStates);

    return initValues;
  };

  const [formValues, setFormValues] = useState(() =>
    initializeFormValues(selected)
  );

  useEffect(() => {
    setFormValues(initializeFormValues(currentType));
  }, [currentType]);

  const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  const newValue = type === "checkbox" ? checked : value;

  setFormValues((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  // ✅ Live validation for this field only
  const validationErrors = validateUserForm(
    { ...formValues, [name]: newValue },
    fieldTemplates,
    currentType
  );

  setErrors(validationErrors);
};


  const togglePasswordVisibility = (name) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };


const handleSubmit = () => {
  const validationErrors = validateUserForm(formValues, fieldTemplates, currentType);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors); // show errors in UI
    return; // stop form submission
  }

  // Convert select fields to lowercase
  const normalizedValues = { ...formValues };
  const fields = fieldTemplates[currentType] || [];
  fields.forEach((field) => {
    if (field.type === "select" && normalizedValues[field.name]) {
      normalizedValues[field.name] = normalizedValues[field.name].toLowerCase();
    }
  });

  // Proceed with submission
  if (onSubmit) {
    onSubmit({ ...normalizedValues, usertype: currentType.toLowerCase() });
  }
};




  const fields = fieldTemplates[currentType] || [];
  const dynamicTitle = `Add New ${currentType}`;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="modal-title">{dynamicTitle}</h2>

        <div className="modal-choice-bar">
          {choices.map((choice) => (
            <button
              key={choice}
              className={`choice-btn ${choice === currentType ? "active" : ""}`}
              onClick={() => setCurrentType(choice)}
            >
              {choice}
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div className="modal-form">
            {fields.map((field) => {
              if (field.dependsOn && !formValues[field.dependsOn]) return null;

              // Select field
              if (field.type === "select") {
                return (
                  <div className="input-container" key={field.name}>
                    <CustomSelect
                      options={field.options || []}
                      value={formValues[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      name={field.name}
                    />
                  </div>
                );
              }

              // Date field
            if (field.type === "date") {
    return (
      <div className="input-container" key={field.name}>
  <CustomDate
    name={field.name}
    value={formValues[field.name]}
    onChange={handleChange}
    placeholder={field.placeholder}
  />
  {errors[field.name] && (
    <p className="text-error" style={{ marginTop: "5px", textAlign: "center" }}>
      {errors[field.name]}
    </p>
  )}
</div>

    );
  }

              // Checkbox
              if (field.type === "checkbox") {
                return (
                  <div className="input-container" key={field.name}>
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formValues[field.name] || false}
                      onChange={handleChange}
                      className="modal-input"
                    />
                    <label className="modal-label">{field.placeholder}</label>
                  </div>
                );
              }

              // Password with toggle
        if (field.type === "password") {
  return (
    <div key={field.name}>
      <div className="input-container password-wrapper" style={{ position: "relative" }}>
        <input
          type={showPasswordFields[field.name] ? "text" : "password"}
          name={field.name}
          value={formValues[field.name] || ""}
          onChange={handleChange}
          className="floating-input"
          placeholder=" "
        />
        <label className={`floating-label ${formValues[field.name] ? "has-value" : ""}`}>
          {field.placeholder}
        </label>

        <PasswordToggleIcon
          show={showPasswordFields[field.name]}
          onToggle={() => togglePasswordVisibility(field.name)}
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>

{errors[field.name] && (
  <p className="text-error" style={{ marginBottom: "20px" }}>
    {errors[field.name]}
  </p>
)}
    </div>
  );
}

              // Default input -> use FloatingInput
          return (
    <div className="input-container" key={field.name}>
      <FloatingInput
        name={field.name}
        value={formValues[field.name] || ""}
        onChange={handleChange}
        placeholder={field.placeholder}
      />
      {errors[field.name] && <p className="text-error">{errors[field.name]}</p>}
    </div>
  );
})}
          </div>
        </div>

        <div className="modal-buttons">
      <button type="button" className="btn-submit" onClick={handleSubmit}>
  Add
</button>

          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
