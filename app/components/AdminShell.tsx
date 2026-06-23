"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./AdminShell.module.css";
import { SawaBrandLogo } from "./SawaBrandLogo";
import { useAdminData } from "../providers/AdminDataProvider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "mdi-view-dashboard" },
  { href: "/users", label: "Users", icon: "mdi-account-group" },
  { href: "/communities", label: "Communities", icon: "mdi-google-circles-communities" },
  { href: "/prompts", label: "Chat Prompts", icon: "mdi-chat-question" },
  { href: "/onboarding", label: "Onboarding", icon: "mdi-clipboard-list-outline" },
  { href: "/notifications", label: "Send Notifications", icon: "mdi-bell-ring" },
  { href: "/reports", label: "Reports", icon: "mdi-alert-octagon" },
  { href: "/blocks", label: "Blocks", icon: "mdi-block-helper" },
];

interface SidebarProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AdminShell({ children, title, subtitle }: SidebarProps) {
  const { logout, isAuthenticated, isLoading } = useAdminData();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (isLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface, #0f0f13)', gap: '1rem',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--accent-cool, #6366f1)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
          Verifying session…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!isAuthenticated && pathname !== "/login") return null;

  return (
    <div className={styles.root}>
      <div className={styles.backgroundAura} />
      
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileBrand}>
          <SawaBrandLogo size={32} />
          <span>SAWA</span>
        </div>
        <button 
          className={styles.burger} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className={`${styles.burgerIcon} ${isMobileMenuOpen ? styles.open : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </header>

      {/* Sidebar / Mobile Nav */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.brandBlock}>
          <SawaBrandLogo size={48} />
          <h1 className={styles.brandTitle} style={{ marginTop: '0.5rem' }}>SAWA</h1>
          <p className={styles.brandSubtitle}>ADMIN DASHBOARD</p>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                <i className={`mdi ${item.icon}`} style={{ fontSize: '1.2rem' }}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={logout} className={styles.logoutButton}>
            <i className="mdi mdi-logout"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.pageTitle}>{title}</h2>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </div>
        </header>

        <section className={styles.contentPanel}>{children}</section>
      </main>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className={styles.backdrop} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </div>
  );
}
