"use client";

import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate } from "../lib/format";
import styles from "./page.module.css";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Users, UserPlus, Hash, LayoutGrid, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { stats, chartData, userLogs, communityLogs, cityDistribution } = useAdminData();

  return (
    <AdminShell
      title="SAWA Dashboard"
      subtitle="Real-time overview of users, communities, and city-wise trends."
    >
      <div className={styles.statsOverview}>
         <div className="glassCard" style={{ flex: 2 }}>
            <h3 className="sectionTitle">Growth Overview</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="users" fill="var(--accent-cool)" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="couples" fill="var(--accent-good)" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="communities" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.chartLegend}>
              <span><i style={{ background: 'var(--accent-cool)' }} /> Users</span>
              <span><i style={{ background: 'var(--accent-good)' }} /> Couples</span>
              <span><i style={{ background: 'var(--accent-orange)' }} /> Communities</span>
            </div>
         </div>

         <div className="glassCard" style={{ flex: 1 }}>
            <h3 className="sectionTitle">User Mix</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Single Users', value: stats.totalUsers - (stats.totalCouples * 2) > 0 ? stats.totalUsers - (stats.totalCouples * 2) : 0 },
                      { name: 'Couple Users', value: stats.totalCouples * 2 },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="var(--accent-cool)" />
                    <Cell fill="var(--accent-good)" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.pieStats}>
               <div className={styles.pieStatItem}>
                  <strong>{stats.totalUsers}</strong>
                  <span>Total Users</span>
               </div>
               <div className={styles.pieStatItem}>
                  <strong>{stats.totalCouples}</strong>
                  <span>Total Couples</span>
               </div>
            </div>
         </div>
      </div>

      <div className="glassCard" style={{ marginBottom: '2rem' }}>
         <div className={styles.splitHeader} style={{ marginBottom: '1.5rem' }}>
            <h3 className="sectionTitle">City Distribution</h3>
            <MapPin size={18} color="var(--ink-muted)" />
         </div>
         <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
               <BarChart data={cityDistribution} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} width={100} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="users" name="Individual Users" fill="var(--accent-cool)" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="couples" name="Couples" fill="var(--accent-good)" radius={[0, 4, 4, 0]} barSize={12} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className={styles.layout}>
        <section className="glassCard">
          <div className={styles.splitHeader}>
            <h3 className="sectionTitle">User Logs</h3>
            <Users size={18} color="var(--ink-muted)" />
          </div>
          <div className={styles.logStack}>
            {userLogs.length > 0 ? (
              userLogs.map((log) => (
                <article className={styles.logRow} key={log.id}>
                  <div className={styles.logIcon} style={{ background: 'var(--accent-cool)' }}>
                    <UserPlus size={14} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong className={styles.logTitle}>{log.title}</strong>
                    <p className={styles.logActor}>{log.actor}</p>
                  </div>
                  <time className={styles.logTime}>{formatDate(log.happenedAt)}</time>
                </article>
              ))
            ) : (
              <p className={styles.empty}>No recent user logs</p>
            )}
          </div>
        </section>

        <section className="glassCard">
          <div className={styles.splitHeader}>
            <h3 className="sectionTitle">Community Logs</h3>
            <LayoutGrid size={18} color="var(--ink-muted)" />
          </div>
          <div className={styles.logStack}>
            {communityLogs.length > 0 ? (
              communityLogs.map((log) => (
                <article className={styles.logRow} key={log.id}>
                  <div className={styles.logIcon} style={{ background: 'var(--accent-orange)' }}>
                    <Hash size={14} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong className={styles.logTitle}>{log.title}</strong>
                    <p className={styles.logActor}>{log.actor}</p>
                  </div>
                  <time className={styles.logTime}>{formatDate(log.happenedAt)}</time>
                </article>
              ))
            ) : (
              <p className={styles.empty}>No recent community logs</p>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
