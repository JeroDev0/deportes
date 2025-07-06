// src/components/Profile/ProfileMain.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth.js";
import styles from "./ProfileMain.module.css";

function ProfileMain() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const isAdmin = user && user.profileType === "admin";
  const canSeePrivate = isAdmin || isMyProfile;

  return (
    <div className={styles.profileMain}>
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
      {canSeePrivate && (
        <Section title="Contacto privado">
          <span>{profile.email}</span>
          <span> • </span>
          <span>{profile.phone}</span>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

export default ProfileMain;