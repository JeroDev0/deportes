import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import LeftScoutProfileColumn from "../components/Profile/LeftScoutProfileColumn.jsx";
import CenterScoutProfileColumn from "../components/Profile/CenterScoutProfileColumn.jsx";
import RightProfileColumn from "../components/Profile/RightProfileColumn.jsx";
import styles from "./ProfilePage.module.css";

function ScoutProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch(`https://deportes-production.up.railway.app/scouts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching scout profile:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className={styles.loading}>Cargando perfil...</div>;
  if (!profile) return <div className={styles.loading}>Perfil no encontrado.</div>;

  const isMyProfile = user && user.id === profile._id;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      {/* Banner superior */}
      <div className={styles.bannerWrapper}>
        <img
          src="https://res.cloudinary.com/dx9l2xf44/image/upload/v1767898680/Talento_y_Reserva_Indervalle_banner_uasxge.webp"
          alt="Banner Talento y Reserva Indervalle"
          className={styles.bannerImage}
        />
      </div>

      {/* Contenido del perfil scout */}
      <div className={styles.pageContainer}>
        <div className={styles.leftColumn}>
          <LeftScoutProfileColumn 
            profile={profile} 
            isMyProfile={isMyProfile} 
            isFollowing={isFollowing}
            onFollow={handleFollow}
          />
        </div>

        <div className={styles.centerColumn}>
          <CenterScoutProfileColumn 
            profile={profile} 
            isMyProfile={isMyProfile} 
          />
        </div>

        <div className={styles.rightColumn}>
          <RightProfileColumn 
            profile={profile} 
            isMyProfile={isMyProfile} 
          />
        </div>
      </div>
    </>
  );
}

export default ScoutProfilePage;