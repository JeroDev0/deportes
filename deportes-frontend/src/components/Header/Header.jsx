import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../context/useAuth.js";

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
        <div className={styles.logo}>
          <Link to="/">🏅 DeportesApp</Link>
        </div>
        <nav>
          {user ? (
            <>
              <span style={{ marginRight: "1rem" }}>Hello, {user.name}</span>
              <Link to={`/profile/${user.id}`} className={styles.link}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className={styles.link}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
              <Link to="/register" className={styles.link}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
