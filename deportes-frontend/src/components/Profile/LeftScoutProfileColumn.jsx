import React from "react";
import styles from "./LeftProfileColumn.module.css";

function LeftScoutProfileColumn({ profile }) {
  if (!profile) return null;

  const certificationUrl = profile.certifications && profile.certifications.length > 0 
    ? profile.certifications[0] 
    : null;

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
          {profile.specialization || "Sports Professional"}
        </div>
      </div>

      <div className={styles.contentBelow}>
        <div className={styles.levelAge}>
          <span>
            <strong>Company:</strong> {profile.company || "Independent"}
          </span>
          |
          <span>
            <strong>Age:</strong> {profile.age || "N/A"}
          </span>
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

        {profile.sports && profile.sports.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>Sports Specialization</h4>
            <div className={styles.skillsList}>
              {profile.sports.map((sport, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {sport}
                </span>
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

        {certificationUrl && (
          <div className={styles.certificationsSection}>
            <div className={styles.sectionHeader}>
              <h4>Certification</h4>
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
              <span>View Professional Certification</span>
              <svg 
                className={styles.externalIcon} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        )}

        {profile.clubs && profile.clubs.length > 0 && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/club-logo.png"
                alt="club icon"
                className={styles.relationIcon}
              />
              <h4>Associated Clubs</h4>
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

        {profile.sponsors && profile.sponsors.length > 0 && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img
                src="/assets/sponsor-logo.png"
                alt="sponsor icon"
                className={styles.relationIcon}
              />
              <h4>Sponsors</h4>
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