import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import LeftProfileColumn from "../components/Profile/LeftProfileColumn.jsx";
import CenterProfileColumn from "../components/Profile/CenterProfileColumn.jsx";
import RightProfileColumn from "../components/Profile/RightProfileColumn.jsx";
import styles from "./ProfilePage.module.css";
import SponsorSection from "../components/Profile/SponsorSection/SponsorSection.jsx";


function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch(`https://deportes-production.up.railway.app/deportistas/${id}`)
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Aquí iría la lógica para seguir/dejar de seguir
  };

  return (
    <div className={styles.pageContainer}>
      {/* Columna izquierda */}
      <div className={styles.leftColumn}>
        <LeftProfileColumn 
          profile={profile} 
          isMyProfile={isMyProfile} 
          isFollowing={isFollowing}
          onFollow={handleFollow}
        />
      </div>

      {/* Columna central */}
      <div className={styles.centerColumn}>
        <CenterProfileColumn 
          profile={profile} 
          isMyProfile={isMyProfile} 
        />
        <SponsorSection />
      </div>

      {/* Columna derecha */}
      <div className={styles.rightColumn}>
        <RightProfileColumn 
          profile={profile} 
          isMyProfile={isMyProfile} 
        />
      </div>
    </div>
  );
}

export default ProfilePage;