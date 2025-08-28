import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HomeCarousel.module.css';

const newsItems = [
  {
    img: 'https://res.cloudinary.com/dx9l2xf44/image/upload/v1756351364/news1_fvsrzk.webp',
    title: 'CONNECT WITH CLUBS',
    text: `You've put in the work — the sweat, the hours, the sacrifice. Now it's time to be seen. Connect with top-tier clubs who are actively searching for rising athletes ready to make their mark. This is your chance to step onto bigger stages, wear the crest with pride, and keep chasing greatness.`,
},
  {
    img: 'https://res.cloudinary.com/dx9l2xf44/image/upload/v1756351365/news2_u8a3pw.webp',
    title: 'PROFESSIONAL SCOUTS',
    text: `You've put in the work — the sweat, the hours, the sacrifice. Now it's time to be seen. Connect with top-tier clubs who are actively searching for rising athletes ready to make their mark. This is your chance to step onto bigger stages, wear the crest with pride, and keep chasing greatness.`,
    },
  {
    img: 'https://res.cloudinary.com/dx9l2xf44/image/upload/v1756351365/news3_ohcbes.webp',
    title: 'SPONSORING BRANDS',
    text: `You've put in the work — the sweat, the hours, the sacrifice. Now it's time to be seen. Connect with top-tier clubs who are actively searching for rising athletes ready to make their mark. This is your chance to step onto bigger stages, wear the crest with pride, and keep chasing greatness.`,
    
  },
];

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      setIsTablet(window.innerWidth >= 600 && window.innerWidth < 900);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSlidesToShow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const getMaxIndex = () => {
    const slidesToShow = getSlidesToShow();
    return Math.max(0, newsItems.length - slidesToShow);
  };

  const nextSlide = () => {
    const maxIndex = getMaxIndex();
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    const maxIndex = getMaxIndex();
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const goToSlide = (index) => {
    const maxIndex = getMaxIndex();
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, isMobile, isTablet]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const slidesToShow = getSlidesToShow();
  const slideWidth = 100 / slidesToShow;
  const translateX = -currentIndex * slideWidth;

  return (
    <section className={styles.carouselWrapper}>
      <div 
        className={styles.carouselContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div 
          className={styles.carouselTrack}
          style={{
            transform: `translateX(${translateX}%)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {newsItems.map((item, index) => (
            <div 
              key={index} 
              className={styles.slide}
              style={{ width: `${slideWidth}%` }}
            >
              <div className={styles.card}>
                <img src={item.img} alt={item.title} className={styles.cardImage} />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                  <button className={styles.cardButton}>Sponsor now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button 
        className={`${styles.navButton} ${styles.prev}`}
        onClick={prevSlide}
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button 
        className={`${styles.navButton} ${styles.next}`}
        onClick={nextSlide}
        aria-label="Siguiente"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className={styles.dotsContainer}>
        {Array.from({ length: getMaxIndex() + 1 }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}