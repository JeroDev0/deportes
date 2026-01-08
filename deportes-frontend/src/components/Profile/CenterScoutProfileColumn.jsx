import React, { useState, useEffect } from "react";
import styles from "./CenterProfileColumn.module.css";
import { useNavigate } from "react-router-dom";

function CenterScoutProfileColumn({ profile = {}, isMyProfile = false }) {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(112);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(true);

  useEffect(() => {
    if (!profile?._id) return;

    fetch(`https://deportes-production.up.railway.app/publicaciones?user=${profile._id}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts.slice(0, 3));
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, [profile]);

  useEffect(() => {
    if (!profile?._id) return;

    setLoadingAthletes(true);
    
    fetch(`https://deportes-production.up.railway.app/deportistas`)
      .then((res) => res.json())
      .then((data) => {
        const athletesWithThisScout = data.filter(athlete => {
          if (athlete.scout && athlete.scout._id) {
            return athlete.scout._id === profile._id;
          }
          return false;
        });
        
        setAthletes(athletesWithThisScout);
        setLoadingAthletes(false);
      })
      .catch((err) => {
        console.error("Error fetching athletes:", err);
        setLoadingAthletes(false);
      });
  }, [profile]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  return (
    <div className={styles.centerCard}>
      {isMyProfile && (
        <div className={styles.navMenu}>
          <button
            className={styles.editProfileBtn}
            onClick={() => navigate(`/scout-profile/${profile._id}/edit`)}
          >
            <img src="/assets/icon_edit.svg" alt="edit" />
            Edit Profile
          </button>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.nameBlock}>
          <h1 className={styles.firstName}>{profile?.name || ""}</h1>
          <h1 className={styles.lastName}>{profile?.lastName || ""}</h1>
        </div>
        <div className={styles.followers}>
          {followers} Followers
          <button onClick={toggleFollow} className={styles.followBtn}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <section id="shortDescSection" className={styles.shortDescSection}>
        <div className={styles.sectionHeader}>
          <h2>Short Description</h2>
        </div>
        <p className={styles.shortDescText}>
          {profile?.shortDescription || "No short description available."}
        </p>
      </section>

      <section id="aboutSection" className={styles.aboutSection}>
        <div className={styles.sectionHeader}>
          <h2>Professional Bio</h2>
        </div>
        <p>{profile?.about || "No professional bio available."}</p>
      </section>

      <section id="gallerySection" className={styles.gallerySection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_list.svg" alt="gallery icon" />
          <h2>Gallery</h2>
          <div className={styles.showAll}>
            Show all <img src="/assets/icon_arrow_medium.svg" alt="arrow" />
          </div>
        </div>
        <div className={styles.galleryGrid}>
          {posts?.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className={styles.postItem}
                onClick={() => window.open(post.mediaUrl, "_blank")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") window.open(post.mediaUrl, "_blank");
                }}
              >
                {post.type === "image" && (
                  <img src={post.mediaUrl} alt="Post media" />
                )}
                {post.type === "video" && (
                  <video muted>
                    <source src={post.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))
          ) : (
            <p>No recent posts.</p>
          )}
        </div>
      </section>

      <section id="achievementsSection" className={styles.achievementsSection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_achievements.svg" alt="trophy" />
          <h2>Achievements</h2>
        </div>

        <ul className={styles.achievementsList}>
          {Array.isArray(profile?.recognitions) && profile.recognitions.length > 0 ? (
            profile.recognitions.map((rec, idx) => (
              <li key={idx}>
                <img
                  src="/assets/icon_star.svg"
                  className={styles.starIcon}
                  alt="star"
                />
                <span className={styles.itemText}>{rec}</span>
              </li>
            ))
          ) : (
            <li>
              <span className={styles.itemText}>No achievements listed.</span>
            </li>
          )}
        </ul>
      </section>

      <section className={styles.careerSection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_list.svg" alt="career icon" />
          <h2>Professional Experience</h2>
        </div>

        <ul className={styles.careerList}>
          {Array.isArray(profile?.experience) && profile.experience.length > 0 ? (
            profile.experience.map((exp, idx) => (
              <li key={idx}>
                <span className={styles.itemText}>{exp}</span>
              </li>
            ))
          ) : (
            <li>
              <span className={styles.itemText}>No professional experience available.</span>
            </li>
          )}
        </ul>
      </section>

      {loadingAthletes ? (
        <section className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <img src="/assets/icon_network.svg" alt="network icon" />
            <h2>Athletes Under My Guidance</h2>
          </div>
          <p>Loading athletes...</p>
        </section>
      ) : athletes.length > 0 ? (
        <section className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <img src="/assets/icon_network.svg" alt="network icon" />
            <h2>Athletes Under My Guidance</h2>
          </div>

          <div className={styles.athletesGrid}>
            {athletes.map((athlete, idx) => (
              <div 
                key={idx} 
                className={styles.athleteCard} 
                onClick={() => navigate(`/profile/${athlete._id}`)}
              >
                <img 
                  src={athlete.photo || "https://placehold.co/100x100?text=No+Photo"} 
                  alt={`${athlete.name}`}
                  className={styles.athleteAvatar}
                />
                <div className={styles.athleteInfo}>
                  <h4>{athlete.name} {athlete.lastName}</h4>
                  <span className={styles.athleteSport}>{athlete.sport}</span>
                  {athlete.city && athlete.country && (
                    <div className={styles.athleteLocation}>
                      <img 
                        src="/assets/icon_loaction.svg" 
                        alt="location" 
                        className={styles.locationIconSmall}
                      />
                      <span>{athlete.city}, {athlete.country}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <img src="/assets/icon_network.svg" alt="network icon" />
            <h2>Athletes Under My Guidance</h2>
          </div>
          <p>No athletes have selected you as their scout yet.</p>
        </section>
      )}
    </div>
  );
}

export default CenterScoutProfileColumn;