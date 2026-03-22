"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";

export default function UsersPage() {
  const { users, deleteUser } = useAdminData();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "flagged"
  >("all");
  const [query, setQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

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

  const openDeleteModal = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteUser(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <AdminShell
      title="User Management"
      subtitle="Inspect user accounts, status and onboarding footprint."
    >
      <div className="glassCard" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: 'wrap'
          }}
        >
          <input
            className="control"
            placeholder="Search by name, city or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 2, minWidth: '200px' }}
          />
          <select
            className="control"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            style={{ flex: 1, minWidth: '150px' }}
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
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td style={{ color: 'var(--ink-muted)' }}>{user.phone}</td>
                <td>{user.city}</td>
                <td>{formatDate(user.joinedAt)}</td>
                <td>
                  <span className={statusClass(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => openDeleteModal(user.id, user.name)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--accent-orange)', 
                      cursor: 'pointer',
                      fontSize: '1.4rem'
                    }}
                    title="Delete User"
                  >
                    <i className="mdi mdi-delete-outline"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)' }}>
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteName}"? This action is permanent and will remove all their data from the system.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </AdminShell>
  );
}
