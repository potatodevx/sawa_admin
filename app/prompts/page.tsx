"use client";

import { FormEvent, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAdminData } from "../providers/AdminDataProvider";
import styles from "./page.module.css";

const CATEGORY_OPTIONS = [
  { value: "chat_shortcut", label: "Personal Chat (couple ↔ couple)" },
  { value: "group_prompt",  label: "Group Chat (community groups)" },
];

const CATEGORY_LABELS: Record<string, string> = {
  chat_shortcut: "Personal Chat",
  group_prompt:  "Group Chat",
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  chat_shortcut: { bg: "#e8f4fd", color: "#1a6fa8", border: "#b3d9f5" },
  group_prompt:  { bg: "#f0faf0", color: "#2a7a3a", border: "#b2ddb9" },
};

export default function PromptsPage() {
  const { prompts, addPrompt, togglePrompt, deletePrompt } = useAdminData();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("chat_shortcut");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteContent, setDeleteContent] = useState("");
  const [activeTab, setActiveTab] = useState<"chat_shortcut" | "group_prompt">("chat_shortcut");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    addPrompt(text.trim(), category);
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

  const filtered = prompts.filter((p) => (p.category || "chat_shortcut") === activeTab);

  return (
    <AdminShell
      title="Chat Prompts"
      subtitle="Manage quick-send message shortcuts shown in personal chats and group chats separately."
    >
      <div className={styles.layout}>
        {/* Add form */}
        <form className="glassCard" onSubmit={onSubmit}>
          <h3 className="sectionTitle">New Prompt</h3>
          <div className="stack" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {CATEGORY_OPTIONS.map((opt) => {
                const c = CATEGORY_COLORS[opt.value];
                const selected = category === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    style={{
                      flex: 1,
                      padding: "0.6rem 1rem",
                      borderRadius: "10px",
                      border: `2px solid ${selected ? c.border : "var(--stroke)"}`,
                      background: selected ? c.bg : "white",
                      color: selected ? c.color : "var(--ink-muted)",
                      fontWeight: selected ? 700 : 400,
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      transition: "all 0.15s",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <input
              className="control"
              placeholder={
                category === "group_prompt"
                  ? "e.g. 'What's the plan for this weekend?'"
                  : "e.g. 'Coffee sometime?'"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              style={{ color: "var(--ink)", background: "white" }}
            />
            <button className="buttonPrimary" type="submit">
              Add to App
            </button>
          </div>
        </form>

        {/* Prompt list with tabs */}
        <section className="glassCard">
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
            {CATEGORY_OPTIONS.map((opt) => {
              const count = prompts.filter((p) => (p.category || "chat_shortcut") === opt.value).length;
              const c = CATEGORY_COLORS[opt.value];
              const active = activeTab === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setActiveTab(opt.value as any)}
                  style={{
                    padding: "0.45rem 1.1rem",
                    borderRadius: "99px",
                    border: `1.5px solid ${active ? c.border : "var(--stroke)"}`,
                    background: active ? c.bg : "transparent",
                    color: active ? c.color : "var(--ink-muted)",
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    fontSize: "0.88rem",
                  }}
                >
                  {CATEGORY_LABELS[opt.value]} ({count})
                </button>
              );
            })}
          </div>

          <div className="stack" style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {filtered.map((prompt) => {
              const c = CATEGORY_COLORS[prompt.category || "chat_shortcut"];
              return (
                <article key={prompt.id} className={styles.promptRow}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "1.05rem", color: "var(--ink)" }}>
                      {prompt.title}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "0.2rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        background: c.bg,
                        color: c.color,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      {CATEGORY_LABELS[prompt.category || "chat_shortcut"]}
                    </span>
                  </div>
                  <div className={styles.promptActions}>
                    <button
                      className="buttonGhost"
                      onClick={() => togglePrompt(prompt.id)}
                      type="button"
                      style={{
                        borderColor: prompt.active ? "var(--accent-cool)" : "var(--stroke)",
                        color: prompt.active ? "var(--accent-cool)" : "var(--ink-muted)",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                      }}
                    >
                      {prompt.active ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => openDeleteModal(prompt.id, prompt.title)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent-orange)",
                        cursor: "pointer",
                        fontSize: "1.4rem",
                        marginLeft: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <i className="mdi mdi-delete-outline"></i>
                    </button>
                  </div>
                </article>
              );
            })}
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--ink-muted)", padding: "2rem" }}>
                No {CATEGORY_LABELS[activeTab].toLowerCase()} prompts yet. Use the form above to add some.
              </p>
            )}
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Prompt"
        message={`Are you sure you want to delete "${deleteContent}"? This will remove it for all users.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </AdminShell>
  );
}
