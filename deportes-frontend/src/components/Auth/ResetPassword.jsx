import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import API_URL from "../../config/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

   // Redirigir si no hay token en la URL
  useEffect(() => {
    if (!token) {
      //navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (form.newPassword.length < 6) {
      return setMsg("Password must be at least 6 characters.");
    }

    if (form.newPassword !== form.confirmPassword) {
      return setMsg("Passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("Password successfully reset! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setMsg(data.error || "Invalid or expired token.");
      }
    } catch (error) {
      setMsg("Connection error. Please try again.");
      console.error("Reset password error:", error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.authPanel}>
      <div className={styles.formBox}>
      <h2 className={styles.title}>Create New Password</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={form.newPassword}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>

      {msg && <p className={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;