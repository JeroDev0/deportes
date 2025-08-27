import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import styles from "./Header.module.css";

const IconHome = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z"/>
  </svg>
);

const IconSearch = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconPlus = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconNetwork = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="12" y1="2" x2="12" y2="22"/>
  </svg>
);

const IconProfile = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a7.5 7.5 0 0 1 13 0"/>
  </svg>
);

const IconLogout = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconLogin = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

const IconRegister = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-8 0v2"/>
    <circle cx="12" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const IconNotifications = () => (
  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo a la izquierda */}
        <div className={styles.logo}>
          <Link to="/">Sports Connections</Link>
        </div>

        {/* Menú desktop centrado */}
        <nav className={styles.navDesktop}>
          <Link to="/" className={styles.iconLink} title="Inicio">
            <IconHome />
            <span className={styles.iconLabel}>Inicio</span>
          </Link>
          <Link to="/dashboard" className={styles.iconLink} title="Buscar">
            <IconSearch />
            <span className={styles.iconLabel}>Buscar</span>
          </Link>
          <Link to="/publish" className={styles.iconLink} title="Publicar">
            <IconPlus />
            <span className={styles.iconLabel}>Publicar</span>
          </Link>
          <Link to="/network" className={styles.iconLink} title="Red">
            <IconNetwork />
            <span className={styles.iconLabel}>Red</span>
          </Link>
          {user ? (
            <>
              <Link to={`/profile/${user.id}`} className={styles.iconLink} title="Perfil">
                <IconProfile />
                <span className={styles.iconLabel}>Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className={styles.iconLink}
                title="Cerrar sesión"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <IconLogout />
                <span className={styles.iconLabel}>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.iconLink} title="Iniciar sesión">
                <IconLogin />
                <span className={styles.iconLabel}>Login</span>
              </Link>
              <Link to="/register" className={styles.iconLink} title="Registrarse">
                <IconRegister />
                <span className={styles.iconLabel}>Registro</span>
              </Link>
            </>
          )}
        </nav>

        {/* Icono notificaciones a la derecha (solo desktop) */}
        <div className={styles.notifications} title="Notificaciones">
          <IconNotifications />
        </div>
      </div>

      {/* Menú móvil fijo abajo */}
      <nav className={styles.navMobile}>
        <Link to="/" className={styles.iconLinkMobile} title="Inicio">
          <IconHome />
          <span className={styles.iconLabel}>Inicio</span>
        </Link>
        <Link to="/dashboard" className={styles.iconLinkMobile} title="Buscar">
          <IconSearch />
          <span className={styles.iconLabel}>Buscar</span>
        </Link>
        <Link to="/publish" className={styles.iconLinkMobile} title="Publicar">
          <IconPlus />
          <span className={styles.iconLabel}>Publicar</span>
        </Link>
        <Link to="/network" className={styles.iconLinkMobile} title="Red">
          <IconNetwork />
          <span className={styles.iconLabel}>Red</span>
        </Link>
        {user ? (
          <>
            <Link to={`/profile/${user.id}`} className={styles.iconLinkMobile} title="Perfil">
              <IconProfile />
              <span className={styles.iconLabel}>Perfil</span>
            </Link>
            <button
              onClick={handleLogout}
              className={styles.iconLinkMobile}
              title="Cerrar sesión"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <IconLogout />
              <span className={styles.iconLabel}>Salir</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.iconLinkMobile} title="Iniciar sesión">
              <IconLogin />
              <span className={styles.iconLabel}>Login</span>
            </Link>
            <Link to="/register" className={styles.iconLinkMobile} title="Registrarse">
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