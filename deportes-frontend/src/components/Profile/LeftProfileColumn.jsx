import React from "react";
import styles from "./LeftProfileColumn.module.css";

function calcAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? age : null;
}

function LeftProfileColumn({ profile, isAdmin = false }) {
  if (!profile) return null;

  const age = calcAge(profile.birthDate) ?? profile.age;

  return (
    <div className={styles.profileCard}>
      {profile.boosted && <div className={styles.boostedBadge}>Boosted</div>}

      <div className={styles.avatarContainer}>
        <img
          src={profile.photo || "https://placehold.co/400x400?text=Sin+Foto"}
          alt={`${profile.name} ${profile.lastName}`}
          className={styles.avatar}
        />
        <div className={styles.sportBadge}>{profile.sport || "Deportista"}</div>
      </div>

      <div className={styles.contentBelow}>
        <div className={styles.levelAge}>
          <span><strong>Level:</strong> {profile.level || "Amateur"}</span>
          |
          <span><strong>Age:</strong> {age ?? "N/A"}</span>
        </div>

        {profile.gender && (
          <div className={styles.gender}>
            <span>
              <strong>Gender:</strong> {profile.gender === "male" ? "Male" : "Female"}
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
            <strong>{profile.city || "Ciudad"}</strong> | {profile.country || "País"}
          </span>
        </div>

        {/* Solo visible para admin */}
        {isAdmin && (profile.postalCode || profile.address) && (
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

        {profile.skills && profile.skills.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>Style</h4>
            <div className={styles.skillsList}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} className={styles.skillTag}>{skill}</span>
              ))}
            </div>
          </div>
        )}

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

        {Array.isArray(profile.nationalities) && profile.nationalities.length > 0 && (
          <div className={styles.nationalitiesInfo}>
            <div className={styles.sectionHeader}>
              <h4>Nationalities</h4>
            </div>
            <div className={styles.nationalitiesList}>
              {profile.nationalities.map((code, idx) => {
                let name = code;
                try {
                  name = new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
                } catch (_) {}
                return (
                  <span key={idx} className={styles.nationalityTag}>{name}</span>
                );
              })}
            </div>
          </div>
        )}

        {(profile.scout || profile.scoutName) && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img src="/assets/scout-logo.png" alt="scout icon" className={styles.relationIcon} />
              <h4>Scout</h4>
            </div>
            <div className={styles.relationInfo}>
              {profile.scout?._id ? (
                <>
                  <span className={styles.relationName}>
                    {profile.scout.name} {profile.scout.lastName}
                  </span>
                  {profile.scout.specialization && (
                    <span className={styles.relationSpecialty}>{profile.scout.specialization}</span>
                  )}
                </>
              ) : profile.scoutName ? (
                <span className={styles.relationName}>{profile.scoutName}</span>
              ) : null}
            </div>
          </div>
        )}

        {(profile.sponsor || profile.sponsorName) && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img src="/assets/sponsor-logo.png" alt="sponsor icon" className={styles.relationIcon} />
              <h4>Sponsor</h4>
            </div>
            <div className={styles.relationInfo}>
              {profile.sponsor?._id ? (
                <>
                  <span className={styles.relationName}>
                    {profile.sponsor.name || profile.sponsor.companyName}
                  </span>
                  {profile.sponsor.industry && (
                    <span className={styles.relationSpecialty}>{profile.sponsor.industry}</span>
                  )}
                </>
              ) : profile.sponsorName ? (
                <span className={styles.relationName}>{profile.sponsorName}</span>
              ) : null}
            </div>
          </div>
        )}

        {(profile.club || profile.clubName) && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img src="/assets/club-logo.png" alt="club icon" className={styles.relationIcon} />
              <h4>Club</h4>
            </div>
            <div className={styles.relationInfo}>
              {profile.club?._id ? (
                <>
                  <span className={styles.relationName}>{profile.club.name}</span>
                  {profile.club.city && (
                    <span className={styles.relationSpecialty}>
                      {profile.club.city}{profile.club.country && `, ${profile.club.country}`}
                    </span>
                  )}
                </>
              ) : profile.clubName ? (
                <span className={styles.relationName}>{profile.clubName}</span>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftProfileColumn;