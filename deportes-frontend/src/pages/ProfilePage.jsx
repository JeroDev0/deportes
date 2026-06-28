import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { apiFetch } from "../config/fetchWithAuth";
import { useLanguage } from "../context/LanguageContext";
import LeftProfileColumn from "../components/Profile/LeftProfileColumn.jsx";
import CenterProfileColumn from "../components/Profile/CenterProfileColumn.jsx";
import RightProfileColumn from "../components/Profile/RightProfileColumn.jsx";
import ProfileFeed from "../components/Profile/Feed/ProfileFeed.jsx";
import SaludMentalTab from "../components/SaludMental/SaludMentalTab.jsx";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState("professional");

  useEffect(() => {
    setLoading(true);
    apiFetch(`/deportistas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className={styles.loading}>Cargando perfil...</div>;
  if (!profile) return <div className={styles.loading}>Perfil no encontrado.</div>;

  const isMyProfile = user && user.id === profile._id;
  const isAdmin = user && user.modelType === "admin";
  const { t } = useLanguage();

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      <div className={styles.bannerWrapper}>
        <img
          src="https://res.cloudinary.com/dx9l2xf44/image/upload/v1767898680/Talento_y_Reserva_Indervalle_banner_uasxge.webp"
          alt="Banner Talento y Reserva Indervalle"
          className={styles.bannerImage}
        />
      </div>

      <div className={styles.pageContainer}>
        <div className={styles.leftColumn}>
          <LeftProfileColumn
            profile={profile}
            isMyProfile={isMyProfile}
            isFollowing={isFollowing}
            onFollow={handleFollow}
            isAdmin={isAdmin}
          />
        </div>

        <div className={styles.centerColumn}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === "professional" ? styles.active : ""}`}
              onClick={() => setViewMode("professional")}
              type="button"
            >
              {t("tab_professional")}
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === "social" ? styles.active : ""}`}
              onClick={() => setViewMode("social")}
              type="button"
            >
              {t("tab_social")}
            </button>
            {isMyProfile && (
              <button
                className={`${styles.toggleBtn} ${viewMode === "salud" ? styles.active : ""}`}
                onClick={() => setViewMode("salud")}
                type="button"
              >
                {t("tab_wellbeing")}
              </button>
            )}
          </div>

          {viewMode === "professional" && (
            <CenterProfileColumn
              profile={profile}
              isMyProfile={isMyProfile}
              onNavigateToFeed={() => setViewMode("social")}
            />
          )}
          {viewMode === "social" && (
            <ProfileFeed profileId={profile._id} isMyProfile={isMyProfile} />
          )}
          {viewMode === "salud" && isMyProfile && (
            <SaludMentalTab profile={profile} />
          )}
        </div>

        <div className={styles.rightColumn}>
          <RightProfileColumn profile={profile} isMyProfile={isMyProfile} />
        </div>
      </div>
    </>
  );
}

export default ProfilePage;