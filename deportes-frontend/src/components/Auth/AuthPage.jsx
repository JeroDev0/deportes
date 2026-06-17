// src/components/Auth/AuthPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isForgot = location.pathname === "/forgot-password";

  const loginImg = "/assets/login.png";
  const registerImg = "/assets/registrer.png";

  let title = "";
  let description = "";
  let image = "";
  if (isLogin) {
    title = t("auth_welcome");
    description = t("auth_welcome_desc");
    image = loginImg;
  } else if (isRegister) {
    title = t("auth_join");
    description = t("auth_join_desc");
    image = registerImg;
  } else if (isForgot) {
    title = t("auth_reset_title");
    description = t("auth_reset_desc");
    image = loginImg;
  }

  return (
    <div className={styles.authBg}>
      <div className={`${styles.authPanel} ${isLogin ? styles.login : isRegister ? styles.register : styles.forgot}`}>
        {/* Panel Izquierdo */}
        <div className={styles.side + " " + styles.sideImage}>
           <img
              src={image}
              alt="Ilustración de autenticación"
              className={styles.illustration}
            />
            <div className={styles.sideText}>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
        </div>
        {/* Panel Derecho */}
        <div className={styles.side + " " + styles.sideForm}>
          <div className={styles.formBox}>
            {isLogin && <Login />}
            {isRegister && <Register />}
            {isForgot && <ForgotPassword />}
            <div className={styles.switchText}>
              {isLogin ? (
                <>
                  {t("auth_no_account")}{" "}
                  <button onClick={() => navigate("/register")}>{t("auth_register_btn")}</button>
                  <button onClick={() => navigate("/forgot-password")}>{t("auth_forgot")}</button>
                </>
              ) : (
                <>
                  {t("auth_have_account")}{" "}
                  <button onClick={() => navigate("/login")}>{t("auth_login_btn")}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Asegúrate de exportar el componente como predeterminado
export default AuthPage;