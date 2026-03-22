"use client";

import { FormEvent, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";
import styles from "./page.module.css";

export default function PromptsPage() {
  const { prompts, addPrompt, togglePrompt } = useAdminData();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Connection");
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !question.trim()) {
      return;
    }

    addPrompt({
      title: title.trim(),
      category,
      question: question.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setTitle("");
    setQuestion("");
    setTags("");
  };

  return (
    <AdminShell
      title="Prompt Management"
      subtitle="Create and control prompts visible in the SAWA app."
    >
      <div className={styles.layout}>
        <form className="glassCard" onSubmit={onSubmit}>
          <h3 className="sectionTitle">Add New Prompt</h3>
          <div className="stack">
            <input
              className="control"
              placeholder="Prompt title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Connection</option>
              <option>Fun</option>
              <option>Gratitude</option>
              <option>Conflict</option>
            </select>
            <textarea
              className="control"
              placeholder="Prompt question"
              value={question}
              rows={4}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <input
              className="control"
              placeholder="Tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button className="buttonPrimary" type="submit">
              Create Prompt
            </button>
          </div>
        </form>

        <section className="glassCard">
          <h3 className="sectionTitle">Prompt Library ({prompts.length})</h3>
          <div className="stack">
            {prompts.map((prompt) => (
              <article key={prompt.id} className={styles.promptRow}>
                <div>
                  <h4>{prompt.title}</h4>
                  <p>{prompt.question}</p>
                  <small>{prompt.tags.join(" • ") || "No tags"}</small>
                </div>
                <div className={styles.promptActions}>
                  <span
                    className={statusClass(
                      prompt.active ? "active" : "inactive",
                    )}
                  >
                    {prompt.active ? "Active" : "Paused"}
                  </span>
                  <time>{formatDate(prompt.createdAt)}</time>
                  <button
                    className="buttonGhost"
                    onClick={() => togglePrompt(prompt.id)}
                    type="button"
                  >
                    {prompt.active ? "Pause" : "Activate"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
