import { useState, useEffect } from "react";
import AddChoice from "../components/AddChoice";
import AddModal from "../components/AddModal";
import Table from "../components/Table";
import { getAllUsers } from "../services/GetAllUsers";
import { useAdminAuth } from "../hooks/useAdminAuth"; // your custom hook
import { addUser } from "../services/AddUsersApi";
import MessageModal from "../components/MessageModal";
import { formatDateTime } from "../utils/formatDateTime"; // adjust path if needed
import { deleteUser } from "../services/DeleteApi";


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

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers(token);
      if (res.success) {
        // Enhance each user with action button callbacks
        const usersWithActions = res.data.map(user => ({
          ...user,
          // Only include buttons you want to show
          onEdit: () => console.log("Edit user", user),
          onDelete: async () => {
            if (!window.confirm(`Are you sure you want to delete ${user.firstname}?`)) return;

            const deleteRes = await deleteUser(user.id, token);
            if (deleteRes.success) {
              // Remove deleted user from state
              setUsers(prev => prev.filter(u => u.id !== user.id));
              // Show success message in MessageModal
              setMessageType("success");
              setMessage(deleteRes.message);
            } else {
              // Show error message in MessageModal
              setMessageType("error");
              setMessage(deleteRes.message);
            }
          },
          // Optional: onUndo if needed
          // onUndo: () => console.log("Undo delete", user)
        }));

        setUsers(usersWithActions);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
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
  {
    header: "Created At",
    accessor: "created_at",
    render: (row) => {
      if (!row.created_at) return "Unknown";
      return formatDateTime(row.created_at);
    }
  },
 
];


const handleAddUser = async (formData) => {
  if (!token) return;

  const res = await addUser(token, formData);

  if (res.success) {
    const refresh = await getAllUsers(token);
    if (refresh.success) setUsers(refresh.data);

    setMessageType("success");
    setMessage("✅ User added successfully!");
    setModalOpen(false);
  } else {
    setMessageType("error");
    setMessage(res.message || "Something went wrong.");
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
    selected={selected}
    choices={choices}
    onClose={() => setModalOpen(false)}
    onSubmit={handleAddUser}   // <-- pass here
  />
)}


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
