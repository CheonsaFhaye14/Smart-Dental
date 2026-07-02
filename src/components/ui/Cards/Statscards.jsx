import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./StatsCards.css";

/**
 * Reusable stats cards.
 *
 * Usage:
 * <StatsCards
 *   loading={loading}
 *   stats={[
 *     { key: "total", label: "Total Users", value: total, icon: faUsers, variant: "default" },
 *     { key: "active", label: "Active", value: active, icon: faUserCheck, variant: "active" },
 *   ]}
 * />
 */
export default function StatsCards({ stats = [], loading = false }) {
  return (
    <div className="stats-cards">
      {stats.map((stat) => (
        <div key={stat.key} className={`stat-card stat-card--${stat.variant || "default"}`}>
          <div className="stat-card__icon">
            <FontAwesomeIcon icon={stat.icon} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">
              {loading ? "—" : stat.value}
            </span>
            <span className="stat-card__label">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}