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

const SPECIALIZATION_ES = {
  "Technical Analysis": "Análisis Técnico",
  "Athletic Performance": "Rendimiento Atlético",
  "Youth Development": "Desarrollo Juvenil",
  "Tactical Scouting": "Scouting Táctico",
  "International Recruiting": "Reclutamiento Internacional",
  "Team Building": "Formación de Equipos",
  "Performance Analysis": "Análisis de Rendimiento",
  "Talent Identification": "Identificación de Talento",
};

function LeftScoutProfileColumn({
  profile,
  isMyProfile,
  isFollowing,
  onFollow,
  isAdmin = false
}) {
  const { t } = useLanguage();
  if (!profile) return null;

  const certificationUrl =
    profile.certifications?.length > 0 ? profile.certifications[0] : null;

  return (
    <div className={styles.profileCard}>
      {profile.boosted && <div className={styles.boostedBadge}>Boosted</div>}

      <div className={styles.avatarContainer}>
        <img
          src={profile.photo || "https://placehold.co/400x400?text=Sin+Foto"}
          alt={`${profile.name} ${profile.lastName}`}
          className={styles.avatar}
        />

        <div className={styles.sportBadge}>
          {SPECIALIZATION_ES[profile.specialization] || profile.specialization || t("scout_independent")}
        </div>
      </div>

      <div className={styles.contentBelow}>
        <div className={styles.levelAge}>
          <span>
            <strong>{t("scout_company")}:</strong> {profile.company || t("scout_independent")}
          </span>
          |
          <span>
            <strong>{t("profile_age")}:</strong> {profile.age || "N/A"}
          </span>
        </div>

        {profile.gender && (
          <div className={styles.gender}>
            <span>
              <strong>{t("profile_gender")}:</strong>{" "}
              {(profile.gender === "male" || profile.gender === "masculino") ? t("profile_male") : t("profile_female")}
            </span>
          </div>
        )}

        <div className={styles.location}>
          <img
            src="/assets/icon_loaction.svg"
            alt="location icon"
            className={styles.locationIcon}
          />
          <span>
            <strong>{profile.city || "Ciudad"}</strong> |{" "}
            {profile.country || "País"}
          </span>
        </div>

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
                <span className={styles.addressValue}>
                  {profile.postalCode}
                </span>
              </div>
            )}
          </div>
        )}

        {profile.sports?.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>{t("scout_sports_spec")}</h4>

            <div className={styles.skillsList}>
              {profile.sports.map((sport, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {SPORT_ES[sport] || sport}
                </span>
              ))}
            </div>
          </div>
        )}

        {(profile.birthCountry || profile.birthCity) && (
          <div className={styles.birthInfo}>
            <div className={styles.sectionHeader}>
              <h4>{t("scout_birth_place")}</h4>
            </div>

            <div className={styles.birthLocation}>
              {profile.birthCity && <strong>{profile.birthCity}</strong>}
              {profile.birthCity && profile.birthCountry && " | "}
              {profile.birthCountry}
            </div>
          </div>
        )}

        {certificationUrl && (
          <div className={styles.certificationsSection}>
            <div className={styles.sectionHeader}>
              <h4>{t("scout_certification")}</h4>
            </div>

            <a
              href={certificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.certificationLink}
            >
              <img
                src="/assets/icon_certificate.svg"
                alt="certificate"
                className={styles.certIcon}
              />

              <span>{t("scout_view_cert")}</span>

              <svg
                className={styles.externalIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
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
              <h4>{t("scout_athletes")}</h4>
            </div>

            {profile.athletes.map((athlete, idx) => (
              <div key={idx} className={styles.relationInfo}>
                <span className={styles.relationName}>
                  {athlete.name} {athlete.lastName}
                </span>

                {athlete.sport && (
                  <span className={styles.relationSpecialty}>
                    {athlete.sport}
                  </span>
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
              <h4>{t("scout_assoc_clubs")}</h4>
            </div>

            {profile.clubs.map((club, idx) => (
              <div key={idx} className={styles.relationInfo}>
                <span className={styles.relationName}>{club.name}</span>

                {club.city && (
                  <span className={styles.relationSpecialty}>
                    {club.city}
                    {club.country && `, ${club.country}`}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {profile.sponsors?.length > 0 && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/sponsor-logo.png"
                alt="sponsor icon"
                className={styles.relationIcon}
              />
              <h4>{t("scout_sponsors")}</h4>
            </div>

            {profile.sponsors.map((sponsor, idx) => (
              <div key={idx} className={styles.relationInfo}>
                <span className={styles.relationName}>
                  {sponsor.name || sponsor.companyName}
                </span>

                {sponsor.industry && (
                  <span className={styles.relationSpecialty}>
                    {sponsor.industry}
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

export default LeftScoutProfileColumn;