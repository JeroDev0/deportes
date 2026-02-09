import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import styles from "./Header.module.css";

/* =====================================
   ICONOS CON VERSIONES OUTLINE Y FILLED
===================================== */

// Icono Home (Outline)
const IconHomeOutline = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z"/>
  </svg>
);

// Icono Home (Filled)
const IconHomeFilled = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 01.22.53v8.19a2.25 2.25 0 01-2.25 2.25h-4.5a.75.75 0 01-.75-.75v-5.25h-3v5.25a.75.75 0 01-.75.75h-4.5A2.25 2.25 0 013.5 21.25v-8.19c0-.2.08-.39.22-.53l8.69-8.69z"/>
  </svg>
);

// Icono Search (Outline)
const IconSearchOutline = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// Icono Search (Filled)
const IconSearchFilled = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.5 3a7.5 7.5 0 015.645 12.438l5.709 5.708a.75.75 0 11-1.061 1.061l-5.708-5.709A7.5 7.5 0 1110.5 3zm0 1.5a6 6 0 100 12 6 6 0 000-12z"/>
  </svg>
);

// Icono Profile (Outline)
const IconProfileOutline = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a7.5 7.5 0 0 1 13 0"/>
  </svg>
);

// Icono Profile (Filled)
const IconProfileFilled = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a5 5 0 100 10 5 5 0 000-10zM7 21a5 5 0 0110 0H7z"/>
  </svg>
);

// Icono Logout
const IconLogout = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// Icono Login
const IconLogin = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

// Icono Register
const IconRegister = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-8 0v2"/>
    <circle cx="12" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

function Header() {
  const { user, logout, getProfileRoute } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Función para determinar si una ruta está activa
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Función para obtener la clase activa
  const getActiveClass = (path) => {
    return isActive(path) ? `${styles.iconLinkMobile} ${styles.active}` : styles.iconLinkMobile;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink} aria-label="Inicio">
            <span className={styles.logoMask} aria-hidden="true" />
          </Link>
        </div>

        {/* Menú desktop solo texto */}
        <nav className={styles.navDesktop} aria-label="Navegación principal">
          <Link to="/" className={styles.iconLink} title="Inicio">
            <span className={styles.iconLabel}>Inicio</span>
          </Link>
          <Link to="/dashboard" className={styles.iconLink} title="Buscar">
            <span className={styles.iconLabel}>Buscar</span>
          </Link>

          {user ? (
            <>
              <Link to={getProfileRoute()} className={styles.iconLink} title="Perfil">
                <span className={styles.iconLabel}>Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className={styles.iconLink}
                title="Cerrar sesión"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <span className={styles.iconLabel}>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.iconLink} title="Iniciar sesión">
                <span className={styles.iconLabel}>Login</span>
              </Link>
              <Link to="/register" className={styles.iconLink} title="Registrarse">
                <span className={styles.iconLabel}>Registro</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Menú móvil fijo abajo (iconos + texto) */}
      <nav className={styles.navMobile} aria-label="Navegación móvil">
        <Link to="/" className={getActiveClass("/")} title="Inicio">
          {isActive("/") ? <IconHomeFilled /> : <IconHomeOutline />}
          <span className={styles.iconLabel}>Inicio</span>
        </Link>

        <Link to="/dashboard" className={getActiveClass("/dashboard")} title="Buscar">
          {isActive("/dashboard") ? <IconSearchFilled /> : <IconSearchOutline />}
          <span className={styles.iconLabel}>Buscar</span>
        </Link>

        {user ? (
          <>
            <Link to={getProfileRoute()} className={getActiveClass(getProfileRoute())} title="Perfil">
              {isActive(getProfileRoute()) ? <IconProfileFilled /> : <IconProfileOutline />}
              <span className={styles.iconLabel}>Perfil</span>
            </Link>
            <button
              onClick={handleLogout}
              className={styles.iconLinkMobile}
              title="Cerrar sesión"
            >
              <IconLogout />
              <span className={styles.iconLabel}>Salir</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={getActiveClass("/login")} title="Iniciar sesión">
              <IconLogin />
              <span className={styles.iconLabel}>Login</span>
            </Link>
            <Link to="/register" className={getActiveClass("/register")} title="Registrarse">
              <IconRegister />
              <span className={styles.iconLabel}>Registro</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;