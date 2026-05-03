"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate } from "../lib/format";
import { UserItem, CoupleItem } from "../lib/types";
import {
  X, Phone, MapPin, Calendar, Quote, Heart, Target,
  CreditCard, Zap, Users, User, Trash2
} from "lucide-react";

type StatusFilter = "all" | "active" | "inactive" | "flagged";

export default function UsersPage() {
  const { users, couples, deleteUser, deleteCouple } = useAdminData();
  const [viewMode, setViewMode] = useState<"couples" | "singles">("couples");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedCouple, setSelectedCouple] = useState<CoupleItem | null>(null);

  const filteredData = useMemo(() => {
    if (viewMode === "couples") {
      return couples.filter((c) => {
        const text = `${c.pairName} ${c.city}`.toLowerCase();
        return text.includes(query.toLowerCase());
      });
    } else {
      return users.filter((u) => {
        const matchesStatus = statusFilter === "all" || u.status === statusFilter;
        const text = `${u.name} ${u.city} ${u.phone}`.toLowerCase();
        return matchesStatus && text.includes(query.toLowerCase());
      });
    }
  }, [viewMode, users, couples, statusFilter, query]);

  const openDeleteModal = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setDeleteId(id);
    setDeleteName(name);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    if (viewMode === "couples") {
      await deleteCouple(deleteId);
    } else {
      await deleteUser(deleteId);
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <AdminShell
      title="User Management"
      subtitle="Inspect user accounts, status and onboarding footprint."
    >
      <div className="glassCard" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div className="toggleGroup">
             <button 
               className={`toggleBtn ${viewMode === 'couples' ? 'active' : ''}`}
               onClick={() => { setViewMode('couples'); setQuery(''); }}
             >
               <Users size={16} /> Couples
             </button>
             <button 
               className={`toggleBtn ${viewMode === 'singles' ? 'active' : ''}`}
               onClick={() => { setViewMode('singles'); setQuery(''); }}
             >
               <User size={16} /> Individual Users
             </button>
          </div>

          <div style={{ display: "flex", gap: "1rem", flex: 1, justifyContent: "flex-end" }}>
            <input
              className="control"
              placeholder={viewMode === 'couples' ? "Search couples..." : "Search users..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            {viewMode === 'singles' && (
              <select
                className="control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                style={{ maxWidth: '150px' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">
          {viewMode === 'couples' ? 'Couples' : 'Individual Users'} ({filteredData.length})
        </h3>
        <table className="dataTable">
          <thead>
            {viewMode === 'couples' ? (
              <tr>
                <th>Couple Name</th>
                <th>Partners</th>
                <th>City</th>
                <th>Compatibility</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            ) : (
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>City</th>
                <th>Joined</th>
                <th>Subscription</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {viewMode === 'couples' ? (
              (filteredData as CoupleItem[]).map((couple) => (
                <tr 
                  key={couple.id}
                  onClick={() => setSelectedCouple(couple)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{couple.pairName}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {couple.partners?.map((p) => (
                        <div key={p.id} style={{ fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                          <span style={{ color: 'var(--ink-muted)', marginLeft: '4px' }}>({p.phone})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{couple.city}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '40px', height: '4px', background: '#eee', borderRadius: '2px' }}>
                        <div style={{ width: `${couple.compatibilityScore}%`, height: '100%', background: 'var(--accent-good)', borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem' }}>{couple.compatibilityScore}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`chip ${couple.status === 'engaged' ? 'chipSuccess' : 'chipWarning'}`}>
                      {couple.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={(e) => openDeleteModal(e, couple.id, couple.pairName)}
                      className="actionBtn delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              (filteredData as UserItem[]).map((user) => (
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
                    <span className={`chip ${user.status === 'active' ? 'chipSuccess' : 'chipDanger'}`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={(e) => openDeleteModal(e, user.id, user.name)}
                      className="actionBtn delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={!!deleteId}
        title={viewMode === 'couples' ? "Delete Couple" : "Delete User"}
        message={viewMode === 'couples' 
          ? `Deleting the "${deleteName}" couple will PERMANENTLY remove both user accounts and all associated data. Continue?`
          : `Are you sure you want to delete "${deleteName}"? This action cannot be undone.`
        }
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
                      // eslint-disable-next-line @next/next/no-img-element
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

      {selectedCouple && (
        <div className="modalOverlay" onClick={() => setSelectedCouple(null)}>
           <div className="modalContent profileModal" onClick={e => e.stopPropagation()}>
              <button className="modalClose" onClick={() => setSelectedCouple(null)}>
                <X size={24} />
              </button>

              <div className="profileHeader" style={{ background: 'linear-gradient(to bottom right, var(--accent-orange), #f97316)' }}>
                 <div className="profileAvatar">
                    {selectedCouple.primaryPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedCouple.primaryPhoto} alt={selectedCouple.pairName} />
                    ) : (
                      <div className="avatarPlaceholder"><Users size={40} /></div>
                    )}
                 </div>
                 <div className="profileMeta">
                    <h2>{selectedCouple.pairName}</h2>
                    <div className="metaRow">
                      <MapPin size={14} /> <span>{selectedCouple.city}</span>
                      <Users size={14} style={{ marginLeft: '12px' }} /> <span>{selectedCouple.partners?.length || 0} Partners</span>
                    </div>
                    <div className="partnersBadgeRow">
                      {selectedCouple.partners?.map(p => (
                        <span key={p.id} className="partnerBadge">
                          <User size={10} /> {p.name}
                        </span>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="profileBody">
                 {selectedCouple.bio && (
                   <div className="profileSection">
                      <div className="sectionLabel"><Quote size={14} /> Our Story</div>
                      <p className="bioText">{selectedCouple.bio}</p>
                   </div>
                 )}

                 <div className="profileSection">
                    <div className="sectionLabel"><Target size={14} /> Compatibility</div>
                    <div className="profileCard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <div>
                          <p style={{ margin: 0, fontWeight: 600 }}>Active Relationship</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Status: {selectedCouple.status}</p>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-good)' }}>{selectedCouple.compatibilityScore}%</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ink-muted)' }}>Match Score</p>
                       </div>
                    </div>
                 </div>

                 <div className="profileGrid">
                    {selectedCouple.answers?.map((ans, idx) => (
                      <div className="profileCard" key={idx}>
                         <div className="cardLabel">
                            <Zap size={14} /> {ans.question}
                         </div>
                         <div className="tokenRow">
                            {ans.options.map((opt, i) => (
                              <span key={i} className="token" style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}>{opt}</span>
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
        .partnersBadgeRow {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.8rem;
          flex-wrap: wrap;
        }
        .partnerBadge {
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .toggleGroup {
          background: var(--surface-2);
          padding: 4px;
          border-radius: 12px;
          display: flex;
          gap: 2px;
          border: 1px solid var(--border);
        }
        .toggleBtn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .toggleBtn.active {
          background: white;
          color: var(--accent-cool);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .actionBtn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .actionBtn.delete {
          color: var(--accent-orange);
        }
        .actionBtn:hover {
          background: var(--surface-2);
        }
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
