import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AuthForm.module.css";
import API_URL from "../../config/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div>
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

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {msg && <p className={styles.msg}>{msg}</p>}

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    </div>
  );
}

export default ResetPassword;