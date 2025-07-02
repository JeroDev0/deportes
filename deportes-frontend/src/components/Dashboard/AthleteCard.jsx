import styles from './AthleteCard.module.css';

function AthleteCard({ athlete, onClick }) {
  return (
    <div className={styles.card} onClick={onClick} tabIndex={0}>
      <div className={styles.photoWrapper}>
        <img src={athlete.photo} alt={`${athlete.name} ${athlete.lastName}`} className={styles.photo} />
        <span className={styles.sportBadge}>{athlete.sport}</span>
      </div>
      <div className={styles.info}>
        <h3>{athlete.name} {athlete.lastName}</h3>
        <p className={styles.city}><i className="fa fa-map-marker-alt" /> {athlete.location}</p>
        <p className={styles.age}>Age: <span>{athlete.age}</span></p>
        <button className={styles.profileBtn}>View Profile</button>
      </div>
    </div>
  );
}

export default AthleteCard;