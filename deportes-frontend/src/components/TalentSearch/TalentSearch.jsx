import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch } from '../../config/fetchWithAuth';
import styles from './TalentSearch.module.css';

function TalentSearch() {
  const [location, setLocation] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    apiFetch('/deportistas')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!Array.isArray(data)) return;
        setCities([...new Set(data.map(a => a.city).filter(Boolean))].sort());
        setSports([...new Set(data.map(a => a.sport).filter(Boolean))].sort());
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (discipline) params.append('discipline', discipline);
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}>{t("search_title")}</h2>
          <p className={styles.subtitle}>{t("search_subtitle")}</p>
        </div>

        <div className={styles.controls}>
          {/* Ciudad */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className={styles.labelText}>{t("search_location")}</span>
            </label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={styles.select}>
              <option value="">{t("search_select_city")}</option>
              {cities.length > 0
                ? cities.map(c => <option key={c} value={c}>{c}</option>)
                : null}
            </select>
          </div>

          {/* Deporte */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span className={styles.labelText}>{t("search_discipline")}</span>
            </label>
            <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className={styles.select}>
              <option value="">{t("search_all_sports")}</option>
              {sports.length > 0
                ? sports.map(s => <option key={s} value={s}>{s}</option>)
                : null}
            </select>
          </div>

          <button onClick={handleSearch} className={styles.searchBtn}>
            <span>{t("search_btn")}</span>
            <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TalentSearch;
