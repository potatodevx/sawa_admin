"use client";

import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate, statusClass } from "../lib/format";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { stats, activities, prompts } = useAdminData();

  return (
    <AdminShell
      title="SAWA Dashboard"
      subtitle="Real-time command view for prompts, users, couples and communities."
    >
      <div className="widgetGrid">
        <article className="widgetCard">
          <div className="widgetLabel">Total Users</div>
          <div className="widgetValue">{stats.totalUsers}</div>
        </article>
        <article className="widgetCard">
          <div className="widgetLabel">Total Couples</div>
          <div className="widgetValue">{stats.totalCouples}</div>
        </article>
        <article className="widgetCard">
          <div className="widgetLabel">Total Communities</div>
          <div className="widgetValue">{stats.totalCommunities}</div>
        </article>
        <article className="widgetCard">
          <div className="widgetLabel">Live Prompts</div>
          <div className="widgetValue">{stats.totalPrompts}</div>
        </article>
        <article className="widgetCard">
          <div className="widgetLabel">Active Today</div>
          <div className="widgetValue">{stats.activeToday}</div>
        </article>
      </div>

      <div className={styles.layout}>
        <section className="glassCard">
          <h3 className="sectionTitle">Recent Activities</h3>
          <div className="stack">
            {activities.slice(0, 5).map((item) => (
              <article className={styles.activityRow} key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.actor}</p>
                </div>
                <div>
                  <span className="chip chipNeutral">
                    {item.type.replace("_", " ")}
                  </span>
                  <time>{formatDate(item.happenedAt)}</time>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glassCard">
          <h3 className="sectionTitle">Prompt Health</h3>
          <table className="dataTable">
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {prompts.slice(0, 6).map((prompt) => (
                <tr key={prompt.id}>
                  <td>{prompt.title}</td>
                  <td>{prompt.category}</td>
                  <td>
                    <span
                      className={statusClass(
                        prompt.active ? "active" : "inactive",
                      )}
                    >
                      {prompt.active ? "Active" : "Paused"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
