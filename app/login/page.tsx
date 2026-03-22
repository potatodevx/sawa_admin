"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "../providers/AdminDataProvider";
import { SawaBrandLogo } from "../components/SawaBrandLogo";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdminData();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Access denied.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.aura} />
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <SawaBrandLogo size={64} />
          <h1 className={styles.title}>SAWA</h1>
          <p className={styles.subtitle}>Administrative Portal</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@sawa.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Master Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.button} disabled={submitting}>
            {submitting ? "Verifying Access..." : "Secure Login"}
          </button>
        </form>

        <p className={styles.footer}>
          Authorized access only. All actions are logged.
        </p>
      </div>
    </div>
  );
}
