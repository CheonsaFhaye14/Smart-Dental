import { useState, useEffect, useCallback } from "react";
import PasswordToggleIcon from "../utils/PasswordToggleIcon";
import CustomSelect from "../utils/CustomSelect";
import CustomDate from "../utils/CustomDate";
import FloatingInput from "../utils/InputForm"; // your floating label input
import "./AddModal.css";
 import { validateForm } from "../utils/validateForm"; // adjust path
import CustomSelectMultiple from "../utils/CustomSelectMultiple"; // import the new component


export default function AddModal({ datatype, choices, selected, fields, onClose, onSubmit })
{
  const [currentType, setCurrentType] = useState(selected); // default to selected choice
  const [showPasswordFields, setShowPasswordFields] = useState({}); 
  const [errors, setErrors] = useState({});
  const currentFields = fields[currentType] || [];  // fields for current type

  // Initialize form values based on current type
const initializeFormValues = useCallback((type) => {

    const currentFields = fields[type] || [];

    // Set initial values based on field types
    const initValues = currentFields.reduce((acc, field) => {
    if (field.type === "checkbox") acc[field.name] = false;
    else if (field.type === "multi-select") acc[field.name] = [];
    else acc[field.name] = "";
    return acc;
  }, {});

  const passwordStates = currentFields
    .filter((f) => f.type === "password")
    .reduce((acc, f) => {
      acc[f.name] = false;
      return acc;
    }, {});

  setShowPasswordFields(passwordStates);

  return initValues;
}, [fields]);

    const [formValues, setFormValues] = useState(() => initializeFormValues(currentType));

// Reset form values and errors when currentType changes
useEffect(() => {
  setFormValues(initializeFormValues(currentType));
  setErrors({}); // reset errors
  setTouched({}); // optional: reset touched fields
}, [currentType, initializeFormValues]);

// Track touched fields for better validation UX
const [touched, setTouched] = useState({});

// Handle input changes
const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  const newValue = type === "checkbox" ? checked : value;

  // Create updated form values first
  const updatedValues = { ...formValues, [name]: newValue };

  // Update form values and mark this field as touched
  setFormValues(updatedValues);
  setTouched(prev => ({ ...prev, [name]: true }));

  // Validate using the latest values
  const validationErrors = validateForm(updatedValues, fields, currentType);

  // Show errors only for touched fields
  const filteredErrors = Object.keys(validationErrors)
    .filter(key => updatedValues[key] !== undefined && (touched[key] || key === name))
    .reduce((acc, key) => {
      acc[key] = validationErrors[key];
      return acc;
    }, {});

  setErrors(filteredErrors);
};

// Handle form submission
const handleSubmit = () => {
  // Validate all fields
  const validationErrors = validateForm(formValues, currentFields);

  if (Object.keys(validationErrors).length > 0) {
    // Mark all fields as touched to show all errors
    const allTouched = currentFields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});

    setTouched(allTouched);
    setErrors(validationErrors);
    return; // Stop submission if errors exist
  }

 // Normalize values before submission
const normalizedValues = { ...formValues };

currentFields.forEach((field) => {
  const val = normalizedValues[field.name];
  
  if (field.type === "select") {
    if (typeof val === "string") {
      normalizedValues[field.name] = val.toLowerCase();
    } else if (typeof val === "object" && val !== null) {
      // Single select returns object { label, value }
      normalizedValues[field.name] = String(val.value).toLowerCase();
    }
  }

  if (field.type === "select-multiple" && Array.isArray(val)) {
    // Multi-select returns array of values
    normalizedValues[field.name] = val.map(v => String(v).toLowerCase());
  }
});

  // Include currentType in the submission dynamically
  const finalValues = {
    ...normalizedValues,
    [datatype]: currentType.toLowerCase(),
  };

  // Submit final values to parent
  if (onSubmit) {
    onSubmit(finalValues);
  }
};

  const togglePasswordVisibility = (name) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };




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
  {currentFields.map((field) => {
    // ✅ ShowIf logic: only render if showIf returns true (or no showIf defined)
  if (field.showIf && typeof field.showIf === "function" && !field.showIf(formValues, field)) {
  return null;
}


   const isRequired = field.required || (field.requiredIf && field.requiredIf(formValues));

const labelText = isRequired 
  ? `*${field.placeholder}` 
  : `${field.placeholder} (optional)`;


    // Select field
    if (field.type === "select") {
      return (
        <div className="input-container" key={field.name}>
          <CustomSelect
            options={field.options || []}
            value={formValues[field.name]}
            onChange={handleChange}
            placeholder={labelText}
            name={field.name}
          />
          {errors[field.name] && <p className="text-error">{errors[field.name]}</p>}
        </div>
      );
    }


// Select-multiple field
if (field.type === "select-multiple") {
  // Map formValues (array of selected IDs) to option objects
  const selectedOptions = field.options.filter(opt =>
    formValues[field.name]?.includes(opt.value)
  );

  return (
    <div className="input-container" key={field.name}>
      <CustomSelectMultiple
        options={field.options || []} // array of { label, value }
        value={selectedOptions}        // pass option objects directly
        onChange={(selectedOptions) => {
          // extract only the values to store in formValues
          const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
          handleChange({ target: { name: field.name, value: values } });
        }}
        placeholder={labelText}
        name={field.name}
      />
      {errors[field.name] && <p className="text-error">{errors[field.name]}</p>}
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
            placeholder={labelText}
          />
          {errors[field.name] && <p className="text-error">{errors[field.name]}</p>}
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
          <label className="modal-label">{labelText}</label>
          {errors[field.name] && <p className="text-error">{errors[field.name]}</p>}
        </div>
      );
    }

    // Password field with toggle
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
              {labelText}
            </label>
            <PasswordToggleIcon
              show={showPasswordFields[field.name]}
              onToggle={() => togglePasswordVisibility(field.name)}
              style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" }}
            />
          </div>
          {errors[field.name] && <p className="text-error">{errors[field.name]}</p>}
        </div>
      );
    }

    // Default input -> FloatingInput
    return (
      <div className="input-container" key={field.name}>
        <FloatingInput
          name={field.name}
          value={formValues[field.name] || ""}
          onChange={handleChange}
          placeholder={labelText}
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
