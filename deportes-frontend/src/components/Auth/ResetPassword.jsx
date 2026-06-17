import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ResetPassword.module.css";
import API_URL from "../../config/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");
  const { t } = useLanguage();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
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
      return setMsg(t("reset_min"));
    }

    if (form.newPassword !== form.confirmPassword) {
      return setMsg(t("reset_no_match"));
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
        setMsg(t("reset_success"));
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setMsg(data.error || t("reset_invalid"));
      }
    } catch (error) {
      setMsg(t("reset_connection"));
      console.error("Reset password error:", error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.authPanel}>
      <div className={styles.formBox}>
      <h2 className={styles.title}>{t("reset_title")}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="password" name="newPassword" placeholder={t("reset_new")} value={form.newPassword} onChange={handleChange} required className={styles.input} />
        <input type="password" name="confirmPassword" placeholder={t("reset_confirm")} value={form.confirmPassword} onChange={handleChange} required className={styles.input} />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? t("reset_updating") : t("reset_btn")}
        </button>
      </form>

      {msg && <p className={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;