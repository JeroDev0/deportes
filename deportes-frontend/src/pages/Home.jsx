import Banner from '../components/Banner/Banner';
import AthleteList from '../components/Dashboard/AthleteList';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { useAuth } from '../context/useAuth';
import TalentSearch from '../components/TalentSearch/TalentSearch';
import HomeCarousel from '../components/home/HomeCarousel';

function Home() {
  const { user } = useAuth(); // Obtén el usuario del contexto

  return (
    <>
      <Banner>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>
            Empower Local Talent,<br />
            Fuel the Future of Sport
          </h1>
          <p className={styles.bannerText}>
            Linking passionate sponsors with the brightest local athletes...
          </p>

          {!user && (
            <Link to="/register" className={styles.registerBtn}>
              Register <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: '1.3em' }}>→</span>
            </Link>
          )}
        </div>
      </Banner>

      <TalentSearch />

      <div className={styles.athleteListWrapper}>
        <AthleteList limit={4} showSeeMore={true} />
      </div>
      <HomeCarousel />
    </>
  );
}

export default Home;