'use client';

import { useEffect, useState } from "react";
import AthleteCard from "../components/Dashboard/AthleteCard";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://deportes-production.up.railway.app";

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

function normalizeProfile(profile, type) {
  switch (type) {
    case "athlete":
      return {
        ...profile,
        _type: "athlete",
        _route: `/profile/${profile._id}`,
        photo: profile.photo || "",
        sport: profile.sport || "Athlete",
        name: profile.name || "",
        lastName: profile.lastName || "",
        level: profile.level || "",
        age: profile.age || "",
        _city: profile.city || "",
        _gender: profile.gender || "",
        _age: profile.age || null,
        _country: profile.country || "",
        _postalCode: profile.postalCode || "",
        _skills: profile.skills || [],
        _nationalities: profile.nationalities || [],
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
        _country: profile.country || "",
        _postalCode: profile.postalCode || "",
        _skills: [],
        _nationalities: [],
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
        _country: profile.country || "",
        _postalCode: profile.postalCode || "",
        _skills: [],
        _nationalities: [],
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
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState("");
  const [skill, setSkill] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");

  const [ageMin, setAgeMin] = useState(16);
  const [ageMax, setAgeMax] = useState(60);
  const [ageFilterActive, setAgeFilterActive] = useState(false);

  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const [levels, setLevels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allNationalities, setAllNationalities] = useState([]);

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

      setCities([...new Set(normalized.map(a => a._city).filter(Boolean))]);
      setSports([...new Set(athletes.map(a => a.sport).filter(Boolean))]);
      setLevels([...new Set(athletes.map(a => a.level).filter(Boolean))]);
      setCountries([...new Set(normalized.map(a => a._country).filter(Boolean))]);
      setAllSkills([...new Set(athletes.flatMap(a => a.skills || []).filter(Boolean))]);
      setAllNationalities([...new Set(athletes.flatMap(a => a.nationalities || []).filter(Boolean))]);

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = allProfiles;
    if (profileType) result = result.filter(p => p._type === profileType);
    if (city) result = result.filter(p => p._city === city);
    if (country) result = result.filter(p => p._country === country);
    if (sport) result = result.filter(p => p.sport === sport);
    if (gender) result = result.filter(p => p._gender === gender);
    if (level) result = result.filter(p => p.level === level);
    if (skill) result = result.filter(p => p._skills && p._skills.includes(skill));
    if (nationality) result = result.filter(p => p._nationalities && p._nationalities.includes(nationality));
    if (postalCode.trim()) {
      result = result.filter(p => p._postalCode.toLowerCase().includes(postalCode.trim().toLowerCase()));
    }
    if (ageFilterActive) {
      result = result.filter(p => p._age !== null && p._age >= ageMin && p._age <= ageMax);
    }
    setFiltered(result);
  }, [profileType, city, country, sport, gender, level, skill, nationality, postalCode, ageMin, ageMax, ageFilterActive, allProfiles]);

  const resetFilters = () => {
    setProfileType("");
    setSport("");
    setLevel("");
    setGender("");
    setCity("");
    setCountry("");
    setSkill("");
    setNationality("");
    setPostalCode("");
    setAgeMin(16);
    setAgeMax(60);
    setAgeFilterActive(false);
  };

  const showAthleteFilters = profileType === "" || profileType === "athlete";

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.filtersSidebar}>
        
        <div className={styles.filterGroup}>
          <label>Profile Type</label>
          <select className={styles.filterSelect} value={profileType} onChange={(e) => setProfileType(e.target.value)}>
            {profileTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Country</label>
          <select className={styles.filterSelect} value={country} onChange={e => setCountry(e.target.value)}>
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>City</label>
          <select className={styles.filterSelect} value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Postal Code</label>
          <input
            type="text"
            className={styles.filterInput}
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            placeholder="Search postal code..."
          />
        </div>

        {showAthleteFilters && (
          <>
            <div className={styles.filterGroup}>
              <label>
                Age Range
                <input
                  type="checkbox"
                  className={styles.ageCheckbox}
                  checked={ageFilterActive}
                  onChange={e => setAgeFilterActive(e.target.checked)}
                />
              </label>
              <div className={styles.ageSliderWrapper}>
                <div className={styles.ageValues}>{ageMin} – {ageMax}</div>
                <div className={styles.rangeContainer}>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={ageMin}
                    onChange={e => {
                      const val = Number(e.target.value);
                      if (val <= ageMax) setAgeMin(val);
                      setAgeFilterActive(true);
                    }}
                    // si el min es muy alto, lo mandamos al frente
                    style={{ zIndex: ageMin > 50 ? 5 : 3 }} 
                    className={`${styles.rangeSlider} ${styles.sliderMin}`}
                  />
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={ageMax}
                    onChange={e => {
                      const val = Number(e.target.value);
                      if (val >= ageMin) setAgeMax(val);
                      setAgeFilterActive(true);
                    }}
                    className={`${styles.rangeSlider} ${styles.sliderMax}`}
                  />
                </div>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Gender</label>
              <select className={styles.filterSelect} value={gender} onChange={e => setGender(e.target.value)}>
                {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Sport</label>
              <select className={styles.filterSelect} value={sport} onChange={e => setSport(e.target.value)}>
                <option value="">Any Sport</option>
                {sports.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Level</label>
              <select className={styles.filterSelect} value={level} onChange={e => setLevel(e.target.value)}>
                <option value="">All Levels</option>
                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Skill</label>
              <select className={styles.filterSelect} value={skill} onChange={e => setSkill(e.target.value)}>
                <option value="">Any Skill</option>
                {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Nationality</label>
              <select className={styles.filterSelect} value={nationality} onChange={e => setNationality(e.target.value)}>
                <option value="">Any Nationality</option>
                {allNationalities.map(n => {
                  let name = n;
                  try { name = new Intl.DisplayNames(["en"], { type: "region" }).of(n) || n; } catch (_) {}
                  return <option key={n} value={n}>{name}</option>;
                })}
              </select>
            </div>
          </>
        )}

        <button className={styles.resetBtn} onClick={resetFilters}>Reset Filters</button>
      </aside>

      <main className={styles.cardsContainer}>
        {loading ? (
          <p className={styles.message}>Loading profiles...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.message}>No profiles found.</p>
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