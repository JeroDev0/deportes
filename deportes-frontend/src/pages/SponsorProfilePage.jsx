import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

import LeftSponsorProfileColumn from "../components/Profile/LeftSponsorProfileColumn.jsx";
import CenterSponsorProfileColumn from "../components/Profile/CenterSponsorProfileColumn.jsx";
import RightProfileColumn from "../components/Profile/RightProfileColumn.jsx";

import styles from "./ProfilePage.module.css";

function SponsorProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://deportes-production.up.railway.app/sponsors/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sponsor profile:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className={styles.loading}>Cargando perfil...</div>;
  if (!profile) return <div className={styles.loading}>Perfil no encontrado.</div>;

  const isMyProfile = user && user.id === profile._id;

  return (
    <>
      {/* Banner */}
      <div className={styles.bannerWrapper}>
        <img
          src="https://res.cloudinary.com/dx9l2xf44/image/upload/v1767898680/Talento_y_Reserva_Indervalle_banner_uasxge.webp"
          alt="Sponsor banner"
          className={styles.bannerImage}
        />
      </div>

      <div className={styles.pageContainer}>
        <div className={styles.leftColumn}>
          <LeftSponsorProfileColumn profile={profile} />
        </div>

        <div className={styles.centerColumn}>
          <CenterSponsorProfileColumn
            profile={profile}
            isMyProfile={isMyProfile}
          />
        </div>

        <div className={styles.rightColumn}>
          <RightProfileColumn profile={profile} isMyProfile={isMyProfile} />
        </div>
      </div>
    </>
  );
}

export default SponsorProfilePage;