import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/useAuth";
import MapSlide from "./MapSlide";
import styles from "./HeroBannerCarousel.module.css";

const BANNER_BG = "https://res.cloudinary.com/dx9l2xf44/image/upload/v1756346268/celebration_v02_uatgnd.webp";
const INTERVAL = 9000;

export default function HeroBannerCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const next = useCallback(() => setActive(a => (a + 1) % 2), []);
  const go = useCallback((i) => { setActive(i); setPaused(true); }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  // reanudar auto-avance 15s después de interacción manual
  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 15000);
    return () => clearTimeout(id);
  }, [paused]);

  return (
    <div className={styles.carousel} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>

      {/* ── Slide 0: Banner de texto ── */}
      <div className={`${styles.slide} ${active === 0 ? styles.slideActive : ""}`}>
        <div className={styles.bannerBg} style={{ backgroundImage: `url(${BANNER_BG})` }}>
          <div className={styles.bannerOverlay} />
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>
              {t("home_title1")}<br />{t("home_title2")}
            </h1>
            <p className={styles.bannerText}>{t("home_text")}</p>
            {!user && (
              <Link to="/register" className={styles.registerBtn}>
                {t("home_register_btn")}
                <span style={{ marginLeft: 8, fontWeight: "bold", fontSize: "1.2em" }}>→</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Slide 1: Mapa interactivo ── */}
      <div className={`${styles.slide} ${active === 1 ? styles.slideActive : ""}`}>
        <MapSlide active={active === 1} />
      </div>

      {/* ── Controles ── */}
      <div className={styles.controls}>
        <button
          className={styles.arrow}
          onClick={() => go((active + 1) % 2)}
          aria-label="Siguiente slide"
        >
          {active === 0 ? "🗺️ Mapa global" : "✦ Inicio"}
        </button>
      </div>

      {/* ── Dots ── */}
      <div className={styles.dots}>
        {[0, 1].map(i => (
          <button
            key={i}
            className={`${styles.dot} ${active === i ? styles.dotActive : ""}`}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
