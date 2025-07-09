import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import { useEffect, useState } from "react";
import styles from "./ProfileSidebar.module.css";

function ProfileSidebar() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div className={styles.sidebarCard}>
      <div className={styles.avatarBox}>
        <img
          src={profile.photo || "https://placehold.co/220x220?text=Sin+Foto"}
          alt={`${profile.name || ""} ${profile.lastName || ""}`}
          className={styles.avatar}
        />
      </div>
      <h2 className={styles.name}>{profile.name} {profile.lastName}</h2>
      <div className={styles.meta}>
        <span>{profile.sport}</span>
        {profile.gender && <span>• {profile.gender}</span>}
        {profile.age && <span>• {profile.age} años</span>}
        {profile.city && <span>• {profile.city}</span>}
        {profile.country && <span>• {profile.country}</span>}
      </div>

      {/* Skills Section */}
      <div className={styles.skillsSection}>
        <h3>Skills</h3>
        {profile.skills && profile.skills.length > 0 ? (
          <ul className={styles.skillsList}>
            {profile.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>Sin skills</div>
        )}
      </div>

      {isMyProfile && (
        <button
          className={styles.editBtn}
          onClick={() => navigate(`/profile/${profile._id}/edit`)}
        >
          Editar perfil
        </button>
      )}
    </div>
  );
}

export default ProfileSidebar;