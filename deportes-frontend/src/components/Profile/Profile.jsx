import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import styles from "./Profile.module.css";

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/deportistas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className={styles.loading}>Cargando perfil...</div>;
  if (!profile) return <div className={styles.loading}>Perfil no encontrado.</div>;

  const isMyProfile = user && user.id === profile._id;
  const isAdmin = user && user.profileType === "admin";
  const canSeePrivate = isAdmin || isMyProfile;

  return (
    <div className={styles.profileCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatarBox}>
          <img
            src={profile.photo || "https://placehold.co/220x220?text=Sin+Foto"}
            alt={`${profile.name || ""} ${profile.lastName || ""}`}
            className={styles.avatar}
          />
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.name}>{profile.name} {profile.lastName}</h2>
          <div className={styles.meta}>
            <span className={styles.sport}>{profile.sport}</span>
            {profile.gender && <span className={styles.dot}>•</span>}
            <span className={styles.gender}>{profile.gender}</span>
            {profile.age && (
              <>
                <span className={styles.dot}>•</span>
                <span className={styles.age}>{profile.age} años</span>
              </>
            )}
            {profile.city && (
              <>
                <span className={styles.dot}>•</span>
                <span className={styles.city}>{profile.city}</span>
              </>
            )}
            {profile.country && (
              <>
                <span className={styles.dot}>•</span>
                <span className={styles.country}>{profile.country}</span>
              </>
            )}
          </div>
          {canSeePrivate && (
            <div className={styles.privateInfo}>
              <span>{profile.email}</span>
              <span className={styles.dot}>•</span>
              <span>{profile.phone}</span>
            </div>
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

      {/* Secciones */}
      <div className={styles.sections}>
        <Section title="Acerca de">
          {profile.about || <span className={styles.empty}>Sin descripción</span>}
        </Section>
        <Section title="Experiencia deportiva">
          {profile.experience && profile.experience.length > 0 ? (
            <ul className={styles.list}>
              {profile.experience.map((exp, i) => <li key={i}>{exp}</li>)}
            </ul>
          ) : (
            <span className={styles.empty}>Sin experiencia registrada</span>
          )}
        </Section>
        <Section title="Reconocimientos deportivos">
          {profile.recognitions && profile.recognitions.length > 0 ? (
            <ul className={styles.list}>
              {profile.recognitions.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
          ) : (
            <span className={styles.empty}>Sin reconocimientos</span>
          )}
        </Section>
        <Section title="Skills">
          {profile.skills && profile.skills.length > 0 ? (
            <ul className={styles.skillsList}>
              {profile.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.empty}>Sin skills</span>
          )}
        </Section>
        {(profile.profileType === "scout" || profile.profileType === "sponsor") && (
          <Section title="Certificaciones">
            {profile.certifications && profile.certifications.length > 0 ? (
              <ul className={styles.list}>
                {profile.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
              </ul>
            ) : (
              <span className={styles.empty}>Sin certificaciones</span>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="profile-section">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

export default Profile;