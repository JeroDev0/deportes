import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./LeftProfileColumn.module.css";

const SPORT_ES = {
  "Soccer": "Fútbol", "Basketball": "Baloncesto", "Tennis": "Tenis",
  "Volleyball": "Voleibol", "Swimming": "Natación", "Athletics": "Atletismo",
  "Cycling": "Ciclismo", "Boxing": "Boxeo", "Chess": "Ajedrez", "Golf": "Golf",
  "Baseball": "Béisbol", "Rugby": "Rugby", "Hockey": "Hockey",
  "Handball": "Balonmano", "Futsal": "Fútbol Sala", "Padel": "Pádel",
  "Pickleball": "Pickleball", "Gymnastics": "Gimnasia", "Karate": "Kárate",
  "Judo": "Judo", "Taekwondo": "Taekwondo", "Fencing": "Esgrima",
  "Weightlifting": "Halterofilia", "Triathlon": "Triatlón", "Boccia": "Boccia",
  "Olympic Wrestling": "Lucha Olímpica", "Skating": "Patinaje",
  "Archery": "Tiro con Arco", "Para Cycling": "Paraciclismo",
  "Para Athletics": "Paraatletismo", "Para Swimming": "Paranatación",
  "Para Powerlifting": "Parapowerlifting",
};

function LeftClubProfileColumn({ profile, isAdmin = false }) {
  const { t } = useLanguage();
  if (!profile) return null;

  const foundedYear = profile.founded ? new Date(profile.founded).getFullYear() : null;

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatarContainer}>
        <img
          src={profile.photo || "https://placehold.co/400x400?text=Club"}
          alt={profile.name}
          className={styles.avatar}
        />
        <div className={styles.sportBadge}>
          {profile.entityType || t("profile_club")}
        </div>
      </div>

      <div className={styles.contentBelow}>
        {foundedYear && (
          <div className={styles.levelAge}>
            <span>
              <strong>{t("club_founded")}:</strong> {foundedYear}
            </span>
          </div>
        )}

        {(profile.city || profile.country) && (
          <div className={styles.location}>
            <img
              src="/assets/icon_loaction.svg"
              alt="location"
              className={styles.locationIcon}
            />
            <span>
              <strong>{profile.city || t("club_city_fallback")}</strong>
              {profile.country && ` | ${profile.country}`}
            </span>
          </div>
        )}

        {isAdmin && (profile.postalCode || profile.address) && (
          <div className={styles.addressInfo}>
            {profile.address && (
              <div className={styles.addressItem}>
                <span className={styles.addressLabel}>{t("profile_address")}:</span>
                <span className={styles.addressValue}>{profile.address}</span>
              </div>
            )}
            {profile.postalCode && (
              <div className={styles.addressItem}>
                <span className={styles.addressLabel}>{t("profile_postal")}:</span>
                <span className={styles.addressValue}>{profile.postalCode}</span>
              </div>
            )}
          </div>
        )}

        {profile.sports?.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>{t("club_sports")}</h4>
            <div className={styles.skillsList}>
              {profile.sports.map((sport, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {SPORT_ES[sport] || sport}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftClubProfileColumn;
