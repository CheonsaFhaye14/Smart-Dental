import React, { useState } from "react";
import Table from "../../components/ui/Table/Table";
import AppSelect from "../../components/common/AppSelect";

const SAMPLE_USERS = [
  { id: 1, username: "jdoe", firstname: "John", lastname: "Doe", email: "jdoe@gmail.com", role: "patient", is_active: true },
  { id: 2, username: "asmith", firstname: "Anna", lastname: "Smith", email: "asmith@gmail.com", role: "dentist", is_active: true },
  { id: 3, username: "brock", firstname: "Bruce", lastname: "Rock", email: "brock@gmail.com", role: "patient", is_active: false },
  { id: 4, username: "mjane", firstname: "Mary", lastname: "Jane", email: "mjane@gmail.com", role: "patient", is_active: true },
  { id: 5, username: "tsmith", firstname: "Tom", lastname: "Smith", email: "tsmith@gmail.com", role: "dentist", is_active: false },
  { id: 6, username: "admin1", firstname: "Admin", lastname: "One", email: "admin@gmail.com", role: "admin", is_active: true },
];

const columns = [
  { header: "Username", accessor: "username" },
  { header: "First Name", accessor: "firstname" },
  { header: "Last Name", accessor: "lastname" },
  { header: "Email", accessor: "email" },
  {
    header: "Role",
    accessor: "role",
    render: (row) => (
      <span className={`badge badge-${row.role}`}>{row.role}</span>
    ),
  },
  {
    header: "Status",
    accessor: "is_active",
    render: (row) => (
      <span className={`badge ${row.is_active ? "badge-active" : "badge-inactive"}`}>
        {row.is_active ? "Active" : "Inactive"}
      </span>
    ),
    filterFn: (cellValue, filterValue) => {
      if (filterValue === "true") return cellValue === true;
      if (filterValue === "false") return cellValue === false;
      return true;
    },
  },
];

export default function Users() {
  const [filters, setFilters] = useState({});

  const handleEdit = (row) => console.log("Edit:", row);
  const handleDelete = (row) => console.log("Delete:", row);
  const handleToggleActive = (row) => console.log("Toggle active:", row);

  return (
    <div className="users-page">
      <div className="same-row">
        <h1>Users</h1>
      </div>

      {/* ❌ removed the separate filters div — now inside Table toolbar */}

      <Table
        columns={columns}
        data={SAMPLE_USERS}
        filters={filters}
        setFilters={setFilters}
        rowsPerPage={5}

   
        renderFilters={(filters, setFilters) => (
          <>
            <AppSelect
              label="Role"
              value={filters.role || ""}
              onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
              options={[
                { value: "patient", label: "Patient" },
                { value: "dentist", label: "Dentist" },
                { value: "admin", label: "Admin" },
              ]}
            />
            <AppSelect
              label="Status"
              value={filters.is_active || ""}
              onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value }))}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
            />
          </>
        )}

        renderActions={(row) => (
          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
            <button
              onClick={() => handleEdit(row)}
              style={{ background: "#75c5f1", color: "#fff", border: "none", borderRadius: "50px", padding: "4px 12px", cursor: "pointer", fontFamily: "Varela Round", fontSize: "0.8rem" }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleToggleActive(row)}
              style={{ background: row.is_active ? "#ffd6d6" : "#d6f5d6", color: row.is_active ? "#c0392b" : "#27ae60", border: "none", borderRadius: "50px", padding: "4px 12px", cursor: "pointer", fontFamily: "Varela Round", fontSize: "0.8rem" }}
            >
              {row.is_active ? "🔒 Deactivate" : "🔓 Activate"}
            </button>
            <button
              onClick={() => handleDelete(row)}
              style={{ background: "#ffd6d6", color: "#c0392b", border: "none", borderRadius: "50px", padding: "4px 12px", cursor: "pointer", fontFamily: "Varela Round", fontSize: "0.8rem" }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      />

      <style>{`
        .badge {
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'Varela Round', sans-serif;
        }
        .badge-patient  { background: #e0f3ff; color: #2a7ab8; }
        .badge-dentist  { background: #d6f5e3; color: #1a7a4a; }
        .badge-admin    { background: #f5e6d6; color: #7a4a1a; }
        .badge-active   { background: #d6f5d6; color: #27ae60; }
        .badge-inactive { background: #ffd6d6; color: #c0392b; }
      `}</style>
    </div>
  );
}