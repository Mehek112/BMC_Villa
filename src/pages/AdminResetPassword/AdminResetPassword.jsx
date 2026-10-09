
// import React, { useEffect, useState } from "react";
// import { LockKeyhole, CheckCircle2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../lib/supabaseClient";
// import styles from "./AdminResetPassword.module.scss";

// function AdminResetPassword() {
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(true);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isUpdated, setIsUpdated] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     let active = true;

//     async function verifyResetSession() {
//       try {
//         const { data, error } = await supabase.auth.getSession();

//         if (error) throw error;

//         if (active) {
//           setIsVerified(Boolean(data.session));
//           if (!data.session) {
//             setError(
//               "This reset link is invalid or expired. Please request a new one."
//             );
//           }
//         }
//       } catch (error) {
//         if (active) {
//           setError(error.message || "Unable to verify your reset link.");
//         }
//       } finally {
//         if (active) setIsVerifying(false);
//       }
//     }

//     verifyResetSession();

//     return () => {
//       active = false;
//     };
//   }, []);

//   async function handleUpdatePassword(event) {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password.length < 12) {
//       setError("Your password must be at least 12 characters long.");
//       return;
//     }

//     if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
//       setError("Include at least one uppercase and one lowercase letter.");
//       return;
//     }

//     if (!/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
//       setError("Include at least one number and one special character.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("The passwords do not match.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.updateUser({ password });

//       if (error) throw error;

//       setIsUpdated(true);
//       setSuccess("Your password has been updated successfully.");
//     } catch (error) {
//       console.error("Password update error:", error);
//       setError(error.message || "Unable to update your password.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   if (isVerifying) {
//     return (
//       <main className={styles.resetPage}>
//         <section className={styles.resetCard}>
//           <p className={styles.subtitle}>Verifying your reset link...</p>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <main className={styles.resetPage}>
//       <section className={styles.resetCard}>
//         <div className={styles.iconWrapper}>
//           {isUpdated ? (
//             <CheckCircle2 size={28} />
//           ) : (
//             <LockKeyhole size={28} />
//           )}
//         </div>

//         <span className={styles.eyebrow}>LAKE VIEW VILLA</span>

//         <h1>{isUpdated ? "Password Updated" : "Reset Password"}</h1>

//         <p className={styles.subtitle}>
//           {isUpdated
//             ? "Your admin password has been changed."
//             : "Choose a strong new password for your admin account."}
//         </p>

//         {!isUpdated && isVerified && (
//           <form onSubmit={handleUpdatePassword}>
//             <div className={styles.field}>
//               <label htmlFor="newPassword">New Password</label>
//               <input
//                 id="newPassword"
//                 type="password"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 placeholder="Enter new password"
//                 autoComplete="new-password"
//                 minLength={12}
//                 required
//               />
//               <small>
//                 At least 12 characters, with uppercase, lowercase, a number
//                 and a special character.
//               </small>
//             </div>

//             <div className={styles.field}>
//               <label htmlFor="confirmPassword">Confirm New Password</label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(event) => setConfirmPassword(event.target.value)}
//                 placeholder="Re-enter new password"
//                 autoComplete="new-password"
//                 minLength={12}
//                 required
//               />
//             </div>

//             {error && (
//               <p className={styles.error} role="alert">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               className={styles.submitButton}
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating Password..." : "Update Password"}
//             </button>
//           </form>
//         )}

//         {error && (!isVerified || isUpdated) && (
//           <p className={styles.error} role="alert">
//             {error}
//           </p>
//         )}

//         {success && (
//           <p className={styles.success} role="status">
//             {success}
//           </p>
//         )}

//         {(!isVerified || isUpdated) && (
//           <button
//             type="button"
//             className={styles.backButton}
//             onClick={() => navigate("/admin/login")}
//           >
//             Go to Admin Login
//           </button>
//         )}
//       </section>
//     </main>
//   );
// }

// export default AdminResetPassword;


import React, { useEffect, useState } from "react";
import { LockKeyhole, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminResetPassword.module.scss";

function AdminResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRules = [
    {
      label: "At least 12 characters",
      valid: password.length >= 12,
    },
    {
      label: "One uppercase letter (A–Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a–z)",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number (0–9)",
      valid: /\d/.test(password),
    },
    {
      label: "One special character (e.g. !@#$%)",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    let active = true;

    async function verifyResetSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (active) {
          setIsVerified(Boolean(data.session));

          if (!data.session) {
            setError(
              "This reset link is invalid or expired. Please request a new one."
            );
          }
        }
      } catch (error) {
        if (active) {
          setError(error.message || "Unable to verify your reset link.");
        }
      } finally {
        if (active) setIsVerifying(false);
      }
    }

    verifyResetSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleUpdatePassword(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setIsUpdated(true);
      setSuccess("Your password has been updated successfully.");
    } catch (error) {
      console.error("Password update error:", error);
      setError(error.message || "Unable to update your password.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isVerifying) {
    return (
      <main className={styles.resetPage}>
        <section className={styles.resetCard}>
          <p className={styles.subtitle}>Verifying your reset link...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.resetPage}>
      <section className={styles.resetCard}>
        <div className={styles.iconWrapper}>
          {isUpdated ? (
            <CheckCircle2 size={28} />
          ) : (
            <LockKeyhole size={28} />
          )}
        </div>

        <span className={styles.eyebrow}>LAKE VIEW VILLA</span>

        <h1>{isUpdated ? "Password Updated" : "Reset Password"}</h1>

        <p className={styles.subtitle}>
          {isUpdated
            ? "Your admin password has been changed."
            : "Choose a strong new password for your admin account."}
        </p>

        {!isUpdated && isVerified && (
          <form onSubmit={handleUpdatePassword}>
            <div className={styles.field}>
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                minLength={12}
                required
                aria-describedby="passwordRules"
              />

              <ul
                id="passwordRules"
                className={styles.passwordRules}
                aria-label="Password requirements"
              >
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={
                      password.length === 0
                        ? styles.rulePending
                        : rule.valid
                          ? styles.ruleValid
                          : styles.ruleInvalid
                    }
                  >
                    <span aria-hidden="true">
                      {password.length > 0 && rule.valid ? "✓" : "•"}
                    </span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
                aria-describedby="passwordMatch"
              />

              {confirmPassword.length > 0 && (
                <small
                  id="passwordMatch"
                  className={
                    passwordsMatch
                      ? styles.ruleValid
                      : styles.ruleInvalid
                  }
                >
                  {passwordsMatch
                    ? "Passwords match."
                    : "Passwords do not match."}
                </small>
              )}
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                isLoading || !isPasswordValid || !passwordsMatch
              }
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}

        {error && (!isVerified || isUpdated) && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className={styles.success} role="status">
            {success}
          </p>
        )}

        {(!isVerified || isUpdated) && (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/admin/login")}
          >
            Go to Admin Login
          </button>
        )}
      </section>
    </main>
  );
}

export default AdminResetPassword;

