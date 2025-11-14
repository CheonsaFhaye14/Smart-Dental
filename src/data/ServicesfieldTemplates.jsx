export const serviceFieldTemplates = { 
  Category: [
    { name: "name", placeholder: "Category Name", required: true },

    { 
      name: "services", 
      placeholder: "Add Existing Services", 
      type: "select-multiple",
      options: [], // dynamically filled later
      required: false,
      showIf: (_form, field) => field.options && field.options.length > 0
      // ^ this will hide the field when no services exist
    },
  ],

  Service: [
    { name: "name", placeholder: "Service Name", required: true },
    { name: "description", placeholder: "Description", type: "textarea" },
    { name: "price", placeholder: "Price", type: "number", required: true },

    { 
      name: "allow_installment", 
      placeholder: "Allow Installment", 
      type: "select", 
      options: ["Yes", "No"], 
      required: true 
    },

    { 
      name: "installment_times", 
      placeholder: "Installment Count", 
      type: "number",
      showIf: (form) => form.allow_installment === "Yes",
      requiredIf: (form) => form.allow_installment === "Yes"
    },

    { 
      name: "installment_interval", 
      placeholder: "Installment Interval",
      type: "select",
      options: ["weekly", "monthly", "custom"],
      showIf: (form) => form.allow_installment === "Yes",
      requiredIf: (form) => form.allow_installment === "Yes"
    },

    {
      name: "custom_interval_days",
      placeholder: "Custom Interval (days)",
      type: "number",
      showIf: (form) => 
        form.allow_installment === "Yes" && form.installment_interval === "custom",
      requiredIf: (form) => 
        form.allow_installment === "Yes" && form.installment_interval === "custom"
    },

    { 
      name: "category", 
      placeholder: "Select Category", 
      type: "select", 
      options: [], 
      required: false 
    }
  ],
};
