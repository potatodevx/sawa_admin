"use client";

import { useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import styles from "./page.module.css";

export default function NotificationsPage() {
  const { couples, sendNotification } = useAdminData();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<"all" | "specific">("all");
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggleRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    if (targetType === "specific" && selectedRecipientIds.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }

    setIsSending(true);
    setSuccess(false);
    try {
      await sendNotification(
        title,
        message,
        targetType === "all" ? undefined : selectedRecipientIds
      );
      setSuccess(true);
      setTitle("");
      setMessage("");
      setSelectedRecipientIds([]);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to send notification. Check console for details.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminShell
      title="Send Notifications"
      subtitle="Broadcast messages to all users or target specific couples."
    >
      <div className={styles.container}>
        <form className="glassCard" onSubmit={handleSend}>
          <div className={styles.formSection}>
            <label className={styles.label}>Notification Title</label>
            <input
              className="control"
              placeholder="e.g. New Feature Update!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>Message Body</label>
            <textarea
              className="control"
              placeholder="Write your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ resize: 'none' }}
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>Target Audience</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="target"
                  checked={targetType === "all"}
                  onChange={() => setTargetType("all")}
                />
                <span>All Users</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="target"
                  checked={targetType === "specific"}
                  onChange={() => setTargetType("specific")}
                />
                <span>Specific Couples</span>
              </label>
            </div>
          </div>

          {targetType === "specific" && (
            <div className={styles.formSection}>
              <label className={styles.label}>Select Recipients ({selectedRecipientIds.length})</label>
              <div className={styles.recipientList}>
                {couples.map((couple) => (
                  <label key={couple.id} className={styles.recipientItem}>
                    <input
                      type="checkbox"
                      checked={selectedRecipientIds.includes(couple.id)}
                      onChange={() => handleToggleRecipient(couple.id)}
                    />
                    <span>{couple.pairName} ({couple.city})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              className="buttonPrimary"
              type="submit"
              disabled={isSending}
              style={{ width: '200px' }}
            >
              {isSending ? "Sending..." : "Send Notification"}
            </button>
            {success && (
              <span className={styles.successMessage}>
                <i className="mdi mdi-check-circle"></i> Notification sent successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
