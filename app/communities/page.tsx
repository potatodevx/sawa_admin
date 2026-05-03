"use client";

import { useMemo, useState, useRef } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";
import { 
  Plus, X, Users, Shield, MapPin, Hash, 
  Trash2, Upload
} from "lucide-react";
import { CommunityItem } from "../lib/types";

export default function CommunitiesPage() {
  const { communities, deleteCommunity, addCommunity } = useAdminData();
  const [minMembers, setMinMembers] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  
  const [newComm, setNewComm] = useState({
    name: "",
    description: "",
    city: "",
    tags: "",
    coverImageUrl: ""
  });

  const visibleCommunities = useMemo(
    () => communities.filter((community) => community.memberCount >= minMembers),
    [communities, minMembers],
  );

  const openDeleteModal = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
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

  const handleCreate = async () => {
     if (!newComm.name || !newComm.city) return;
     await addCommunity({
        ...newComm,
        tags: newComm.tags.split(',').map(t => t.trim()).filter(Boolean)
     });
     setShowCreateModal(false);
     setNewComm({ name: "", description: "", city: "", tags: "", coverImageUrl: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewComm({ ...newComm, coverImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setNewComm({ ...newComm, coverImageUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <AdminShell
      title="Community Control"
      subtitle="Understand where users gather and which communities are scaling fastest."
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="glassCard" style={{ flex: 1, minWidth: '300px' }}>
          <label style={{ display: "grid", gap: "0.55rem" }}>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Minimum members: {minMembers}</span>
            <input
              type="range"
              min={0}
              max={500}
              value={minMembers}
              onChange={(event) => setMinMembers(Number(event.target.value))}
              style={{ accentColor: 'var(--accent-orange)' }}
            />
          </label>
        </div>
        
        <button 
          className="buttonPrimary" 
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: 'fit-content' }}
        >
          <Plus size={20} /> Create Community
        </button>
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
              <tr 
                key={community.id} 
                onClick={() => setSelectedCommunity(community)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{community.name}</td>
                <td style={{ color: 'var(--ink-muted)' }}>{community.category}</td>
                <td>{community.memberCount}</td>
                <td>
                  <span className="chip chipActive">
                    +{community.growthRate}%
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={(e) => openDeleteModal(e, community.id, community.name)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--ink-muted)', 
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                    title="Delete Community"
                  >
                    <X size={18} />
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

      {/* Community Detail Modal */}
      {selectedCommunity && (
        <div className="modalOverlay" onClick={() => setSelectedCommunity(null)}>
           <div className="modalContent detailModal" onClick={e => e.stopPropagation()}>
              <button className="modalClose" onClick={() => setSelectedCommunity(null)}>
                <X size={24} />
              </button>
              
              <div className="detailHero">
                 {selectedCommunity.coverImageUrl ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={selectedCommunity.coverImageUrl} alt={selectedCommunity.name} className="heroBg" />
                 ) : (
                   <div className="heroBgPlaceholder" />
                 )}
                 <div className="heroContent">
                    <h2>{selectedCommunity.name}</h2>
                    <div className="heroBadgeRow">
                       <span className="heroBadge"><MapPin size={12} /> {selectedCommunity.city}</span>
                       <span className="heroBadge"><Users size={12} /> {selectedCommunity.memberCount} Members</span>
                    </div>
                 </div>
              </div>

              <div className="detailBody">
                 {selectedCommunity.description && (
                   <div className="detailSection">
                      <p className="detailDesc">{selectedCommunity.description}</p>
                   </div>
                 )}

                 <div className="tagRow" style={{ marginBottom: '2rem' }}>
                    {selectedCommunity.tags.map(tag => (
                      <span key={tag} className="tag"><Hash size={12} /> {tag}</span>
                    ))}
                 </div>

                 <div className="splitLists">
                    <div className="listSection">
                       <h4 className="listTitle"><Shield size={16} color="var(--accent-orange)" /> Hosts</h4>
                       <div className="avatarList">
                          {selectedCommunity.hosts.length > 0 ? selectedCommunity.hosts.map(h => (
                            <div key={h.id} className="avatarItem" title={h.name}>
                               {h.photo
                                 // eslint-disable-next-line @next/next/no-img-element
                                 ? <img src={h.photo} alt={h.name} />
                                 : <div className="p">{h.name[0]}</div>}
                               <span>{h.name}</span>
                            </div>
                          )) : <p className="emptyState">No hosts assigned</p>}
                       </div>
                    </div>

                    <div className="listSection">
                       <h4 className="listTitle"><Users size={16} color="var(--accent-cool)" /> Members</h4>
                       <div className="avatarList">
                          {selectedCommunity.members.length > 0 ? selectedCommunity.members.map(m => (
                            <div key={m.id} className="avatarItem" title={m.name}>
                               {m.photo
                                 // eslint-disable-next-line @next/next/no-img-element
                                 ? <img src={m.photo} alt={m.name} />
                                 : <div className="p">{m.name[0]}</div>}
                               <span>{m.name}</span>
                            </div>
                          )) : <p className="emptyState">No members yet</p>}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="modalOverlay" onClick={() => setShowCreateModal(false)}>
           <div className="modalContent createModal" onClick={e => e.stopPropagation()}>
              <button className="modalClose" style={{ color: 'var(--ink)' }} onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </button>
              <h3 className="sectionTitle">New Community</h3>
              <div className="formGrid">
                 <div className="formGroup">
                    <label>Community Name*</label>
                    <input 
                      className="control" 
                      placeholder="e.g. Weekend Hikers"
                      value={newComm.name}
                      onChange={e => setNewComm({...newComm, name: e.target.value})}
                    />
                 </div>
                 <div className="formGroup">
                    <label>City*</label>
                    <input 
                      className="control" 
                      placeholder="e.g. Mumbai"
                      value={newComm.city}
                      onChange={e => setNewComm({...newComm, city: e.target.value})}
                    />
                 </div>
                 <div className="formGroup full">
                    <label>Description</label>
                    <textarea 
                      className="control" 
                      rows={3}
                      placeholder="Tell us what this community is about..."
                      value={newComm.description}
                      onChange={e => setNewComm({...newComm, description: e.target.value})}
                    />
                 </div>
                 <div className="formGroup full">
                    <label>Community Cover Image</label>
                    <div className="uploadControl">
                       {newComm.coverImageUrl ? (
                         <div className="imagePreview">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={newComm.coverImageUrl} alt="Preview" />
                            <button className="removeImgBtn" onClick={removeImage}>
                               <Trash2 size={14} />
                            </button>
                         </div>
                       ) : (
                         <button className="uploadPlaceholder" onClick={triggerUpload}>
                            <Upload size={24} />
                            <span>Upload Cover Photo</span>
                         </button>
                       )}
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         onChange={handleFileChange} 
                         hidden 
                         accept="image/*" 
                       />
                       <div className="urlInput">
                          <label>Or paste image URL</label>
                          <input 
                            className="control" 
                            placeholder="https://images..."
                            value={newComm.coverImageUrl}
                            onChange={e => setNewComm({...newComm, coverImageUrl: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>
                 <div className="formGroup full">
                    <label>Tags (comma separated)</label>
                    <input 
                      className="control" 
                      placeholder="hiking, fitness, outdoors"
                      value={newComm.tags}
                      onChange={e => setNewComm({...newComm, tags: e.target.value})}
                    />
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                 <button className="buttonGhost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                 <button className="buttonPrimary" onClick={handleCreate}>Create Community</button>
              </div>
           </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Community"
        message={`Are you sure you want to delete the "${deleteName}" community? This will remove all associated member data and cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />

      <style jsx>{`
        .detailModal {
          padding: 0;
          max-width: 800px;
        }
        .detailHero {
          height: 240px;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 2rem;
        }
        .heroBg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.6);
          z-index: 1;
        }
        .heroBgPlaceholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, var(--accent-orange), var(--accent-good));
          z-index: 1;
        }
        .heroContent {
          position: relative;
          z-index: 2;
          color: white;
        }
        .heroContent h2 {
          margin: 0 0 0.5rem;
          font-size: 2.2rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .heroBadgeRow {
          display: flex;
          gap: 0.8rem;
        }
        .heroBadge {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.8rem;
          border-radius: 99px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .detailBody {
          padding: 2rem;
        }
        .detailDesc {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 1.5rem;
        }
        .tagRow {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .tag {
          background: var(--surface-2);
          color: var(--ink-muted);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          border: 1px solid var(--border);
        }
        .splitLists {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .listTitle {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .avatarList {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .avatarItem {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
          border-radius: 12px;
          transition: background 0.2s;
        }
        .avatarItem:hover {
          background: var(--surface-2);
        }
        .avatarItem img {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          object-fit: cover;
        }
        .avatarItem .p {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .avatarItem span {
          font-size: 0.95rem;
          color: var(--ink);
        }
        .emptyState {
          font-size: 0.85rem;
          color: var(--ink-muted);
          font-style: italic;
        }
        .createModal {
          max-width: 600px;
          padding: 2.5rem;
        }
        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
          margin-top: 1.5rem;
        }
        .formGroup.full {
          grid-column: span 2;
        }
        .formGroup label {
          display: block;
          font-size: 0.85rem;
          color: var(--ink-muted);
          margin-bottom: 0.5rem;
        }
        .uploadControl {
          display: grid;
          gap: 1rem;
        }
        .uploadPlaceholder {
          width: 100%;
          height: 120px;
          border: 2px dashed var(--border);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--ink-muted);
          background: var(--bg-app);
          cursor: pointer;
          transition: all 0.2s;
        }
        .uploadPlaceholder:hover {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
          background: rgba(223, 85, 41, 0.05);
        }
        .imagePreview {
          width: 100%;
          height: 160px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }
        .imagePreview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .removeImgBtn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .removeImgBtn:hover {
          background: var(--accent-orange);
        }
        .urlInput {
          margin-top: 0.5rem;
        }
        @media (max-width: 600px) {
          .splitLists {
            grid-template-columns: 1fr;
          }
          .formGrid {
            grid-template-columns: 1fr;
          }
          .formGroup.full {
            grid-column: span 1;
          }
          .detailHero {
            height: 180px;
          }
          .heroContent h2 {
            font-size: 1.8rem;
          }
          .createModal {
            padding: 1.5rem;
          }
        }
      `}</style>
    </AdminShell>
  );
}
