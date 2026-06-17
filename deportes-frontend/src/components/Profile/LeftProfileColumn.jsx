import React from "react";
import styles from "./LeftProfileColumn.module.css";
import { useLanguage } from "../../context/LanguageContext";

const SPORT_ES = {
  "Soccer": "Fútbol", "Basketball": "Baloncesto", "Tennis": "Tenis",
  "Volleyball": "Voleibol", "Swimming": "Natación", "Athletics": "Atletismo",
  "Cycling": "Ciclismo", "Boxing": "Boxeo", "Chess": "Ajedrez", "Golf": "Golf",
  "Baseball": "Béisbol", "Rugby": "Rugby", "Hockey": "Hockey",
  "Handball": "Balonmano", "Futsal": "Fútbol Sala", "Padel": "Pádel",
  "Pickleball": "Pickleball", "Gymnastics": "Gimnasia", "Karate": "Kárate",
  "Judo": "Judo", "Taekwondo": "Taekwondo", "Fencing": "Esgrima",
  "Weightlifting": "Halterofilia", "Triathlon": "Triatlón", "Boccia": "Boccia",
  "Olympic Wrestling": "Lucha Olímpica", "Skating": "Patinaje",
  "Archery": "Tiro con Arco", "Para Cycling": "Paraciclismo",
  "Para Athletics": "Paraatletismo", "Para Swimming": "Paranatación",
  "Para Powerlifting": "Parapowerlifting",
};

const SKILL_ES = {
  "Game/situation reading": "Lectura del juego/situación",
  "Decision making under pressure": "Toma de decisiones bajo presión",
  "Movement or play anticipation": "Anticipación de movimiento o jugada",
  "Tactical adaptability": "Adaptabilidad táctica",
  "Emotional management in competition": "Gestión emocional en competencia",
  "emotional management in competition": "Gestión emocional en competencia",
  "Sustained concentration": "Concentración sostenida",
  "Motor memory / rapid technical learning": "Memoria motriz / aprendizaje técnico rápido",
  "Reaction speed": "Velocidad de reacción",
  "Acceleration / maximum speed": "Aceleración / velocidad máxima",
  "Aerobic endurance": "Resistencia aeróbica",
  "aerobic endurance": "Resistencia aeróbica",
  "Anaerobic endurance": "Resistencia anaeróbica",
  "Muscular power": "Potencia muscular",
  "Functional strength": "Fuerza funcional",
  "Motor coordination": "Coordinación motriz",
  "Balance and body stability": "Equilibrio y estabilidad corporal",
  "Agility and direction changes": "Agilidad y cambios de dirección",
  "Flexibility / joint mobility": "Flexibilidad / movilidad articular",
  "Vertical / horizontal jump": "Salto vertical / horizontal",
  "Postural control in movement": "Control postural en movimiento",
  "Technical execution precision": "Precisión en la ejecución técnica",
  "Sport-specific gesture mastery": "Dominio del gesto específico del deporte",
  "Object/implement control": "Control del objeto/implemento",
  "Movement synchronization": "Sincronización del movimiento",
  "movement synchronization": "Sincronización del movimiento",
  "Energy efficiency in technique": "Eficiencia energética en la técnica",
  "Technical automation capacity": "Capacidad de automatización técnica",
  "Smooth transition between movement phases": "Transición fluida entre fases de movimiento",
  "Effective communication": "Comunicación efectiva (verbal y no verbal)",
  "Teamwork / cooperation": "Trabajo en equipo / cooperación",
  "Sports leadership": "Liderazgo deportivo",
  "Respect for roles and strategies": "Respeto por roles y estrategias",
  "respect for roles and strategies": "Respeto por roles y estrategias",
  "Positive and motivating attitude": "Actitud positiva y motivadora",
  "Discipline and group commitment": "Disciplina y compromiso grupal",
  "Resilience in adversity": "Resiliencia ante la adversidad",
  "Self-confidence in competition": "Confianza en sí mismo en competencia",
  "Competitive stress management": "Gestión del estrés competitivo",
  "Visualization / mental preparation": "Visualización / preparación mental",
  "Focus and activation routines": "Rutinas de enfoque y activación",
  "focus and activation routines": "Rutinas de enfoque y activación",
  "Continuous improvement mindset": "Mentalidad de mejora continua",
  "Ability to receive and apply feedback": "Capacidad para recibir y aplicar retroalimentación",
  "Training consistency": "Consistencia en el entrenamiento",
  "Autonomy in improvement process": "Autonomía en el proceso de mejora",
  "autonomy in improvement process": "Autonomía en el proceso de mejora",
  "Technical / tactical curiosity": "Curiosidad técnica / táctica",
  "Adaptability to new environments": "Adaptabilidad a nuevos entornos",
  "Commitment to sports objectives": "Compromiso con los objetivos deportivos",
};

function calcAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? age : null;
}

function LeftProfileColumn({ profile, isAdmin = false }) {
  const { t } = useLanguage();
  if (!profile) return null;

  const age = calcAge(profile.birthDate) ?? profile.age;

  return (
    <div className={styles.profileCard}>
      {profile.boosted && <div className={styles.boostedBadge}>Boosted</div>}

      <div className={styles.avatarContainer}>
        <img
          src={profile.photo || "https://placehold.co/400x400?text=Sin+Foto"}
          alt={`${profile.name} ${profile.lastName}`}
          className={styles.avatar}
        />
        <div className={styles.sportBadge}>{SPORT_ES[profile.sport] || profile.sport || "Deportista"}</div>
      </div>

      <div className={styles.contentBelow}>
        <div className={styles.levelAge}>
          <span><strong>{t("profile_level")}:</strong> {profile.level || "Amateur"}</span>
          |
          <span><strong>{t("profile_age")}:</strong> {age ?? "N/A"}</span>
        </div>

        {profile.gender && (
          <div className={styles.gender}>
            <span>
              <strong>{t("profile_gender")}:</strong> {(profile.gender === "male" || profile.gender === "masculino") ? t("profile_male") : t("profile_female")}
            </span>
          </div>
        )}

        <div className={styles.location}>
          <img
            src="/assets/icon_loaction.svg"
            alt="location icon"
            className={styles.locationIcon}
          />
          <span>
            <strong>{profile.city || "Ciudad"}</strong> | {profile.country || "País"}
          </span>
        </div>

        {/* Solo visible para admin */}
        {isAdmin && (profile.postalCode || profile.address) && (
          <div className={styles.addressInfo}>
            {profile.address && (
              <div className={styles.addressItem}>
                <span className={styles.addressLabel}>{t("profile_address")}:</span>
                <span className={styles.addressValue}>{profile.address}</span>
              </div>
            )}
            {profile.postalCode && (
              <div className={styles.addressItem}>
                <span className={styles.addressLabel}>{t("profile_postal")}:</span>
                <span className={styles.addressValue}>{profile.postalCode}</span>
              </div>
            )}
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div className={styles.skillsContainer}>
            <h4>{t("profile_style")}</h4>
            <div className={styles.skillsList}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} className={styles.skillTag}>{SKILL_ES[skill] || skill}</span>
              ))}
            </div>
          </div>
        )}

        {(profile.birthCountry || profile.birthCity) && (
          <div className={styles.birthInfo}>
            <div className={styles.sectionHeader}>
              <h4>{t("profile_birth_place")}</h4>
            </div>
            <div className={styles.birthLocation}>
              {profile.birthCity && <strong>{profile.birthCity}</strong>}
              {profile.birthCity && profile.birthCountry && " | "}
              {profile.birthCountry}
            </div>
          </div>
        )}

        {Array.isArray(profile.nationalities) && profile.nationalities.length > 0 && (
          <div className={styles.nationalitiesInfo}>
            <div className={styles.sectionHeader}>
              <h4>{t("profile_nationalities")}</h4>
            </div>
            <div className={styles.nationalitiesList}>
              {profile.nationalities.map((code, idx) => {
                let name = code;
                try {
                  name = new Intl.DisplayNames(["es"], { type: "region" }).of(code) || code;
                } catch (_) {}
                return (
                  <span key={idx} className={styles.nationalityTag}>{name}</span>
                );
              })}
            </div>
          </div>
        )}

        {(profile.scout || profile.scoutName) && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img src="/assets/scout-logo.png" alt="scout icon" className={styles.relationIcon} />
              <h4>Scout</h4>
            </div>
            <div className={styles.relationInfo}>
              {profile.scout?._id ? (
                <>
                  <span className={styles.relationName}>
                    {profile.scout.name} {profile.scout.lastName}
                  </span>
                  {profile.scout.specialization && (
                    <span className={styles.relationSpecialty}>{profile.scout.specialization}</span>
                  )}
                </>
              ) : profile.scoutName ? (
                <span className={styles.relationName}>{profile.scoutName}</span>
              ) : null}
            </div>
          </div>
        )}

        {(profile.sponsor || profile.sponsorName) && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img src="/assets/sponsor-logo.png" alt="sponsor icon" className={styles.relationIcon} />
              <h4>{t("profile_sponsor")}</h4>
            </div>
            <div className={styles.relationInfo}>
              {profile.sponsor?._id ? (
                <>
                  <span className={styles.relationName}>
                    {profile.sponsor.name || profile.sponsor.companyName}
                  </span>
                  {profile.sponsor.industry && (
                    <span className={styles.relationSpecialty}>{profile.sponsor.industry}</span>
                  )}
                </>
              ) : profile.sponsorName ? (
                <span className={styles.relationName}>{profile.sponsorName}</span>
              ) : null}
            </div>
          </div>
        )}

        {(profile.club || profile.clubName) && (
          <div className={styles.relationItem}>
            <div className={styles.relationHeader}>
              <img src="/assets/club-logo.png" alt="club icon" className={styles.relationIcon} />
              <h4>Club</h4>
            </div>
            <div className={styles.relationInfo}>
              {profile.club?._id ? (
                <>
                  <span className={styles.relationName}>{profile.club.name}</span>
                  {profile.club.city && (
                    <span className={styles.relationSpecialty}>
                      {profile.club.city}{profile.club.country && `, ${profile.club.country}`}
                    </span>
                  )}
                </>
              ) : profile.clubName ? (
                <span className={styles.relationName}>{profile.clubName}</span>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftProfileColumn;