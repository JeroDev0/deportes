import React, { useState, useEffect } from "react";
import styles from "./CenterProfileColumn.module.css";

function CenterProfileColumn({ profile }) {
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
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      {/* Header */}
      <div className={styles.header}>
        <h1>{profile.name} {profile.lastName}</h1>
        <div className={styles.followers}>
          {followers} Followers
          <button onClick={toggleFollow} className={styles.followBtn}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {/* Sponsorship bar */}
      <div className={styles.sponsorship}>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${(sponsorshipFunded / sponsorshipGoal) * 100}%` }}
          />
        </div>
        <div className={styles.sponsorInfo}>
          €{sponsorshipFunded} funded of €{sponsorshipGoal} goal
          <button className={styles.sponsorBtn}>Sponsor now</button>
        </div>
      </div>

      {/* About */}
      <section className={styles.aboutSection}>
        <h2>About</h2>
        <p>{profile.about || "No description available."}</p>
      </section>

      {/* Gallery */}
      <section className={styles.gallerySection}>
        <h2>Gallery</h2>
        <div className={styles.galleryGrid}>
          {posts.map((post) => (
            <div 
              key={post._id} 
              className={styles.postItem}
              onClick={() => window.open(post.mediaUrl, "_blank")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') window.open(post.mediaUrl, "_blank"); }}
            >
              {post.type === "image" && (
                <img src={post.mediaUrl} alt={`Post media`} />
              )}
              {post.type === "video" && (
                <video muted>
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
          {posts.length === 0 && <p>No recent posts.</p>}
        </div>
      </section>

      {/* Achievements */}
      <section className={styles.achievementsSection}>
        <h2>Achievements</h2>
        <ul>
          {profile.recognitions && profile.recognitions.length > 0 ? (
            profile.recognitions.map((rec, idx) => <li key={idx}>⭐ {rec}</li>)
          ) : (
            <li>No achievements listed.</li>
          )}
        </ul>
      </section>

      {/* Career */}
      <section className={styles.careerSection}>
        <h2>Career</h2>
        <ul>
          {profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp, idx) => <li key={idx}>{exp}</li>)
          ) : (
            <li>No career information available.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default CenterProfileColumn;