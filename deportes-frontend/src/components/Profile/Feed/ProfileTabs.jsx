// ProfileTabs.jsx
import styles from "./profileTabs.module.css";

function ProfileTabs({ tab, setTab }) {
  const tabs = [
    { key: "posts", label: "Publicaciones" },
    { key: "grid", label: "Grid" }
  ];

  return (
    <div className={styles.tabsContainer}>
      {tabs.map(t => (
        <button
          key={t.key}
          className={`${styles.tabBtn} ${tab === t.key ? styles.activeTab : ""}`}
          onClick={() => setTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default ProfileTabs;