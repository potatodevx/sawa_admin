"use client";

import { FormEvent, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";
import styles from "./page.module.css";

export default function PromptsPage() {
  const { prompts, addPrompt, togglePrompt, deletePrompt } = useAdminData();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteContent, setDeleteContent] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    addPrompt(text.trim(), "chat_shortcut");
    setText("");
  };

  const openDeleteModal = (id: string, content: string) => {
    setDeleteId(id);
    setDeleteContent(content);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deletePrompt?.(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <AdminShell
      title="Chat Prompts"
      subtitle="Manage the quick-send messages available to users in chat."
    >
      <div className={styles.layout}>
        <form className="glassCard" onSubmit={onSubmit}>
          <h3 className="sectionTitle">New Shortcut</h3>
          <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              className="control"
              placeholder="Message text (e.g. 'Coffee sometime?')"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              style={{ color: 'var(--ink)', background: 'white' }}
            />
            <button className="buttonPrimary" type="submit">
              Add to App
            </button>
          </div>
        </form>

        <section className="glassCard">
          <h3 className="sectionTitle">Active Shortcuts ({prompts.length})</h3>
          <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {prompts.map((prompt) => (
              <article key={prompt.id} className={styles.promptRow}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)' }}>{prompt.title}</p>
                </div>
                <div className={styles.promptActions}>
                  <button
                    className="buttonGhost"
                    onClick={() => togglePrompt(prompt.id)}
                    type="button"
                    style={{ 
                      borderColor: prompt.active ? 'var(--accent-cool)' : 'var(--stroke)',
                      color: prompt.active ? 'var(--accent-cool)' : 'var(--ink-muted)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px'
                    }}
                  >
                    {prompt.active ? "Active" : "Paused"}
                  </button>
                  <button
                    onClick={() => openDeleteModal(prompt.id, prompt.title)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--accent-orange)', 
                      cursor: 'pointer',
                      fontSize: '1.4rem',
                      marginLeft: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="mdi mdi-delete-outline"></i>
                  </button>
                </div>
              </article>
            ))}
            {prompts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '2rem' }}>
                No shortcuts found. Use the form above to add some.
              </p>
            )}
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Shortcut"
        message={`Are you sure you want to delete "${deleteContent}"? This will remove it from all users' shortcut lists.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </AdminShell>
  );
}
