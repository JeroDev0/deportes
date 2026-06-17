import React from "react";
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

const INDUSTRY_ES = {
  "Sports Equipment": "Equipamiento Deportivo",
  "Nutrition & Health": "Nutrición y Salud",
  "Apparel & Footwear": "Ropa y Calzado",
  "Technology": "Tecnología",
  "Beverages": "Bebidas",
  "Banking & Finance": "Banca y Finanzas",
  "Automotive": "Automotriz",
  "Media & Entertainment": "Medios y Entretenimiento",
};

function LeftSponsorProfileColumn({ profile, isMyProfile, isAdmin = false }) {
  const { t } = useLanguage();
  if (!profile) return null;

  return (
    <div className={styles.profileCard}>
      {profile.boosted && (
        <div className={styles.boostedBadge}>Boosted</div>
      )}

      <div className={styles.avatarContainer}>
        <img
          src={profile.logo || "https://placehold.co/400x400?text=Logo"}
          alt={profile.company}
          className={styles.avatar}
        />
        <div className={styles.sportBadge}>
          {INDUSTRY_ES[profile.industry] || profile.industry || t("profile_sponsor")}
        </div>
      </div>

      <div className={styles.contentBelow}>
        <div className={styles.levelAge}>
          <span>
            <strong>{t("sponsor_company")}:</strong> {profile.company}
          </span>
        </div>

        {(profile.city || profile.country) && (
          <div className={styles.location}>
            <img
              src="/assets/icon_loaction.svg"
              alt="location"
              className={styles.locationIcon}
            />
            <span>
              <strong>{profile.city || t("sponsor_city_fallback")}</strong>
              {profile.country && ` | ${profile.country}`}
            </span>
          </div>
        )}

        {/* Solo visible para admin */}
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
            <h4>{t("sponsor_sports")}</h4>
            <div className={styles.skillsList}>
              {profile.sports.map((sport, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {SPORT_ES[sport] || sport}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.categories?.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>{t("sponsor_categories")}</h4>
            <div className={styles.skillsList}>
              {profile.categories.map((cat, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.athletes?.length > 0 && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/athlete-logo.png"
                alt="athlete icon"
                className={styles.relationIcon}
              />
              <h4>{t("sponsor_athletes")}</h4>
            </div>
            {profile.athletes.map((athlete, idx) => (
              <div key={idx} className={styles.relationInfo}>
                <span className={styles.relationName}>
                  {athlete.name} {athlete.lastName}
                </span>
                {athlete.sport && (
                  <span className={styles.relationSpecialty}>{athlete.sport}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {profile.clubs?.length > 0 && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/club-logo.png"
                alt="club icon"
                className={styles.relationIcon}
              />
              <h4>{t("sponsor_clubs")}</h4>
            </div>
            {profile.clubs.map((club, idx) => (
              <div key={idx} className={styles.relationInfo}>
                <span className={styles.relationName}>{club.name}</span>
                {club.city && (
                  <span className={styles.relationSpecialty}>
                    {club.city}{club.country && `, ${club.country}`}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftSponsorProfileColumn;