import AthleteList from '../components/Dashboard/AthleteList';
import styles from './Home.module.css';
import TalentSearch from '../components/TalentSearch/TalentSearch';
import HomeCarousel from '../components/home/HomeCarousel';
import HeroBannerCarousel from '../components/home/HeroBannerCarousel';

function Home() {
  return (
    <>
      <HeroBannerCarousel />

      <TalentSearch />

      <div className={styles.athleteListWrapper}>
        <AthleteList limit={4} showSeeMore={true} />
      </div>

      <HomeCarousel />
    </>
  );
}

export default Home;