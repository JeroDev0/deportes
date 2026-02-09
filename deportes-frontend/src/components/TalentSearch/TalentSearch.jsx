import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TalentSearch.module.css';

function TalentSearch() {
  const [location, setLocation] = useState('');
  const [discipline, setDiscipline] = useState('');
  const navigate = useNavigate();

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
          <h2 className={styles.title}>Find Your Local Talents</h2>
          <p className={styles.subtitle}>Discover amazing athletes in your area</p>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className={styles.labelText}>Location</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.select}
            >
              <option value="">Select City</option>
              <option value="Hamburg">Hamburg</option>
              <option value="Berlin">Berlin</option>
              <option value="Munich">Munich</option>
              <option value="Cologne">Cologne</option>
              <option value="Frankfurt">Frankfurt</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span className={styles.labelText}>Discipline</span>
            </label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className={styles.select}
            >
              <option value="">All Sports</option>
              <option value="Soccer">Soccer</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Gymnastics">Gymnastics</option>
            </select>
          </div>

          <button onClick={handleSearch} className={styles.searchBtn}>
            <span>Show Talents</span>
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