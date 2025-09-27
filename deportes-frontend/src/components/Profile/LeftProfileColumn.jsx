import React from "react";
import styles from "./LeftProfileColumn.module.css";

function LeftProfileColumn({ profile }) {
  if (!profile) return null;

  return (
    <div className={styles.profileCard}>
      {/* Etiqueta Boosted (opcional) */}
      {profile.boosted && <div className={styles.boostedBadge}>Boosted</div>}

      {/* Foto de perfil */}
      <div className={styles.avatarContainer}>
        <img
          src={profile.photo || "https://placehold.co/400x400?text=Sin+Foto"}
          alt={`${profile.name} ${profile.lastName}`}
          className={styles.avatar}
        />
        {/* Sport Badge justo sobre el borde inferior de la foto */}
        <div className={styles.sportBadge}>{profile.sport || "Deportista"}</div>
      </div>

      {/* Contenido debajo de la foto */}
      <div className={styles.contentBelow}>
        {/* Level y Edad */}
        <div className={styles.levelAge}>
          <span>
            <strong>Level:</strong> {profile.level || "Amateur"}
          </span>
          |
          <span>
            <strong>Age:</strong> {profile.age || "N/A"}
          </span>
        </div>

        {/* Género */}
        {profile.gender && (
          <div className={styles.gender}>
            <span>
              <strong>Gender:</strong> {profile.gender === "male" ? "Male" : "Female"}
            </span>
          </div>
        )}

        {/* Ciudad y País con icono - Current Location */}
        <div className={styles.location}>
          <img
            src="/assets/icon_loaction.svg"
            alt="location icon"
            className={styles.locationIcon}
          />
          <span>
            <strong>{profile.city || "Ciudad"}</strong> | {profile.country || "País"}
          </span>
        </div>

        {/* NUEVO: Información adicional de Current Location */}
        {(profile.postalCode || profile.address) && (
          <div className={styles.addressInfo}>
            {profile.address && (
              <div className={styles.addressItem}>
                <span className={styles.addressLabel}>Address:</span>
                <span className={styles.addressValue}>{profile.address}</span>
              </div>
            )}
            {profile.postalCode && (
              <div className={styles.addressItem}>
                <span className={styles.addressLabel}>Postal Code:</span>
                <span className={styles.addressValue}>{profile.postalCode}</span>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>Style</h4>
            <div className={styles.skillsList}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* NUEVO: Birth Information */}
        {(profile.birthCountry || profile.birthCity) && (
          <div className={styles.birthInfo}>
            <div className={styles.sectionHeader}>
              <h4>Birth Place</h4>
            </div>
            <div className={styles.birthLocation}>
              {profile.birthCity && <strong>{profile.birthCity}</strong>}
              {profile.birthCity && profile.birthCountry && " | "}
              {profile.birthCountry}
            </div>
          </div>
        )}

        {/* Scout asociado */}
        {profile.scout && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/scout-logo.png"
                alt="scout icon"
                className={styles.relationIcon}
              />
              <h4>Scout</h4>
            </div>
            <div className={styles.relationInfo}>
              <span className={styles.relationName}>
                {profile.scout.name} {profile.scout.lastName}
              </span>
              {profile.scout.specialization && (
                <span className={styles.relationSpecialty}>
                  {profile.scout.specialization}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sponsor asociado */}
        {profile.sponsor && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/sponsor-logo.png"
                alt="sponsor icon"
                className={styles.relationIcon}
              />
              <h4>Sponsor</h4>
            </div>
            <div className={styles.relationInfo}>
              <span className={styles.relationName}>
                {profile.sponsor.name || profile.sponsor.companyName}
              </span>
              {profile.sponsor.industry && (
                <span className={styles.relationSpecialty}>
                  {profile.sponsor.industry}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Club asociado */}
        {profile.club && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/club-logo.png"
                alt="club icon"
                className={styles.relationIcon}
              />
              <h4>Club</h4>
            </div>
            <div className={styles.relationInfo}>
              <span className={styles.relationName}>{profile.club.name}</span>
              {profile.club.city && (
                <span className={styles.relationSpecialty}>
                  {profile.club.city}
                  {profile.club.country && `, ${profile.club.country}`}
                </span>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default LeftProfileColumn;