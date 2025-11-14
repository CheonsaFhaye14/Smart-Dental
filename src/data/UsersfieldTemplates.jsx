// fieldTemplates.js
export const fieldTemplates = { 
  Admin: [
    { name: "firstname", placeholder: "First Name", required: true },
    { name: "lastname", placeholder: "Last Name", required: true },
    { name: "username", placeholder: "Username", required: true },
    { name: "email", placeholder: "Email", type: "email", required: true },
    { name: "password", placeholder: "Password", type: "password", required: true },
  ],
  Patient: [
    { name: "firstname", placeholder: "First Name", required: true },
    { name: "lastname", placeholder: "Last Name", required: true },
    { name: "username", placeholder: "Username", required: true },
    { name: "email", placeholder: "Email", type: "email", required: true },
    { name: "password", placeholder: "Password", type: "password", required: true },
    { name: "gender", placeholder: "Gender", type: "select", options: ["Female", "Male"], required: true},
    { name: "birthday", placeholder: "Birthday", type: "date" , required: true},
    { name: "address", placeholder: "Address" , required: true},
    { name: "contact", placeholder: "Contact" , required: true},
    { name: "allergy", placeholder: "Allergy" },
    { name: "medicalHistory", placeholder: "Medical History" },
  ],
  Dentist: [
    { name: "firstname", placeholder: "First Name", required: true },
    { name: "lastname", placeholder: "Last Name", required: true },
    { name: "username", placeholder: "Username", required: true },
    { name: "email", placeholder: "Email", type: "email", required: true },
    { name: "password", placeholder: "Password", type: "password", required: true },
    { name: "birthday", placeholder: "Birthday", type: "date" , required: true},
    { name: "address", placeholder: "Address" , required: true},
    { name: "contact", placeholder: "Contact" , required: true},
    { name: "gender", placeholder: "Gender", type: "select", options: ["Female", "Male"] , required: true},
  ],
};

