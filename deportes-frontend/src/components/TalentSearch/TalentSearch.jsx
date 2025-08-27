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
      <span className={styles.label}>Find your local talents now:</span>
      <div className={styles.controls}>
        <label>
          Where
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
        </label>
        <label>
          Discipline
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
        </label>
        <button onClick={handleSearch} className={styles.searchBtn}>
          Show Talents &gt;
        </button>
      </div>
    </div>
  );
}

export default TalentSearch;