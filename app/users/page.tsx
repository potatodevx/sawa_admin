"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";

export default function UsersPage() {
  const { users } = useAdminData();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "flagged"
  >("all");
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter;
        const text = `${user.name} ${user.city} ${user.phone}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
      }),
    [users, statusFilter, query],
  );

  return (
    <AdminShell
      title="User Management"
      subtitle="Inspect user accounts, status and onboarding footprint."
    >
      <div className="glassCard" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            gap: "0.7rem",
          }}
        >
          <input
            className="control"
            placeholder="Search by name, city or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="control"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">Users ({filteredUsers.length})</h3>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.city}</td>
                <td>{formatDate(user.joinedAt)}</td>
                <td>
                  <span className={statusClass(user.status)}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
