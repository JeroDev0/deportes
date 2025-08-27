import { useEffect, useState } from "react";
import AthleteCard from "../components/Dashboard/AthleteCard";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const ageRanges = [
  { label: "16-20", min: 16, max: 20 },
  { label: "21-25", min: 21, max: 25 },
  { label: "26-30", min: 26, max: 30 },
  { label: "31-40", min: 31, max: 40 },
  { label: "41+", min: 41, max: 200 },
];

const genders = [
  { label: "Any", value: "" },
  { label: "Female", value: "femenino" },
  { label: "Male", value: "masculino" },
];

function Dashboard() {
  const [athletes, setAthletes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState("");
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://deportes-production.up.railway.app/deportistas")
      .then((res) => res.json())
      .then((data) => {
        setAthletes(data);
        setFiltered(data);
        setCities([...new Set(data.map((a) => a.city))]);
        setSports([...new Set(data.map((a) => a.sport))]);
        setLevels([...new Set(data.map((a) => a.level))]);
      });
  }, []);

  useEffect(() => {
    let result = athletes;
    if (city) result = result.filter((a) => a.city === city);
    if (sport) result = result.filter((a) => a.sport === sport);
    if (ageRange) {
      const range = ageRanges.find((r) => r.label === ageRange);
      result = result.filter((a) => a.age >= range.min && a.age <= range.max);
    }
    if (gender) result = result.filter((a) => a.gender === gender);
    if (level) result = result.filter((a) => a.level === level);
    setFiltered(result);
  }, [city, sport, ageRange, gender, level, athletes]);

  const handleCardClick = (athleteId) => {
    navigate(`/profile/${athleteId}`);
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.filtersSidebar}>
        <label>Age</label>
        <select
          className={styles.filterSelect}
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        >
          <option value="">All Ages</option>
          {ageRanges.map((r) => (
            <option key={r.label} value={r.label}>
              {r.label}
            </option>
          ))}
        </select>

        <label>Gender</label>
        <select
          className={styles.filterSelect}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          {genders.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>

        <label>Sport</label>
        <select
          className={styles.filterSelect}
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          <option value="">Any</option>
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label>Level</label>
        <select
          className={styles.filterSelect}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <label>City of Birth</label>
        <select
          className={styles.filterSelect}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </aside>

      <main className={styles.cardsContainer}>
        {filtered.length === 0 ? (
          <p style={{ color: "#0d2635", fontWeight: 600 }}>
            No athletes found.
          </p>
        ) : (
          filtered.map((athlete) => (
            <AthleteCard
              key={athlete._id}
              athlete={athlete}
              onClick={() => handleCardClick(athlete._id)}
            />
          ))
        )}
      </main>
    </div>
  );
}

export default Dashboard;