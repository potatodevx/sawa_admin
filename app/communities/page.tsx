"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { useAdminData } from "../providers/AdminDataProvider";

export default function CommunitiesPage() {
  const { communities } = useAdminData();
  const [minMembers, setMinMembers] = useState(0);

  const visibleCommunities = useMemo(
    () => communities.filter((community) => community.members >= minMembers),
    [communities, minMembers],
  );

  return (
    <AdminShell
      title="Community Control"
      subtitle="Understand where users gather and which communities are scaling fastest."
    >
      <div className="glassCard" style={{ marginBottom: "1rem" }}>
        <label style={{ display: "grid", gap: "0.55rem" }}>
          <span>Minimum members: {minMembers}</span>
          <input
            type="range"
            min={0}
            max={500}
            value={minMembers}
            onChange={(event) => setMinMembers(Number(event.target.value))}
          />
        </label>
      </div>

      <section className="glassCard">
        <h3 className="sectionTitle">
          Communities ({visibleCommunities.length})
        </h3>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Members</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {visibleCommunities.map((community) => (
              <tr key={community.id}>
                <td>{community.name}</td>
                <td>{community.category}</td>
                <td>{community.members}</td>
                <td>
                  <span className="chip chipActive">
                    +{community.growthRate}%
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
