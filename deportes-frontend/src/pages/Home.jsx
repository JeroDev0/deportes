import Banner from '../components/Banner/Banner';
import AthleteList from '../components/Dashboard/AthleteList';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/LanguageContext';
import TalentSearch from '../components/TalentSearch/TalentSearch';
import HomeCarousel from '../components/home/HomeCarousel';

function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <>
      <Banner>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>
            {t("home_title1")}<br />
            {t("home_title2")}
          </h1>
          <p className={styles.bannerText}>
            {t("home_text")}
          </p>

          {!user && (
            <Link to="/register" className={styles.registerBtn}>
              {t("home_register_btn")} <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: '1.3em' }}>→</span>
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