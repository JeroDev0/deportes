import { useEffect, useState } from "react";
import AthleteCard from "../components/Dashboard/AthleteCard";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://deportes-production.up.railway.app";

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

const profileTypes = [
  { label: "All", value: "" },
  { label: "Athletes", value: "athlete" },
  { label: "Scouts", value: "scout" },
  { label: "Sponsors", value: "sponsor" },
];

// Normaliza cada perfil al shape que espera AthleteCard
function normalizeProfile(profile, type) {
  switch (type) {
    case "athlete":
      return {
        ...profile,
        _type: "athlete",
        _route: `/profile/${profile._id}`,
        // AthleteCard usa estos campos directamente:
        photo: profile.photo || "",
        sport: profile.sport || "Athlete",
        name: profile.name || "",
        lastName: profile.lastName || "",
        level: profile.level || "",
        age: profile.age || "",
        // Para filtros:
        _city: profile.city || "",
        _gender: profile.gender || "",
        _age: profile.age || null,
      };
    case "scout":
      return {
        ...profile,
        _type: "scout",
        _route: `/scout-profile/${profile._id}`,
        photo: profile.photo || "",
        sport: profile.specialization || profile.company || "Scout",
        name: profile.name || "",
        lastName: profile.lastName || "",
        level: "Scout",
        age: profile.company || "",
        _city: profile.city || "",
        _gender: profile.gender || "",
        _age: profile.age || null,
      };
    case "sponsor":
      return {
        ...profile,
        _type: "sponsor",
        _route: `/sponsor-profile/${profile._id}`,
        photo: profile.logo || "",
        sport: profile.industry || "Sponsor",
        name: profile.company || profile.name || "",
        lastName: "",
        level: "Sponsor",
        age: profile.city || "",
        _city: profile.city || "",
        _gender: "",
        _age: null,
      };
    default:
      return profile;
  }
}

function Dashboard() {
  const [allProfiles, setAllProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileType, setProfileType] = useState("");
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
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/deportistas`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/scouts`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/sponsors`).then(r => r.json()).catch(() => []),
    ]).then(([athletes, scouts, sponsors]) => {
      const normalized = [
        ...athletes.map(p => normalizeProfile(p, "athlete")),
        ...scouts.map(p => normalizeProfile(p, "scout")),
        ...sponsors.map(p => normalizeProfile(p, "sponsor")),
      ];
      setAllProfiles(normalized);
      setFiltered(normalized);

      setCities([...new Set(athletes.map(a => a.city).filter(Boolean))]);
      setSports([...new Set(athletes.map(a => a.sport).filter(Boolean))]);
      setLevels([...new Set(athletes.map(a => a.level).filter(Boolean))]);

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = allProfiles;

    if (profileType) result = result.filter(p => p._type === profileType);
    if (city) result = result.filter(p => p._city === city);
    if (sport) result = result.filter(p => p._type === "athlete" && p.sport === sport);
    if (gender) result = result.filter(p => p._gender === gender);
    if (level) result = result.filter(p => p._type === "athlete" && p.level === level);
    if (ageRange) {
      const range = ageRanges.find(r => r.label === ageRange);
      result = result.filter(p => p._age >= range.min && p._age <= range.max);
    }

    setFiltered(result);
  }, [profileType, city, sport, ageRange, gender, level, allProfiles]);

  const showAthleteFilters = profileType === "" || profileType === "athlete";

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.filtersSidebar}>

        <label>Profile Type</label>
        <select
          className={styles.filterSelect}
          value={profileType}
          onChange={(e) => {
            setProfileType(e.target.value);
            setSport("");
            setLevel("");
            setGender("");
            setAgeRange("");
            setCity("");
          }}
        >
          {profileTypes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {showAthleteFilters && (
          <>
            <label>Age</label>
            <select
              className={styles.filterSelect}
              value={ageRange}
              onChange={e => setAgeRange(e.target.value)}
            >
              <option value="">All Ages</option>
              {ageRanges.map(r => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>

            <label>Gender</label>
            <select
              className={styles.filterSelect}
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              {genders.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>

            <label>Sport</label>
            <select
              className={styles.filterSelect}
              value={sport}
              onChange={e => setSport(e.target.value)}
            >
              <option value="">Any</option>
              {sports.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label>Level</label>
            <select
              className={styles.filterSelect}
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>

            <label>City of Birth</label>
            <select
              className={styles.filterSelect}
              value={city}
              onChange={e => setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </>
        )}
      </aside>

      <main className={styles.cardsContainer}>
        {loading ? (
          <p style={{ color: "#eaf6ff", fontWeight: 600 }}>Loading profiles...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#eaf6ff", fontWeight: 600 }}>No profiles found.</p>
        ) : (
          filtered.map(profile => (
            <AthleteCard
              key={`${profile._type}-${profile._id}`}
              athlete={profile}
              onClick={() => navigate(profile._route)}
            />
          ))
        )}
      </main>
    </div>
  );
}

export default Dashboard;