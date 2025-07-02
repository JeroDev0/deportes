import { useEffect, useState } from "react";
import AthleteCard from "../components/Dashboard/AthleteCard";
import styles from "../components/Dashboard/AthleteList.module.css";
import { useNavigate } from "react-router-dom";

const ageRanges = [
  { label: "16-20", min: 16, max: 20 },
  { label: "21-25", min: 21, max: 25 },
  { label: "26-30", min: 26, max: 30 },
  { label: "31-40", min: 31, max: 40 },
  { label: "41+", min: 41, max: 200 },
];

const genders = [
  { label: "All Genders", value: "" },
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
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://deportes-production.up.railway.app/deportistas")
      .then((res) => res.json())
      .then((data) => {
        setAthletes(data);
        setFiltered(data);
        setCities([...new Set(data.map((a) => a.city))]);
        setSports([...new Set(data.map((a) => a.sport))]);
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
    setFiltered(result);
  }, [city, sport, ageRange, gender, athletes]);

  const handleCardClick = (athleteId) => {
    navigate(`/profile/${athleteId}`);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "2rem auto", padding: "0 1rem" }}>
      <h2 style={{ color: "#0d2635", marginBottom: "1.5rem" }}>
        Athlete Profiles
      </h2>
      <div className={styles.filtersBar}>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Ages</option>
          {ageRanges.map((r) => (
            <option key={r.label} value={r.label}>
              {r.label}
            </option>
          ))}
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={styles.filterSelect}
        >
          {genders.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        {(city || sport || ageRange || gender) && (
          <button
            onClick={() => {
              setCity("");
              setSport("");
              setAgeRange("");
              setGender("");
            }}
            className={styles.clearBtn}
          >
            Clear filters
          </button>
        )}
      </div>
      <div className={styles.gridDashboard}>
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
      </div>
    </div>
  );
}

export default Dashboard;