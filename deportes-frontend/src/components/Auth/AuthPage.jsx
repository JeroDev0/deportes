// src/components/Auth/AuthPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isForgot = location.pathname === "/forgot-password";

  // Imágenes para el panel de login y registro
  const loginImg = "/assets/login.png";
  const registerImg = "/assets/registrer.png";

  // 
  let title = "";
  let description = "";
  let image = "";
  if (isLogin) {
    title = "Welcome Back!";
    description =
      "Log in to your account and connect with the best athletes, scouts and sponsors.";
    image = loginImg;
  } else if (isRegister) {
    title = "Join Us!";
    description =
      "Create your account and start your journey in the sports community.";
    image = registerImg;
  } else if (isForgot) {
    title = "Reset Password";
    description =
      "Enter your email and we’ll send you a reset link.";
    image = loginImg;
  }

  return (
    <div className={styles.authBg}>
      <div className={`${styles.authPanel} ${isLogin ? styles.login : isRegister ? styles.register : styles.forgot}`}>
        {/* Panel Izquierdo */}
        <div className={styles.side + " " + styles.sideImage}>
           <img
              src={image}
              alt="Auth illustration"
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
                  Don't have an account?{" "}
                  <button onClick={() => navigate("/register")}>Register</button>                
                  
                  <button onClick={() => navigate("/forgot-password")}>Forgot your password?</button>               
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