import Banner from '../components/Banner/Banner';
import AthleteList from '../components/Dashboard/AthleteList';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { useAuth } from '../context/useAuth'; // Asegúrate de importar el hook

function Home() {
  const { user } = useAuth(); // Obtén el usuario del contexto

  return (
    <>
      <Banner>
        <h1 className={styles.bannerTitle}>
          Empower Local Talent,<br />
          Fuel the Future of Sport
        </h1>
        <p className={styles.bannerText}>
          Linking passionate sponsors with the brightest local athletes to help them reach their full potential.
        </p>
        {/* Solo muestra el botón si NO hay usuario logueado */}
        {!user && (
          <Link to="/register" className={styles.registerBtn}>
            Register <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: '1.3em' }}>→</span>
          </Link>
        )}
      </Banner>

      <div className={styles.textSection}>
        <h2 className={styles.textSectionTitle}>
          Discover Top Local Athletes
        </h2>
        <p className={styles.textSectionDesc}>
          Explore our curated list of talented athletes ready to take their careers to the next level.
        </p>
      </div>

      <div className={styles.athleteListWrapper}>
        <AthleteList limit={12} showSeeMore={true} />
      </div>
    </>
  );
}

export default Home;