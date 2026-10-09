// import React, { useState } from "react";
// import { LockKeyhole, LogIn } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import { supabase } from "../../lib/supabaseClient";

// import styles from "./AdminLogin.module.scss";

// function AdminLogin() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleLogin(event) {
//     event.preventDefault();

//     setError("");

//     if (!email.trim() || !password) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: email.trim().toLowerCase(),
//         password,
//       });

//       if (error) {
//         throw error;
//       }

//       navigate("/admin");
//     } catch (error) {
//       console.error("Admin login error:", error);

//       setError(
//         error.message || "Unable to sign in. Please check your credentials."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <main className={styles.loginPage}>
//       <section className={styles.loginCard}>
//         <div className={styles.iconWrapper}>
//           <LockKeyhole size={28} />
//         </div>

//         <span className={styles.eyebrow}>
//           LAKE VIEW VILLA
//         </span>

//         <h1>Admin Login</h1>

//         <p className={styles.subtitle}>
//           Sign in to manage bookings, payments, availability and feedback.
//         </p>

//         <form onSubmit={handleLogin}>

//           <div className={styles.field}>
//             <label htmlFor="adminEmail">
//               Email Address
//             </label>

//             <input
//               id="adminEmail"
//               type="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               placeholder="Enter admin email"
//               autoComplete="email"
//             />
//           </div>

//           <div className={styles.field}>
//             <label htmlFor="adminPassword">
//               Password
//             </label>

//             <input
//               id="adminPassword"
//               type="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               placeholder="Enter password"
//               autoComplete="current-password"
//             />
//           </div>

//           {error && (
//             <p className={styles.error} role="alert">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             className={styles.loginButton}
//             disabled={isLoading}
//           >
//             <LogIn size={18} />

//             {isLoading ? "Signing In..." : "Sign In"}
//           </button>

//         </form>
//       </section>
//     </main>
//   );
// }

// export default AdminLogin;

// import React, { useState } from "react";
// import { LockKeyhole, LogIn, ArrowLeft, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import { supabase } from "../../lib/supabaseClient";
// import styles from "./AdminLogin.module.scss";

// function AdminLogin() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isForgotPassword, setIsForgotPassword] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   async function handleLogin(event) {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!email.trim() || !password) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: email.trim().toLowerCase(),
//         password,
//       });

//       if (error) throw error;

//       navigate("/admin");
//     } catch (error) {
//       console.error("Admin login error:", error);
//       setError(
//         error.message || "Unable to sign in. Please check your credentials."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function handleForgotPassword(event) {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     const normalizedEmail = email.trim().toLowerCase();

//     if (!normalizedEmail) {
//       setError("Please enter your admin email address.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(
//         normalizedEmail,
//         {
//           redirectTo: `${window.location.origin}/admin/reset-password`,
//         }
//       );

//       if (error) throw error;

//       setSuccess(
//         "If an account exists for this email, a password reset link will be sent. Please check your inbox."
//       );
//     } catch (error) {
//       console.error("Password reset request error:", error);
//       setError(
//         error.message || "Unable to send the reset email. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   function switchToForgotPassword() {
//     setIsForgotPassword(true);
//     setError("");
//     setSuccess("");
//     setPassword("");
//   }

//   function switchToLogin() {
//     setIsForgotPassword(false);
//     setError("");
//     setSuccess("");
//   }

//   return (
//     <main className={styles.loginPage}>
//       <section className={styles.loginCard}>
//         <div className={styles.iconWrapper}>
//           {isForgotPassword ? <Mail size={28} /> : <LockKeyhole size={28} />}
//         </div>

//         <span className={styles.eyebrow}>LAKE VIEW VILLA</span>

//         <h1>{isForgotPassword ? "Forgot Password?" : "Admin Login"}</h1>

//         <p className={styles.subtitle}>
//           {isForgotPassword
//             ? "Enter your admin email address to receive a password reset link."
//             : "Sign in to manage bookings, payments, availability and feedback."}
//         </p>

//         <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}>
//           <div className={styles.field}>
//             <label htmlFor="adminEmail">Email Address</label>
//             <input
//               id="adminEmail"
//               type="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               placeholder="Enter admin email"
//               autoComplete="email"
//               required
//             />
//           </div>

//           {!isForgotPassword && (
//             <div className={styles.field}>
//               <label htmlFor="adminPassword">Password</label>
//               <input
//                 id="adminPassword"
//                 type="password"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 placeholder="Enter password"
//                 autoComplete="current-password"
//                 required
//               />
//             </div>
//           )}

//           {error && (
//             <p className={styles.error} role="alert">
//               {error}
//             </p>
//           )}

//           {success && (
//             <p className={styles.success} role="status">
//               {success}
//             </p>
//           )}

//           <button
//             type="submit"
//             className={styles.loginButton}
//             disabled={isLoading}
//           >
//             {isForgotPassword ? <Mail size={18} /> : <LogIn size={18} />}
//             {isLoading
//               ? "Please wait..."
//               : isForgotPassword
//                 ? "Send Reset Link"
//                 : "Sign In"}
//           </button>

//           {isForgotPassword ? (
//             <button
//               type="button"
//               className={styles.backButton}
//               onClick={switchToLogin}
//             >
//               <ArrowLeft size={16} />
//               Back to Login
//             </button>
//           ) : (
//             <button
//               type="button"
//               className={styles.forgotPasswordButton}
//               onClick={switchToForgotPassword}
//             >
//               Forgot Password?
//             </button>
//           )}
//         </form>
//       </section>
//     </main>
//   );
// }

// export default AdminLogin;

import React, { useState } from "react";
import { LockKeyhole, LogIn, ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminLogin.module.scss";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

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

      if (error) throw error;

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

  async function handleForgotPassword(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your admin email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }
      );

      if (error) throw error;

      setSuccess(
        "If an account exists for this email, a password reset link will be sent. Please check your inbox."
      );
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        error.message || "Unable to send the reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function switchToForgotPassword() {
    setIsForgotPassword(true);
    setError("");
    setSuccess("");
    setPassword("");
  }

  function switchToLogin() {
    setIsForgotPassword(false);
    setError("");
    setSuccess("");
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.iconWrapper}>
          {isForgotPassword ? <Mail size={28} /> : <LockKeyhole size={28} />}
        </div>

        <span className={styles.eyebrow}>LAKE VIEW VILLA</span>

        <h1>{isForgotPassword ? "Forgot Password?" : "Admin Login"}</h1>

        <p className={styles.subtitle}>
          {isForgotPassword
            ? "Enter your admin email address to receive a password reset link."
            : "Sign in to manage bookings, payments, availability and feedback."}
        </p>

        <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}>
          <div className={styles.field}>
            <label htmlFor="adminEmail">Email Address</label>
            <input
              id="adminEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter admin email"
              autoComplete="email"
              required
            />
          </div>

          {!isForgotPassword && (
            <div className={styles.field}>
              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />

              <div className={styles.forgotPasswordWrapper}>
                <button
                  type="button"
                  className={styles.forgotPasswordButton}
                  onClick={switchToForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className={styles.success} role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isForgotPassword ? <Mail size={18} /> : <LogIn size={18} />}
            {isLoading
              ? "Please wait..."
              : isForgotPassword
                ? "Send Reset Link"
                : "Sign In"}
          </button>

          {isForgotPassword && (
            <button
              type="button"
              className={styles.backButton}
              onClick={switchToLogin}
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;