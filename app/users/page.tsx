"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";
import { UserItem } from "../lib/types";
import {
  Plus, X, Search, Filter, Phone, MapPin, Calendar, Quote, Heart, Target,
  ChevronRight, ArrowUpDown, MoreHorizontal, UserCheck, UserMinus,
  CreditCard, Zap
} from "lucide-react";

export default function UsersPage() {
  const { users, deleteUser } = useAdminData();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "flagged"
  >("all");
  const [query, setQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

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

  const openDeleteModal = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
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
              <th>Subscriptions</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontWeight: 600, color: 'var(--accent-cool)' }}>{user.name}</td>
                <td style={{ color: 'var(--ink-muted)' }}>{user.phone}</td>
                <td>{user.city}</td>
                <td>{formatDate(user.joinedAt)}</td>
                <td>
                  {user.status === "active" ? (
                    <span className="chip chipSuccess">Active</span>
                  ) : (
                    <span className="chip chipDanger">Inactive</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={(e) => openDeleteModal(e, user.id, user.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-orange)',
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                    title="Delete User"
                  >
                    <X size={18} />
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

      {selectedUser && (
        <div className="modalOverlay" onClick={() => setSelectedUser(null)}>
           <div className="modalContent profileModal" onClick={e => e.stopPropagation()}>
              <button className="modalClose" onClick={() => setSelectedUser(null)}>
                <X size={24} />
              </button>

              <div className="profileHeader">
                 <div className="profileAvatar">
                    {selectedUser.profile?.primaryPhoto ? (
                      <img src={selectedUser.profile.primaryPhoto} alt={selectedUser.name} />
                    ) : (
                      <div className="avatarPlaceholder">{selectedUser.name[0]}</div>
                    )}
                 </div>
                 <div className="profileMeta">
                    <h2>{selectedUser.name}</h2>
                    <div className="metaRow">
                      <MapPin size={14} /> <span>{selectedUser.city}</span>
                      <Phone size={14} style={{ marginLeft: '12px' }} /> <span>{selectedUser.phone}</span>
                    </div>
                    <div className="metaRow">
                      <Calendar size={14} /> <span>Joined {formatDate(selectedUser.joinedAt)}</span>
                    </div>
                 </div>
              </div>

              <div className="profileBody">
                 {selectedUser.profile?.bio && (
                   <div className="profileSection">
                      <div className="sectionLabel"><Quote size={14} /> About</div>
                      <p className="bioText">{selectedUser.profile.bio}</p>
                   </div>
                 )}

                 <div className="profileSection">
                    <div className="sectionLabel"><CreditCard size={14} /> Subscription</div>
                    <div className="profileGrid">
                       <div className="profileCard">
                          <div className="cardLabel"><Zap size={14} /> Tier</div>
                          <span className="token" style={{ borderColor: 'var(--accent-good)', color: 'var(--accent-good)' }}>Premium Gold</span>
                       </div>
                       <div className="profileCard">
                          <div className="cardLabel"><Calendar size={14} /> Renewal</div>
                          <span className="token">April 24, 2026</span>
                       </div>
                    </div>
                 </div>

                 <div className="profileGrid">
                    {selectedUser.profile?.answers?.map((ans, idx) => (
                      <div className="profileCard" key={idx}>
                         <div className="cardLabel">
                            {ans.question.includes('looking') || ans.question.includes('match') ? <Target size={14} /> : <Heart size={14} />}
                            {ans.question}
                         </div>
                         <div className="tokenRow">
                            {ans.options.map((opt, i) => (
                              <span key={i} className="token">{opt}</span>
                            ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        .profileModal {
          max-width: 700px;
          padding: 0;
          border: 1px solid var(--border);
        }
        .profileHeader {
          background: linear-gradient(to bottom right, var(--accent-cool), #6366f1);
          padding: 3rem 2rem 2.5rem;
          color: white;
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .profileAvatar {
          width: 90px;
          height: 90px;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.2);
          border: 3px solid rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        .profileAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatarPlaceholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
        }
        .profileMeta h2 {
          margin: 0 0 0.5rem;
          font-size: 1.8rem;
        }
        .metaRow {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          opacity: 0.9;
          margin-top: 0.3rem;
          flex-wrap: wrap;
        }
        .profileBody {
          padding: 2rem;
        }
        .profileSection {
          margin-bottom: 2rem;
        }
        .sectionLabel {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }
        .bioText {
          line-height: 1.6;
          color: var(--ink);
          font-size: 1rem;
        }
        .profileGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }
        .profileCard {
          background: var(--surface-2);
          padding: 1.2rem;
          border-radius: 16px;
          border: 1px solid var(--border);
        }
        .cardLabel {
          font-size: 0.75rem;
          color: var(--ink-muted);
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .tokenRow {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .token {
          background: var(--surface);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--ink);
          border: 1px solid var(--border);
        }
        @media (max-width: 600px) {
          .profileGrid {
            grid-template-columns: 1fr;
          }
          .profileHeader {
            flex-direction: column;
            text-align: center;
            padding: 3.5rem 1rem 2rem;
          }
        }
      `}</style>
    </AdminShell>
  );
}
