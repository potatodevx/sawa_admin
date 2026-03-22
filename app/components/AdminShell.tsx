"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./AdminShell.module.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/prompts", label: "Prompts" },
  { href: "/users", label: "Users" },
  { href: "/couples", label: "Couples" },
  { href: "/activities", label: "Activities" },
  { href: "/communities", label: "Communities" },
];

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.root}>
      <div className={styles.backgroundAura} />
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <p className={styles.brandEyebrow}>SAWA ADMIN</p>
          <h1 className={styles.brandTitle}>Command Center</h1>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <p>Live Monitor</p>
          <strong>All systems ready</strong>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.pageTitle}>{title}</h2>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.headerBadge}>Admin Online</div>
        </header>

        <section className={styles.contentPanel}>{children}</section>
      </main>
    </div>
  );
}
