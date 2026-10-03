import React, { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

import styles from "./AdminLogin.module.scss";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw error;
      }

      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.message || "Unable to sign in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.iconWrapper}>
          <LockKeyhole size={28} />
        </div>

        <span className={styles.eyebrow}>
          LAKE VIEW VILLA
        </span>

        <h1>Admin Login</h1>

        <p className={styles.subtitle}>
          Sign in to manage bookings, payments, availability and feedback.
        </p>

        <form onSubmit={handleLogin}>

          <div className={styles.field}>
            <label htmlFor="adminEmail">
              Email Address
            </label>

            <input
              id="adminEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter admin email"
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="adminPassword">
              Password
            </label>

            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            <LogIn size={18} />

            {isLoading ? "Signing In..." : "Sign In"}
          </button>

        </form>
      </section>
    </main>
  );
}

export default AdminLogin;