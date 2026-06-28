import styles from "./ProfileFeed.module.css";
import { useLanguage } from "../../../context/LanguageContext";

function ProfileTabs({ tab, setTab }) {
  const { t } = useLanguage();
  const tabs = [
    { key: "posts", label: t("feed_tab_posts") },
    { key: "grid",  label: t("feed_tab_grid") },
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