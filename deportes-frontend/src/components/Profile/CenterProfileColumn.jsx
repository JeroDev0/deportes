import React, { useState, useEffect } from "react";
import styles from "./CenterProfileColumn.module.css";
import { useNavigate } from "react-router-dom";

function CenterProfileColumn({ profile = {}, onNavigateToFeed }) {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(219);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

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

  const goToFeed = () => {
    if (typeof onNavigateToFeed === "function") {
      onNavigateToFeed();
    }
  };

  return (
    <div className={styles.centerCard}>
      {/* --- Nav menu --- */}
      <div className={styles.navMenu}>
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

      {/* Short Description */}
      <section id="shortDescSection" className={styles.shortDescSection}>
        <div className={styles.sectionHeader}>
          <h2>Short Description</h2>
        </div>
        <p className={styles.shortDescText}>
          {profile?.shortDescription || "No short description available."}
        </p>
      </section>

      {/* About - My Story */}
      <section id="aboutSection" className={styles.aboutSection}>
        <div className={styles.sectionHeader}>
          <h2>My Story</h2>
        </div>
        <p>{profile?.about || "No story available."}</p>
      </section>

      {/* Gallery */}
      <section id="gallerySection" className={styles.gallerySection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_list.svg" alt="gallery icon" />
          <h2>Gallery</h2>
          <button
            className={styles.showAll}
            onClick={goToFeed}
            type="button"
          >
            Show all <img src="/assets/icon_arrow_medium.svg" alt="arrow" />
          </button>
        </div>
        <div className={styles.galleryGrid}>
          {posts?.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className={styles.postItem}
                onClick={goToFeed}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToFeed();
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