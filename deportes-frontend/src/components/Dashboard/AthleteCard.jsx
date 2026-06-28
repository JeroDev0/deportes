import styles from './AthleteCard.module.css';

const SPORT_ES = {
  "Soccer": "Fútbol", "Basketball": "Baloncesto", "Tennis": "Tenis",
  "Volleyball": "Voleibol", "Swimming": "Natación", "Athletics": "Atletismo",
  "Cycling": "Ciclismo", "Boxing": "Boxeo", "Chess": "Ajedrez", "Golf": "Golf",
  "Baseball": "Béisbol", "Rugby": "Rugby", "Hockey": "Hockey",
  "Handball": "Balonmano", "Futsal": "Fútbol Sala", "Padel": "Pádel",
  "Gymnastics": "Gimnasia", "Karate": "Kárate", "Judo": "Judo",
  "Taekwondo": "Taekwondo", "Fencing": "Esgrima", "Weightlifting": "Halterofilia",
  "Triathlon": "Triatlón", "Boccia": "Boccia", "Olympic Wrestling": "Lucha Olímpica",
  "Skating": "Patinaje", "Archery": "Tiro con Arco", "Para Cycling": "Paraciclismo",
  "Para Athletics": "Paraatletismo", "Para Swimming": "Paranatación",
  "Para Powerlifting": "Parapowerlifting", "Pickleball": "Pickleball",
};

function getAvatar(gender) {
  const isFemale = gender === 'femenino' || gender === 'female';
  return isFemale ? '/assets/avatar-female.svg' : '/assets/avatar-male.svg';
}

function AthleteCard({ athlete, onClick }) {
  const photoSrc = athlete.photo || getAvatar(athlete.gender || athlete._gender);
  const sportLabel = SPORT_ES[athlete.sport] || athlete.sport || '';
  const typeLabel = athlete._type === 'scout' ? 'Scout'
    : athlete._type === 'sponsor' ? 'Sponsor'
    : '';

  return (
    <div className={styles.card} onClick={onClick} tabIndex={0} role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>

      <div className={styles.photoWrapper}>
        <img
          src={photoSrc}
          alt={`${athlete.name} ${athlete.lastName}`}
          className={styles.photo}
          loading="lazy"
        />
        <div className={styles.gradient} />

        {(sportLabel || typeLabel) && (
          <span className={styles.sportBadge}>
            {typeLabel || sportLabel}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.firstName}>{athlete.name}</p>
        <p className={styles.lastName}>{athlete.lastName}</p>
        <p className={styles.meta}>
          <span className={styles.level}>{athlete.level || typeLabel}</span>
          {athlete.age && <span className={styles.dot}>·</span>}
          {athlete.age && <span>{athlete.age} años</span>}
        </p>
        {(athlete._city || athlete._country) && (
          <p className={styles.location}>
            📍 {[athlete._city, athlete._country].filter(Boolean).join(', ')}
          </p>
        )}
      </div>

      <div className={styles.hoverBar} />
    </div>
  );
}

export default AthleteCard;
