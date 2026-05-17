import { useEffect, useState } from "react";
import AthleteCard from "../components/Dashboard/AthleteCard";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://deportes-production.up.railway.app";

function calcAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? age : null;
}

const genders = [
  { label: "ALL", value: "" },
  { label: "♀ FEMALE", value: "femenino" },
  { label: "♂ MALE", value: "masculino" },
];

const levelPills = [
  { label: "ALL", value: "" },
  { label: "AMATEUR", value: "amateur" },
  { label: "SEMI PRO", value: "semi profesional" },
  { label: "PRO", value: "profesional" },
];

const profileTabs = [
  { label: "ALL", value: "", icon: "◈" },
  { label: "ATHLETES", value: "athlete", icon: "🏃" },
  { label: "SCOUTS", value: "scout", icon: "📋" },
  { label: "SPONSORS", value: "sponsor", icon: "🏆" },
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
        age: calcAge(profile.birthDate) ?? profile.age ?? "",
        _city: profile.city || "",
        _gender: profile.gender || "",
        _age: calcAge(profile.birthDate) ?? profile.age ?? null,
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
  const [ageMin, setAgeMin] = useState(16);
  const [ageMax, setAgeMax] = useState(60);
  const [ageFilterActive, setAgeFilterActive] = useState(false);
  const [skill, setSkill] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");

  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
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
      for (let i = normalized.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [normalized[i], normalized[j]] = [normalized[j], normalized[i]];
      }
      setAllProfiles(normalized);
      setFiltered(normalized);
      setCities([...new Set(athletes.map(a => a.city).filter(Boolean))]);
      setSports([...new Set(athletes.map(a => a.sport).filter(Boolean))]);
      setCountries([...new Set(athletes.map(a => a.country).filter(Boolean))]);
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
    if (sport) result = result.filter(p => p._type === "athlete" && p.sport === sport);
    if (gender) result = result.filter(p => p._gender === gender);
    if (level) result = result.filter(p => p._type === "athlete" && p.level === level);
    if (skill) result = result.filter(p => p._skills.includes(skill));
    if (nationality) result = result.filter(p => p._nationalities.includes(nationality));
    if (postalCode.trim()) result = result.filter(p => p._postalCode.toLowerCase().includes(postalCode.trim().toLowerCase()));
    if (ageFilterActive) result = result.filter(p => p._age !== null && p._age >= ageMin && p._age <= ageMax);
    setFiltered(result);
  }, [profileType, city, country, sport, gender, level, skill, nationality, postalCode, ageMin, ageMax, ageFilterActive, allProfiles]);

  const activeFiltersCount = [city, country, sport, gender, level, skill, nationality, postalCode.trim(), ageFilterActive ? "age" : ""].filter(Boolean).length;

  const showAthleteFilters = profileType === "" || profileType === "athlete";

  const resetFilters = () => {
    setSport(""); setLevel(""); setGender(""); setCity(""); setCountry("");
    setSkill(""); setNationality(""); setPostalCode(""); setAgeMin(16); setAgeMax(60); setAgeFilterActive(false);
  };

  const countByType = (type) => type ? allProfiles.filter(p => p._type === type).length : allProfiles.length;

  return (
    <div className={styles.dashboardPage}>

      {/* ── Profile Type Tabs ── */}
      <div className={styles.profileTabsBar}>
        {profileTabs.map(t => (
          <button
            key={t.value}
            className={`${styles.profileTab} ${profileType === t.value ? styles.profileTabActive : ""}`}
            onClick={() => { setProfileType(t.value); resetFilters(); }}
          >
            <span className={styles.tabIcon}>{t.icon}</span>
            <span className={styles.tabLabel}>{t.label}</span>
            <span className={styles.tabCount}>{countByType(t.value)}</span>
          </button>
        ))}
      </div>

      <div className={styles.dashboardContainer}>

        {/* ── Filters Sidebar ── */}
        <aside className={styles.filtersSidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>FILTERS</span>
            {activeFiltersCount > 0 && (
              <button className={styles.resetBtn} onClick={resetFilters}>
                ✕ CLEAR ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* ── Results count ── */}
          <div className={styles.resultsCount}>
            <span className={styles.resultsNum}>{filtered.length}</span>
            <span className={styles.resultsLabel}>results found</span>
          </div>

          {showAthleteFilters && (
            <>
              {/* Gender */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>GENDER</div>
                <div className={styles.pillRow}>
                  {genders.map(g => (
                    <button
                      key={g.value}
                      className={`${styles.pill} ${gender === g.value ? styles.pillActive : ""}`}
                      onClick={() => setGender(g.value)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>LEVEL</div>
                <div className={styles.pillRow}>
                  {levelPills.map(l => (
                    <button
                      key={l.value}
                      className={`${styles.pill} ${level === l.value ? styles.pillActive : ""}`}
                      onClick={() => setLevel(l.value)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>
                  AGE RANGE
                  <label className={styles.ageToggleLabel}>
                    <input
                      type="checkbox"
                      checked={ageFilterActive}
                      onChange={e => setAgeFilterActive(e.target.checked)}
                      className={styles.ageCheckbox}
                    />
                    <span className={styles.ageToggleSwitch} />
                  </label>
                </div>
                <div className={styles.ageDisplay}>
                  <span className={styles.ageVal}>{ageMin}</span>
                  <div className={styles.ageLine} />
                  <span className={styles.ageVal}>{ageMax}</span>
                </div>
                <div className={styles.dualSlider}>
                  <div
                    className={styles.dualSliderFill}
                    style={{
                      left: `${(ageMin - 1) / 99 * 100}%`,
                      right: `${100 - (ageMax - 1) / 99 * 100}%`,
                    }}
                  />
                  <input
                    type="range" min={1} max={100} value={ageMin}
                    onChange={e => { const v = Number(e.target.value); setAgeMin(v > ageMax ? ageMax : v); setAgeFilterActive(true); }}
                    className={styles.rangeSlider}
                  />
                  <input
                    type="range" min={1} max={100} value={ageMax}
                    onChange={e => { const v = Number(e.target.value); setAgeMax(v < ageMin ? ageMin : v); setAgeFilterActive(true); }}
                    className={styles.rangeSlider}
                  />
                </div>
              </div>

              {/* Sport */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>SPORT</div>
                <div className={styles.selectWrapper}>
                  <select className={styles.filterSelect} value={sport} onChange={e => setSport(e.target.value)}>
                    <option value="">Any sport</option>
                    {sports.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>

              {/* Skill */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>SKILL</div>
                <div className={styles.selectWrapper}>
                  <select className={styles.filterSelect} value={skill} onChange={e => setSkill(e.target.value)}>
                    <option value="">Any skill</option>
                    {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>

              {/* Nationality */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>NATIONALITY</div>
                <div className={styles.selectWrapper}>
                  <select className={styles.filterSelect} value={nationality} onChange={e => setNationality(e.target.value)}>
                    <option value="">Any nationality</option>
                    {allNationalities.map(n => {
                      let name = n;
                      try { name = new Intl.DisplayNames(["en"], { type: "region" }).of(n) || n; } catch { name = n; }
                      return <option key={n} value={n}>{name}</option>;
                    })}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>
            </>
          )}

          {/* Country */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>COUNTRY</div>
            <div className={styles.selectWrapper}>
              <select className={styles.filterSelect} value={country} onChange={e => setCountry(e.target.value)}>
                <option value="">All countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </div>

          {/* City */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>CITY</div>
            <div className={styles.selectWrapper}>
              <select className={styles.filterSelect} value={city} onChange={e => setCity(e.target.value)}>
                <option value="">All cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </div>

          {/* Postal code */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>POSTAL CODE</div>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="text"
                className={styles.filterInput}
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                placeholder="Enter postal code..."
              />
            </div>
          </div>
        </aside>

        {/* ── Cards ── */}
        <main className={styles.cardsContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>⚽</p>
              <p className={styles.emptyText}>No profiles found.</p>
              <button className={styles.emptyReset} onClick={resetFilters}>Clear filters</button>
            </div>
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
    </div>
  );
}

export default Dashboard;
