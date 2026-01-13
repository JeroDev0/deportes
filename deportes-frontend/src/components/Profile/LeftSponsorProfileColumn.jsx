import React from "react";
import styles from "./LeftProfileColumn.module.css";

function LeftSponsorProfileColumn({ profile }) {
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
          {profile.industry || "Sponsor"}
        </div>
      </div>

      <div className={styles.contentBelow}>
        <div className={styles.levelAge}>
          <span>
            <strong>Company:</strong> {profile.company}
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
              <strong>{profile.city || "City"}</strong>
              {profile.country && ` | ${profile.country}`}
            </span>
          </div>
        )}

        {profile.sports?.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>Supported Sports</h4>
            <div className={styles.skillsList}>
              {profile.sports.map((sport, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {sport}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.categories?.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>Supported Categories</h4>
            <div className={styles.skillsList}>
              {profile.categories.map((cat, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftSponsorProfileColumn;