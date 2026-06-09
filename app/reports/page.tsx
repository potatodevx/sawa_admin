"use client";

import { useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";

export default function ReportsPage() {
  const { reports, resolveReport } = useAdminData();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved" | "dismissed">("all");

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const handleAction = async (id: string, status: "resolved" | "dismissed") => {
    setLoadingId(id);
    await resolveReport(id, status);
    setLoadingId(null);
  };

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <AdminShell
      title="User Reports"
      subtitle="Review and resolve safety and behavioral reports from the community."
    >
      {/* Summary Pills */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["all", "pending", "resolved", "dismissed"] as const).map((f) => {
          const count =
            f === "all"
              ? reports.length
              : reports.filter((r) => r.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: "999px",
                border: filter === f ? "2px solid var(--accent-orange)" : "2px solid transparent",
                background: filter === f ? "rgba(255,140,0,0.12)" : "rgba(0,0,0,0.06)",
                color: "var(--ink-body)",
                fontWeight: filter === f ? 700 : 400,
                cursor: "pointer",
                fontSize: "0.88rem",
                textTransform: "capitalize",
              }}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">
          {filter === "all" ? "All Reports" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Reports`}
          {" "}({filtered.length})
          {pendingCount > 0 && filter !== "pending" && (
            <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 600 }}>
              ⚠ {pendingCount} pending
            </span>
          )}
        </h3>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Reporter</th>
              <th>Target (User / Community)</th>
              <th>Reason</th>
              <th>Reported On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-muted)" }}>
                  {filter === "all" ? "Zero reports! The community is looking clean. ✨" : `No ${filter} reports.`}
                </td>
              </tr>
            ) : (
              filtered.map((report) => (
                <tr key={report.id}>
                  <td>{report.reporter}</td>
                  <td><strong>{report.target}</strong></td>
                  <td>{report.reason}</td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    <span
                      className={statusClass(
                        report.status === "pending"
                          ? "warning"
                          : report.status === "resolved"
                          ? "success"
                          : "neutral"
                      )}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td>
                    {report.status === "pending" ? (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          className="buttonPrimary"
                          style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}
                          disabled={loadingId === report.id}
                          onClick={() => handleAction(report.id, "resolved")}
                        >
                          {loadingId === report.id ? "…" : "Resolve"}
                        </button>
                        <button
                          className="buttonGhost"
                          style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}
                          disabled={loadingId === report.id}
                          onClick={() => handleAction(report.id, "dismissed")}
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "var(--ink-muted)", fontSize: "0.82rem" }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
