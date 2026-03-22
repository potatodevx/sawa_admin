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
      subtitle="Real-time overview of users, communities, and safety reports."
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
          <div className="widgetLabel">Communities</div>
          <div className="widgetValue">{stats.totalCommunities}</div>
        </article>

        <article className="widgetCard">
          <div className="widgetLabel">Active Today</div>
          <div className="widgetValue">{stats.activeToday}</div>
        </article>
        <article className="widgetCard">
          <div className="widgetLabel">Pending Reports</div>
          <div className="widgetValue" style={{ color: "var(--accent-orange)" }}>
            {stats.pendingReports || 0}
          </div>
        </article>
      </div>

      <div className={styles.layout}>
        <section className="glassCard">
          <h3 className="sectionTitle">Recent Activities</h3>
          <div 
            className="stack" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.6rem',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}
          >
            {activities.length > 0 ? (
              activities.map((item) => (
                <article className={styles.activityRow} key={item.id}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>{item.title}</strong>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{item.actor}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="chip chipNeutral" style={{ marginBottom: '0.3rem', display: 'inline-block' }}>
                      {item.type.replace("_", " ")}
                    </span>
                    <time style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{formatDate(item.happenedAt)}</time>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>No recent activities found.</p>
            )}
          </div>
        </section>


      </div>
    </AdminShell>
  );
}
