import React from "react";
import {
  faUsers,
  faUserCheck,
  faUserShield,
  faTooth,
  faUserInjured,
} from "@fortawesome/free-solid-svg-icons";
import StatsCards from "../../../components/ui/Cards/Statscards"; // ✅ keep this import

export default function UsersStatsCards({ users = [], loading }) {
  const total = users.length;
  const active = users.filter((u) => u.is_active).length;
  const admins = users.filter((u) => u.role === "admin").length;
  const dentists = users.filter((u) => u.role === "dentist").length;
  const patients = users.filter((u) => u.role === "patient").length;

  const stats = [
    { key: "total", label: "Total Users", value: total, icon: faUsers, variant: "default" },
    { key: "active", label: "Active", value: active, icon: faUserCheck, variant: "active" },
    { key: "admins", label: "Admins", value: admins, icon: faUserShield, variant: "admin" },
    { key: "dentists", label: "Dentists", value: dentists, icon: faTooth, variant: "dentist" },
    { key: "patients", label: "Patients", value: patients, icon: faUserInjured, variant: "patient" },
  ];

  return <StatsCards stats={stats} loading={loading} />; // ✅ just delegate to the reusable one
}