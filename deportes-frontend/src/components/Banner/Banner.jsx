import styles from './Banner.module.css';

function Banner({ children }) {
  return (
    <div className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Banner;