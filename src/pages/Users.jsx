import { useState, useEffect } from "react";
import AddChoice from "../components/AddChoice";
import AddModal from "../components/AddModal";
import Table from "../components/Table";
import { getAllUsers } from "../services/GetAllUsers";
import { useAdminAuth } from "../hooks/useAdminAuth"; // your custom hook
import { addUser } from "../services/AddUsersApi";
import MessageModal from "../components/MessageModal";
import { deleteUser } from "../services/DeleteApi";
import { fieldTemplates } from "../data/UsersfieldTemplates"; // adjust path
import QuestionModal from "../components/QuestionModal";
import EditUserModal from "../components/EditUserModal";
import { UsersOwnField } from "../data/UsersOwnField";
import { editUser } from "../services/EditUsersApi";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "success" or "error"
  const [QuestionOpen, setQuestionOpen] = useState(false);
  const [QuestionData, setQuestionData] = useState({
  question: "",
  choices: [],
  onSelect: () => {}
});
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);



  const { token } = useAdminAuth(); // get token from context

  const choices = ["Admin", "Dentist", "Patient"];

  const handleSelect = (choice) => {
    setSelected(choice);
    setOpen(false);
    setModalOpen(true);
  };

  // Fetch users whenever the token changes
useEffect(() => {
  if (!token) return;

  const fetchUsers = async (currentToken) => {
    setLoading(true);
    setError("");

    try {
      if (!currentToken) {
        console.warn("No token available for fetching users");
        setError("You must be logged in as admin to fetch users.");
        setLoading(false);
        return;
      }

      // Call API with current token
      const res = await getAllUsers(currentToken);

      if (res.success) {
        const users = res.data;

        // Count users by type
        const userTypeCount = users.reduce((acc, user) => {
          const type = user.usertype || "unknown";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        console.log("Token used for fetchUsers:", currentToken);
        console.log(`Total users: ${users.length} | User count by type:`, userTypeCount);

        // Enhance each user with action buttons
        const usersWithActions = users.map(user => ({
          ...user,
         onEdit: () => {
  setSelectedUser(user); 
  console.log(user)
  setEditModalOpen(true);
},

          onDelete: () => {
  setQuestionOpen(true);
  setQuestionData({
    question: `Are you sure you want to delete ${user.firstname || user.username}?`,
    choices: ["Yes"],
    onSelect: async (choice) => {
      setQuestionOpen(false);
      if (choice !== "Yes") return;

      try {
        const deleteRes = await deleteUser(user.id, currentToken);

        if (deleteRes.success) {
          setUsers(prev => prev.filter(u => u.id !== user.id));
          setMessageType("success");
        } else {
          setMessageType("error");
        }

        setMessage(deleteRes.message);
      } catch{
        setMessageType("error");
        setMessage("Failed to delete user.");
      }
    }
  });
}
        }));

        setUsers(usersWithActions);
      } else {
        console.error("API returned error:", res.message);
        setError(res.message);
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers(token); // ✅ pass token here
}, [token]);





 // Helper function to capitalize first letter
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const columns = [
  {
    header: "Name",
    accessor: "firstname",
    render: (row) => {
      const first = row.firstname ? capitalize(row.firstname) : "Unknown";
      const last = row.lastname ? capitalize(row.lastname) : "";
      return `${first} ${last}`.trim();
    },
  },
  { 
    header: "Email", 
    accessor: "email",
    render: (row) => row.email || "Unknown"
  },
  { 
    header: "User Type",
    accessor: "usertype",
    render: (row) => capitalize(row.usertype || "Unknown")
  }, 
];


const handleAddUser = async (formData) => {
  if (!token) {
    setMessageType("error");
    setMessage("You must be logged in as admin.");
    return;
  }

  try {

    // ✅ Normalize fields before sending to API
    if (formData.birthday) {
      formData.birthdate = formData.birthday;
      delete formData.birthday;
    }

    if (formData.medicalHistory !== undefined) {
      formData.medicalhistory = formData.medicalHistory;
      delete formData.medicalHistory;
    }

    if (formData.allergy !== undefined) {
      formData.allergies = formData.allergy;
      delete formData.allergy;
    }

    const res = await addUser(token, formData);

    if (res.success) {
      const refresh = await getAllUsers(token);
      if (refresh.success) {
        setUsers(refresh.data);
      }

      setMessageType("success");
      setMessage(`✅ ${formData.usertype} added successfully!`);
      setModalOpen(false);
    } else {
      setMessageType("error");
      setMessage(res.message || "Something went wrong.");
    }

  } catch (err) {
    console.error("handleAddUser error:", err);
    setMessageType("error");
    setMessage("Failed to add user.");
  }
};


const handleEditUser = async (updatedData) => {
  if (!token) {
    setMessageType("error");
    setMessage("You must be logged in as admin.");
    return;
  }

  try {
    const cleanData = { ...updatedData };

    // ✅ Normalize fields before sending to API
    if (cleanData.birthday) {
      cleanData.birthdate = cleanData.birthday;
      delete cleanData.birthday;
    }

    if (cleanData.medicalHistory !== undefined) {
      cleanData.medicalhistory = cleanData.medicalHistory;
      delete cleanData.medicalHistory;
    }

    if (cleanData.allergy !== undefined) {
      cleanData.allergies = cleanData.allergy;
      delete cleanData.allergy;
    }

    // ❌ Don't send ID in payload
    const userId = cleanData.id;
    delete cleanData.id;

    console.log("📦 Updating user:", userId, cleanData);

    const res = await editUser(token, userId, cleanData);

    if (res.success) {
      // ✅ Update UI instantly
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, ...cleanData } : u))
      );

      setMessageType("success");
      setMessage("✅ User updated successfully!");
      setEditModalOpen(false);
    } else {
      setMessageType("error");
      setMessage(res.message || "Failed to update user.");
    }

  } catch (err) {
    console.error("handleEditUser error:", err);
    setMessageType("error");
    setMessage("Failed to update user.");
  }
};

  return (
    <>
      <div className="same-row">
        <h1>User Management</h1>
        <div style={{ position: "relative" }}>
          <button className="btn-add" onClick={() => setOpen((prev) => !prev)}>
            +
          </button>
          {open && <AddChoice choices={choices} onSelect={handleSelect} />}
        </div>
      </div>

       {modalOpen && (
        <AddModal
         datatype="usertype"
          selected={selected}
          choices={choices}
          fields={fieldTemplates}       // <-- pass all user fields
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddUser}      // <-- receives validated formValues
        />
      )}

     <EditUserModal
  isOpen={editModalOpen}
  data={selectedUser}
  fields={UsersOwnField[selectedUser?.usertype?.charAt(0).toUpperCase() + selectedUser?.usertype?.slice(1)]}
  onSubmit={handleEditUser}
  onClose={() => setEditModalOpen(false)}
/>



<QuestionModal
  isOpen={QuestionOpen}
  question={QuestionData.question}
  choices={QuestionData.choices}
  onSelect={QuestionData.onSelect}
  onClose={() => setQuestionOpen(false)}
/>


      <div>
        {loading && <p>Loading users...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <Table columns={columns} data={users} filters={filters} setFilters={setFilters} />
        )}
        <MessageModal
  message={message}
  type={messageType}
  onClose={() => setMessage("")}
/>

      </div>
    </>
  );
}
