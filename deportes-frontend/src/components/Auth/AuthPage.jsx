// src/components/Auth/AuthPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  // Imágenes para el panel de login y registro
  const loginImg = "/assets/login.png";
  const registerImg = "/assets/registrer.png";

  return (
    <div className={styles.authBg}>
      <div className={`${styles.authPanel} ${isLogin ? styles.login : styles.register}`}>
        {/* Panel Izquierdo */}
        <div className={styles.side + " " + styles.sideImage}>
          <img
            src={isLogin ? loginImg : registerImg}
            alt={isLogin ? "Login illustration" : "Register illustration"}
            className={styles.illustration}
          />
          <div className={styles.sideText}>
            <h2>{isLogin ? "Welcome Back!" : "Join Us!"}</h2>
            <p>
              {isLogin
                ? "Log in to your account and connect with the best athletes, scouts and sponsors."
                : "Create your account and start your journey in the sports community."}
            </p>
          </div>
        </div>
        {/* Panel Derecho */}
        <div className={styles.side + " " + styles.sideForm}>
          <div className={styles.formBox}>
            {isLogin ? <Login /> : <Register />}
            <div className={styles.switchText}>
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => navigate("/register")}>Register</button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => navigate("/login")}>Login</button>
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