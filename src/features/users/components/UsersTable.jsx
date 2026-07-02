import React from "react";
import Table from "../../../components/ui/Table/Table";
import AppSelect from "../../../components/common/AppSelect";
import ActionButtons from "../../../components/ui/Buttons/ActionButtons";
import { faPen, faTrash, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import Badge from "../../../components/ui/Badge";
import "./UsersTable.css";
import UserDetails from "./UserDetails";

const columns = [
  {
    header: "Name",
    accessor: "firstname",
    render: (row) => (
      <div className="user-name-cell">
        <span className="user-fullname">
          {row.firstname} {row.lastname}
        </span>
        <span className="user-username">@{row.username}</span>
      </div>
    ),
  },
  { header: "Email", accessor: "email" },
  {
    header: "Role",
    accessor: "role",
    render: (row) => <Badge variant={row.role}>{row.role}</Badge>,
  },
  {
    header: "Status",
    accessor: "is_active",
    render: (row) => (
      <Badge variant={row.is_active ? "active" : "inactive"}>
        {row.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
    filterFn: (cellValue, filterValue) => {
      if (filterValue === "true") return cellValue === true;
      if (filterValue === "false") return cellValue === false;
      return true;
    },
  },
  // ❌ removed the _viewIndicator column entirely
];

export default function UsersTable({
  users,        // ✅ add this
  loading,
  filters,
  setFilters,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <Table
      columns={columns}
      data={users}
      filters={filters}
      setFilters={setFilters}
      rowsPerPage={5}
      emptyMessage={loading ? "Loading users..." : "No users found"}
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
        <ActionButtons
          row={row}
          actions={[
            { key: "edit", icon: faPen, variant: "edit", onClick: onEdit },
            {
              key: "toggle",
              label: row.is_active ? "Deactivate" : "Activate",
              icon: row.is_active ? faLock : faLockOpen,
              variant: row.is_active ? "warning" : "success",
              onClick: onToggleActive,
            },
            { key: "delete", icon: faTrash, variant: "danger", onClick: onDelete },
          ]}
        />
      )}
      renderModal={(row, onClose) => {
        // ✅ always get the freshest version of this user from the users array
        const freshRow = users.find((u) => u.id === row.id) ?? row;

        return (
          <UserDetails
            user={freshRow}
            onClose={onClose}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        );
      }}
    />
  );
}