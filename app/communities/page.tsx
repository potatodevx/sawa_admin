"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";

export default function CommunitiesPage() {
  const { communities, deleteCommunity } = useAdminData();
  const [minMembers, setMinMembers] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const visibleCommunities = useMemo(
    () => communities.filter((community) => community.members >= minMembers),
    [communities, minMembers],
  );

  const openDeleteModal = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteCommunity(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <AdminShell
      title="Community Control"
      subtitle="Understand where users gather and which communities are scaling fastest."
    >
      <div className="glassCard" style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "grid", gap: "0.55rem" }}>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Minimum members: {minMembers}</span>
          <input
            type="range"
            min={0}
            max={500}
            value={minMembers}
            onChange={(event) => setMinMembers(Number(event.target.value))}
            style={{ accentColor: 'var(--accent-cool)' }}
          />
        </label>
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">
          Communities ({visibleCommunities.length})
        </h3>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Members</th>
              <th>Growth</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCommunities.map((community) => (
              <tr key={community.id}>
                <td style={{ fontWeight: 600 }}>{community.name}</td>
                <td style={{ color: 'var(--ink-muted)' }}>{community.category}</td>
                <td>{community.members}</td>
                <td>
                  <span className="chip chipActive">
                    +{community.growthRate}%
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => openDeleteModal(community.id, community.name)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--accent-orange)', 
                      cursor: 'pointer',
                      fontSize: '1.4rem'
                    }}
                    title="Delete Community"
                  >
                    <i className="mdi mdi-delete-outline"></i>
                  </button>
                </td>
              </tr>
            ))}
            {visibleCommunities.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)' }}>
                  No communities found with at least {minMembers} members.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Community"
        message={`Are you sure you want to delete the "${deleteName}" community? This will remove all associated member data and cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </AdminShell>
  );
}
