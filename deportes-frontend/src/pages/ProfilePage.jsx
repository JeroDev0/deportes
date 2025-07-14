import { useState } from "react";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileMain from "../components/Profile/ProfileMain";
import SidebarProfiles from "../components/Profile/SidebarProfiles";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const [mobileTab, setMobileTab] = useState("main");

  return (
    <div className={styles.profileLayout}>
      {/* Web: 3 columnas */}
      <aside className={styles.left}>
        <ProfileSidebar />
      </aside>
      <main className={styles.center}>
        <ProfileMain />
      </main>
      <aside className={styles.right}>
        <SidebarProfiles />
      </aside>

      {/* Móvil/Tablet: navegación y contenido */}
      <nav className={styles.mobileNav}>
        <button
          className={mobileTab === "sidebar" ? styles.active : ""}
          onClick={() => setMobileTab("sidebar")}
        >
          <span role="img" aria-label="Perfil">👤</span>
        </button>
        <button
          className={mobileTab === "main" ? styles.active : ""}
          onClick={() => setMobileTab("main")}
        >
          <span role="img" aria-label="Feed">🏅</span>
        </button>
        <button
          className={mobileTab === "suggestions" ? styles.active : ""}
          onClick={() => setMobileTab("suggestions")}
        >
          <span role="img" aria-label="Sugerencias">🤝</span>
        </button>
      </nav>
      <div className={styles.mobileContent}>
        {mobileTab === "sidebar" && <ProfileSidebar />}
        {mobileTab === "main" && <ProfileMain />}
        {mobileTab === "suggestions" && <SidebarProfiles />}
      </div>
    </div>
  );
}

export default ProfilePage;