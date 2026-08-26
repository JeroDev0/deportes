import TalentSearch from '../components/TalentSearch/TalentSearch';
import HeroBannerCarousel from '../components/home/HeroBannerCarousel';
import LandingSections from '../components/home/LandingSections';

function Home() {
  return (
    <>
      <HeroBannerCarousel />

      <TalentSearch />

      <LandingSections />
    </>
  );
}

export default Home;