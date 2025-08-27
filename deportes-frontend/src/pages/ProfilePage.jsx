import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import ProfileFeed from "../components/Profile/Feed/ProfileFeed.jsx";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch(`https://deportes-production.up.railway.app/deportistas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
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

  const handleContact = () => {
    // Lógica para contactar
    alert("Función de contacto");
  };

  const handleShare = () => {
    // Lógica para compartir perfil
    if (navigator.share) {
      navigator.share({
        title: `${profile.name} ${profile.lastName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header del perfil */}
      <div className={styles.profileHeader}>
        {/* Foto de perfil */}
        <div className={styles.avatarContainer}>
          <img
            src={profile.photo || "https://placehold.co/120x120?text=Sin+Foto"}
            alt={`${profile.name || ""} ${profile.lastName || ""}`}
            className={styles.avatar}
          />
        </div>

        {/* Nombre */}
        <h1 className={styles.name}>{profile.name} {profile.lastName}</h1>

        {/* Deporte */}
        <div className={styles.sportBadge}>
          {profile.sport || "Deportista"}
        </div>

        {/* Ubicación y edad */}
        <div className={styles.location}>
          📍 {profile.city && profile.country ? `${profile.city}, ${profile.country}` : 'Ubicación no especificada'}
          {profile.age && (
            <>
              <span className={styles.separator}>📅</span>
              {profile.age} años
            </>
          )}
        </div>

        {/* Botones de acción */}
        <div className={styles.actionButtons}>
          {!isMyProfile && (
            <>
              <button className={styles.contactBtn} onClick={handleContact}>
                💬 Contactar
              </button>
              <button 
                className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                onClick={handleFollow}
              >
                👤 {isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
            </>
          )}
          {isMyProfile && (
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/profile/${profile._id}/edit`)}
            >
              ✏️ Editar perfil
            </button>
          )}
          <button className={styles.shareBtn} onClick={handleShare}>
            📤
          </button>
        </div>
      </div>

      {/* Pestañas */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "feed" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("feed")}
        >
          Feed
        </button>
        <button
          className={`${styles.tab} ${activeTab === "perfil" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("perfil")}
        >
          Perfil
        </button>
        <button
          className={`${styles.tab} ${activeTab === "logros" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("logros")}
        >
          Logros
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className={styles.tabContent}>
        {activeTab === "feed" && (
          <ProfileFeed profileId={profile._id} isMyProfile={isMyProfile} />
        )}
        
        {activeTab === "perfil" && (
          <div className={styles.profileInfo}>
            <div className={styles.section}>
              <h3>Acerca de</h3>
              <p>{profile.about || "Sin descripción"}</p>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div className={styles.section}>
                <h3>Habilidades</h3>
                <div className={styles.skillsList}>
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h3>Experiencia deportiva</h3>
              {profile.experience && profile.experience.length > 0 ? (
                <ul>
                  {profile.experience.map((exp, i) => <li key={i}>{exp}</li>)}
                </ul>
              ) : (
                <p className={styles.empty}>Sin experiencia registrada</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "logros" && (
          <div className={styles.achievementsContent}>
            <div className={styles.section}>
              <h3>Reconocimientos deportivos</h3>
              {profile.recognitions && profile.recognitions.length > 0 ? (
                <ul>
                  {profile.recognitions.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              ) : (
                <p className={styles.empty}>Sin reconocimientos</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;