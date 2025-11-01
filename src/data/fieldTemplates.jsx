const fieldTemplates = {
  Admin: [
    { name: "firstname", placeholder: "First Name" },
    { name: "lastname", placeholder: "Last Name" },
    { name: "username", placeholder: "Username" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
  ],
  Patient: [
    { name: "firstname", placeholder: "First Name" },
    { name: "lastname", placeholder: "Last Name" },
    { name: "username", placeholder: "Username" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
    { 
      name: "gender", 
      placeholder: "Gender", 
      type: "select", 
      options: ["Female", "Male"] 
    },
    { name: "birthday", placeholder: "Birthday", type: "date" },
    { name: "address", placeholder: "Address" },
    { name: "contact", placeholder: "Contact" },
    { name: "allergy", placeholder: "Allergy" },
    { name: "medicalHistory", placeholder: "Medical History" },
  ],
  Dentist: [
    { name: "firstname", placeholder: "First Name" },
    { name: "lastname", placeholder: "Last Name" },
    { name: "username", placeholder: "Username" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
    { name: "birthday", placeholder: "Birthday", type: "date" },
    { name: "address", placeholder: "Address" },
    { name: "contact", placeholder: "Contact" },
    { 
      name: "gender", 
      placeholder: "Gender", 
      type: "select", 
      options: ["Female", "Male"] 
    },
  ],
  Service: [
    { name: "name", placeholder: "Service Name" },
    { name: "description", placeholder: "Description" },
    { name: "price", placeholder: "Price", type: "number" },
    { name: "allow_installment", placeholder: "Allow Installment", type: "checkbox" },
    { 
      name: "installment_times", 
      placeholder: "Installment Times", 
      type: "number",
      dependsOn: "allow_installment"
    },
    { 
      name: "installment_interval", 
      placeholder: "Installment Interval", 
      type: "select", 
      options: ["Monthly", "Weekly", "Custom"],
      dependsOn: "allow_installment"
    },
  ],
  Category: [
    { name: "categoryname", placeholder: "Category Name" },
    { 
      name: "servicename", 
      placeholder: "Select or Add Service", 
      type: "multi-select", 
      // To implement in component: 
      // - show all services linked to this category
      // - allow linking existing services
      // - allow adding a new service dynamically
    },
  ],
};

export default fieldTemplates;
