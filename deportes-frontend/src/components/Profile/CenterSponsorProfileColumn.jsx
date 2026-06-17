import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./CenterProfileColumn.module.css";

function CenterSponsorProfileColumn({ profile, isMyProfile }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className={styles.centerCard}>
      {isMyProfile && (
        <div className={styles.navMenu}>
          <button
            className={styles.editProfileBtn}
            onClick={() =>
              navigate(`/sponsor-profile/${profile._id}/edit`)
            }
          >
            <img src="/assets/icon_edit.svg" alt="edit" />
            {t("profile_edit")}
          </button>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.nameBlock}>
          <h1 className={styles.firstName}>{profile.company}</h1>
        </div>
      </div>

      <section className={styles.shortDescSection}>
        <div className={styles.sectionHeader}>
          <h2>{t("sponsor_about")}</h2>
        </div>
        <p>
          {profile.shortDescription || t("sponsor_no_short")}
        </p>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.sectionHeader}>
          <h2>{t("sponsor_profile")}</h2>
        </div>
        <p>{profile.about || t("sponsor_no_profile")}</p>
      </section>

      {profile.athletes?.length > 0 && (
        <section className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <img src="/assets/icon_network.svg" alt="network" />
            <h2>{t("sponsor_sponsored_athletes")}</h2>
          </div>

          <div className={styles.athletesGrid}>
            {profile.athletes.map((athlete) => (
              <div
                key={athlete._id}
                className={styles.athleteCard}
                onClick={() => navigate(`/profile/${athlete._id}`)}
              >
                <img
                  src={athlete.photo || "https://placehold.co/100x100"}
                  alt={athlete.name}
                  className={styles.athleteAvatar}
                />
                <div className={styles.athleteInfo}>
                  <h4>
                    {athlete.name} {athlete.lastName}
                  </h4>
                  <span className={styles.athleteSport}>
                    {athlete.sport}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.clubs?.length > 0 && (
        <section className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <img src="/assets/club-logo.png" alt="club" />
            <h2>{t("sponsor_partner_clubs")}</h2>
          </div>

          <ul className={styles.careerList}>
            {profile.clubs.map((club) => (
              <li key={club._id}>
                {club.name}
                {club.city && ` - ${club.city}`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default CenterSponsorProfileColumn;