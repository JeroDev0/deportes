import styles from './AthleteCard.module.css';

function AthleteCard({ athlete, onClick }) {
  return (
    <div className={styles.card} onClick={onClick} tabIndex={0}>
      <div className={styles.photoWrapper}>
        <img
          src={athlete.photo}
          alt={`${athlete.name} ${athlete.lastName}`}
          className={styles.photo}
        />
        <span className={styles.sportBadge}>{athlete.sport}</span>
      </div>
      <div className={styles.info}>
        <h3>
          <div>{athlete.name}</div>
          <div>{athlete.lastName}</div>
        </h3>
        <p className={styles.levelAge}>
          {athlete.level} | {athlete.age}
        </p>
      </div>
      <div className={styles.animatedBar}></div>
    </div>
  );
}

export default AthleteCard;