
import React, { useState, useEffect } from "react";
import styles from "./CenterProfileColumn.module.css";
import { useNavigate } from "react-router-dom";

function CenterProfileColumn({ profile = {} }) {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(219);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const sponsorshipGoal = 2000;
  const sponsorshipFunded = 650;

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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  return (
    <div className={styles.centerCard}>
      {/* --- Nav menu --- */}
      <div className={styles.navMenu}>
        <div className={styles.navLeft}>
          <a href="#aboutSection">About</a>
          <a href="#gallerySection">Gallery</a>
          <a href="#achievementsSection">Achievements</a>
        </div>
        <button
          className={styles.editProfileBtn}
          onClick={() => navigate(`/profile/${profile._id}/edit`)}
        >
          <img src="/assets/icon_edit.svg" alt="edit" />
          Edit Profile
        </button>
      </div>

      {/* Header */}
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

      {/* Sponsorship bar */}
      <div className={styles.sponsorship}>
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{
                width: `${(sponsorshipFunded / sponsorshipGoal) * 100}%`,
              }}
            />
          </div>
          <button className={styles.sponsorBtn}>Sponsor now</button>
        </div>
        <div className={styles.sponsorInfo}>
          €{sponsorshipFunded} funded of €{sponsorshipGoal} goal
        </div>
      </div>

      {/* About */}
      <section id="aboutSection" className={styles.aboutSection}>
        <p>{profile?.about || "No description available."}</p>
      </section>

      {/* Gallery */}
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

      {/* Achievements */}
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

      {/* Career */}
      <section className={styles.careerSection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_list.svg" alt="career icon" />
          <h2>Career</h2>
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
              <span className={styles.itemText}>No career information available.</span>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default CenterProfileColumn;
