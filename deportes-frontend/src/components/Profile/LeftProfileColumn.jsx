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
            <strong>Level:</strong> {profile.level || "N/A"}
          </span>|
          <span>
            <strong>Age:</strong> {profile.age || "N/A"}
          </span>
        </div>

        {/* Ciudad y País con icono */}
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
      </div>
    </div>
  );
}

export default LeftProfileColumn;