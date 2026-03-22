"use client";

import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";

export default function ReportsPage() {
  const { reports } = useAdminData();

  return (
    <AdminShell
      title="User Reports"
      subtitle="Review and resolve safety and behavioral reports from the community."
    >
      <section className="glassCard">
        <h3 className="sectionTitle">Pending Reports ({reports.length})</h3>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Reporter</th>
              <th>Target Couple</th>
              <th>Reason</th>
              <th>Reported On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-muted)" }}>
                  Zero reports! The community is looking clean. ✨
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.reporter}</td>
                  <td><strong>{report.target}</strong></td>
                  <td>{report.reason}</td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    <span className={statusClass(report.status === 'pending' ? 'warning' : 'neutral')}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button className="buttonGhost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
                      Review
                    </button>
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
