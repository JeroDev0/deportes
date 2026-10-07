import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./CenterProfileColumn.module.css";

function CenterClubProfileColumn({ profile, isMyProfile }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className={styles.centerCard}>
      {isMyProfile && (
        <div className={styles.navMenu}>
          <button
            className={styles.editProfileBtn}
            onClick={() => navigate(`/club-profile/${profile._id}/edit`)}
          >
            <img src="/assets/icon_edit.svg" alt="edit" />
            {t("profile_edit")}
          </button>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.nameBlock}>
          <h1 className={styles.firstName}>{profile.name}</h1>
        </div>
      </div>

      <section className={styles.shortDescSection}>
        <div className={styles.sectionHeader}>
          <h2>{t("club_about")}</h2>
        </div>
        <p>{profile.shortDescription || t("club_no_short")}</p>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.sectionHeader}>
          <h2>{t("club_profile")}</h2>
        </div>
        <p>{profile.about || t("club_no_profile")}</p>
      </section>
    </div>
  );
}

export default CenterClubProfileColumn;
