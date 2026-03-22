"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { statusClass } from "../lib/format";

export default function CouplesPage() {
  const { couples } = useAdminData();
  const [sortBy, setSortBy] = useState<"score" | "streak">("score");

  const sortedCouples = useMemo(() => {
    const cloned = [...couples];
    if (sortBy === "score") {
      return cloned.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }
    return cloned.sort((a, b) => b.streakDays - a.streakDays);
  }, [couples, sortBy]);

  return (
    <AdminShell
      title="Couples Overview"
      subtitle="Track relationship health, streaks and compatibility trends."
    >
      <div className="glassCard" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <span>Sort by:</span>
          <button
            className="buttonGhost"
            onClick={() => setSortBy("score")}
            type="button"
          >
            Compatibility
          </button>
          <button
            className="buttonGhost"
            onClick={() => setSortBy("streak")}
            type="button"
          >
            Streak
          </button>
        </div>
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">Couples ({sortedCouples.length})</h3>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Pair</th>
              <th>City</th>
              <th>Compatibility</th>
              <th>Streak</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedCouples.map((couple) => (
              <tr key={couple.id}>
                <td>{couple.pairName}</td>
                <td>{couple.city}</td>
                <td>{couple.compatibilityScore}%</td>
                <td>{couple.streakDays} days</td>
                <td>
                  <span className={statusClass(couple.status)}>
                    {couple.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
