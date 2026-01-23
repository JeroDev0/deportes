import styles from "./ProfileFeed.module.css";

function ProfileTabs({ tab, setTab }) {
  const tabs = [
    { key: "posts", label: "Publicaciones" },
    { key: "grid", label: "Grid" }
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map(t => (
        <button
          key={t.key}
          // CAMBIO AQUÍ: Quitamos styles.tabs del botón
          className={tab === t.key ? styles.active : ""}
          onClick={() => setTab(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default ProfileTabs;