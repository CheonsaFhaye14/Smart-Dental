export const validateUserForm = (form, mode = "add") => {
  const errors = {};

    // ── Name ─────────────────────────────────────────────
    if (!form.firstname?.trim())
    errors.firstname = "First name is required.";
    else if (form.firstname.trim().length < 2)
    errors.firstname = "First name must be at least 2 characters.";
    else if (!/^[a-zA-Z\s]+$/.test(form.firstname.trim()))
    errors.firstname = "First name must contain letters only.";

    if (!form.lastname?.trim())
    errors.lastname = "Last name is required.";
    else if (form.lastname.trim().length < 2)
    errors.lastname = "Last name must be at least 2 characters.";
    else if (!/^[a-zA-Z\s]+$/.test(form.lastname.trim()))
    errors.lastname = "Last name must contain letters only.";

  // ── Username ──────────────────────────────────────────
  if (!form.username?.trim())
    errors.username = "Username is required.";
  else if (form.username.trim().length < 3)
    errors.username = "Username must be at least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim()))
    errors.username = "Username can only contain letters, numbers, and underscores.";

  // ── Email ─────────────────────────────────────────────
  if (!form.email?.trim())
    errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
    errors.email = "Invalid email format.";

  // ── Role — only required in add mode ─────────────────
  if (mode === "add") {
    if (!form.role)
      errors.role = "Role is required.";
    else if (!["patient", "dentist", "admin"].includes(form.role))
      errors.role = "Invalid role selected.";
  }

  // ── Contact — PH number format ────────────────────────
  if (form.contact?.trim()) {
    const raw = form.contact.trim().replace(/[\s-]/g, "");
    const phRegex = /^(\+63|0)?9\d{9}$/;
    if (!phRegex.test(raw))
      errors.contact = "Invalid PH number. Use 09XXXXXXXXX or +639XXXXXXXXX.";
  }

// ── Birthdate ─────────────────────────────────────────
if (form.birthdate) {
  const dob = new Date(form.birthdate);
  const today = new Date();

  if (isNaN(dob.getTime())) {
    errors.birthdate = "Invalid date.";
  } else if (dob >= today) {
    errors.birthdate = "Birthdate must be in the past.";
  } else {
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // ✅ Accurate age accounting for month/day
    const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
      ? age - 1
      : age;

    if (exactAge < 5)
      errors.birthdate = "Patient must be at least 5 years old.";
    else if (exactAge > 120)
      errors.birthdate = "Invalid birthdate.";
  }
}

// ── Gender ────────────────────────────────────────────
const validGenders = ["male", "female", "other"];

if (form.role === "patient") {
  if (!form.gender)
    errors.gender = "Gender is required for patients.";
  else if (!validGenders.includes(form.gender))
    errors.gender = "Invalid gender selected.";
} else {
  if (form.gender && !validGenders.includes(form.gender))
    errors.gender = "Invalid gender selected.";
}

  return errors;
};

export const hasUserErrors = (errors) => Object.keys(errors).length > 0;