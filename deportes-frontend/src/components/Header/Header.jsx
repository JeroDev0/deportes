import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";
import { useAuth } from "../../context/useAuth.js";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Extrae solo el primer nombre si existe
  const firstName = user && user.name ? user.name.split(" ")[0] : "";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" onClick={closeMenu}>🏅 DeportesApp</Link>
        </div>

        {/* Botón hamburguesa */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ""}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ""}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ""}`}></span>
        </button>

        {/* Menú de navegación */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          {user ? (
            <>
              <span className={styles.greeting}>
                Hola, {firstName}
              </span>
              <Link
                to={`/profile/${user.id}`}
                className={styles.link}
                onClick={closeMenu}
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className={styles.link}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={styles.link}
                onClick={closeMenu}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className={styles.link}
                onClick={closeMenu}
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;