import React, { useState, useEffect } from "react";
import styles from "./CenterProfileColumn.module.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function CenterProfileColumn({ profile = {}, onNavigateToFeed, isMyProfile  }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
        {isMyProfile && (
        <button
          className={styles.editProfileBtn}
          onClick={() => navigate(`/profile/${profile._id}/edit`)}
        >
          <img src="/assets/icon_edit.svg" alt="edit" />
          {t("profile_edit")}
        </button>
        )}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.nameBlock}>
          <h1 className={styles.firstName}>{profile?.name || ""}</h1>
          <h1 className={styles.lastName}>{profile?.lastName || ""}</h1>
        </div>
        <div className={styles.followers}>
          {followers} {t("profile_followers")}
          <button onClick={toggleFollow} className={styles.followBtn}>
            {isFollowing ? t("profile_following") : t("profile_follow")}
          </button>
        </div>
      </div>

      {/* Short Description */}
      <section id="shortDescSection" className={styles.shortDescSection}>
        <div className={styles.sectionHeader}>
          <h2>{t("profile_short_desc")}</h2>
        </div>
        <p className={styles.shortDescText}>
          {profile?.shortDescription || t("profile_no_short_desc")}
        </p>
      </section>

      {/* About - My Story */}
      <section id="aboutSection" className={styles.aboutSection}>
        <div className={styles.sectionHeader}>
          <h2>{t("profile_my_story")}</h2>
        </div>
        <p>{profile?.about || t("profile_no_story")}</p>
      </section>

      {/* Gallery */}
      <section id="gallerySection" className={styles.gallerySection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_list.svg" alt="gallery icon" />
          <h2>{t("profile_gallery")}</h2>
          <button className={styles.showAll} onClick={goToFeed} type="button">
            {t("profile_show_all")} <img src="/assets/icon_arrow_medium.svg" alt="arrow" />
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
                    Tu navegador no soporta el video.
                  </video>
                )}
              </div>
            ))
          ) : (
            <p>{t("profile_no_posts")}</p>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section id="achievementsSection" className={styles.achievementsSection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_achievements.svg" alt="trophy" />
          <h2>{t("profile_achievements")}</h2>
        </div>

        <ul className={styles.achievementsList}>
          {Array.isArray(profile?.recognitions) && profile.recognitions.length > 0 ? (
            profile.recognitions.map((rec, idx) => {
              const isObj = rec && typeof rec === "object";
              const desc = isObj ? rec.description : rec;
              const start = isObj ? rec.startYear : null;
              const end = isObj ? rec.endYear : null;
              return (
                <li key={idx}>
                  <img src="/assets/icon_star.svg" className={styles.starIcon} alt="star" />
                  <span className={styles.itemText}>
                    {(start || end) && (
                      <span className={styles.dateRange}>
                        {start || "?"}{end ? ` – ${end}` : ""}
                        {" · "}
                      </span>
                    )}
                    {desc}
                  </span>
                </li>
              );
            })
          ) : (
            <li>
              <span className={styles.itemText}>{t("profile_no_achievements")}</span>
            </li>
          )}
        </ul>
      </section>

      {/* Career */}
      <section className={styles.careerSection}>
        <div className={styles.sectionHeader}>
          <img src="/assets/icon_list.svg" alt="career icon" />
          <h2>{t("profile_career")}</h2>
        </div>

        <ul className={styles.careerList}>
          {Array.isArray(profile?.experience) && profile.experience.length > 0 ? (
            profile.experience.map((exp, idx) => {
              const isObj = exp && typeof exp === "object";
              const desc = isObj ? exp.description : exp;
              const start = isObj ? exp.startYear : null;
              const end = isObj ? exp.endYear : null;
              return (
                <li key={idx}>
                  <span className={styles.itemText}>
                    {(start || end) && (
                      <span className={styles.dateRange}>
                        {start || "?"}{end ? ` – ${end}` : ""}
                        {" · "}
                      </span>
                    )}
                    {desc}
                  </span>
                </li>
              );
            })
          ) : (
            <li>
              <span className={styles.itemText}>{t("profile_no_career")}</span>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default CenterProfileColumn;