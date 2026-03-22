"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";
import { formatDate } from "../lib/format";
import type { ActivityType } from "../lib/types";

const activityOptions: Array<{ label: string; value: "all" | ActivityType }> = [
  { label: "All activity", value: "all" },
  { label: "Prompt created", value: "prompt_created" },
  { label: "User joined", value: "user_joined" },
  { label: "Couple event", value: "couple_matched" },
  { label: "Community created", value: "community_created" },
  { label: "Safety reports", value: "report_opened" },
];

export default function ActivitiesPage() {
  const { activities } = useAdminData();
  const [typeFilter, setTypeFilter] = useState<"all" | ActivityType>("all");

  const filteredActivities = useMemo(
    () =>
      activities.filter(
        (item) => typeFilter === "all" || item.type === typeFilter,
      ),
    [activities, typeFilter],
  );

  return (
    <AdminShell
      title="Activity Feed"
      subtitle="Observe the latest events happening across the SAWA ecosystem."
    >
      <div className="glassCard" style={{ marginBottom: "1rem" }}>
        <select
          className="control"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
        >
          {activityOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">
          Recent Actions ({filteredActivities.length})
        </h3>
        <div className="stack">
          {filteredActivities.map((item) => (
            <article
              key={item.id}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "13px",
                padding: "0.8rem",
              }}
            >
              <strong>{item.title}</strong>
              <p style={{ margin: "0.45rem 0", color: "#d5e5ff" }}>
                {item.actor}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.8rem",
                }}
              >
                <span className="chip chipNeutral">
                  {item.type.replace("_", " ")}
                </span>
                <span style={{ color: "#c4d8fa", fontSize: "0.85rem" }}>
                  {formatDate(item.happenedAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
