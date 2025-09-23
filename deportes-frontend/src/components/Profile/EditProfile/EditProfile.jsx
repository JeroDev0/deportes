import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import Select from "react-select";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";

// Opciones para género, deportes y niveles
const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const SPORTS = [
  { value: "Soccer", label: "Soccer" },
  { value: "Basketball", label: "Basketball" },
  { value: "Tennis", label: "Tennis" },
  { value: "Volleyball", label: "Volleyball" },
  { value: "Swimming", label: "Swimming" },
  { value: "Athletics", label: "Athletics" },
  { value: "Cycling", label: "Cycling" },
  { value: "Boxing", label: "Boxing" },
  { value: "Chess", label: "Chess" },
  { value: "Golf", label: "Golf" },
  { value: "Baseball", label: "Baseball" },
  { value: "Rugby", label: "Rugby" },
  { value: "Hockey", label: "Hockey" },
  { value: "Gymnastics", label: "Gymnastics" },
  { value: "Karate", label: "Karate" },
  { value: "Judo", label: "Judo" },
  { value: "Taekwondo", label: "Taekwondo" },
  { value: "Fencing", label: "Fencing" },
  { value: "Weightlifting", label: "Weightlifting" },
  { value: "Triathlon", label: "Triathlon" },
];

// Niveles con los valores exactos que espera backend
const LEVELS = [
  { value: "amateur", label: "Amateur" },
  { value: "semi profesional", label: "Semi Professional" },
  { value: "profesional", label: "Professional" },
];

// Estilos para react-select
const selectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    border: "1px solid #253b4d",
    borderRadius: "10px",
    fontSize: "1.12rem",
    background: "#1a334a",
    color: "#eaf6ff",
  }),
  menu: (provided) => ({
    ...provided,
    background: "#1a334a",
    color: "#eaf6ff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#53fb52" : state.isFocused ? "#223c54" : "#1a334a",
    color: state.isSelected ? "#0d2635" : "#eaf6ff",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#eaf6ff",
  }),
  input: (provided) => ({
    ...provided,
    color: "#eaf6ff",
  }),
};

function EditProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    age: "",
    gender: "",
    sport: "",
    level: "",
    phone: "",
    country: "",
    city: "",
    photo: "",
    about: "",
    experience: [""],
    recognitions: [""],
    skills: [""],
    certifications: [""],
    scout: "",
    sponsor: "",
    club: "",
  });

  const [msg, setMsg] = useState("");
  const [profileType, setProfileType] = useState("atleta");
  const [photoPreview, setPhotoPreview] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [scoutOptions, setScoutOptions] = useState([]);
  const [sponsorOptions, setSponsorOptions] = useState([]);
  const [clubOptions, setClubOptions] = useState([]);
  const [loadingScouts, setLoadingScouts] = useState(false);
  const [loadingSponsors, setLoadingSponsors] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(false);

  const countryOptions = countryList().getData();

  // Cargar datos iniciales del perfil
  useEffect(() => {
    fetch(`https://deportes-production.up.railway.app/deportistas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          lastName: data.lastName || "",
          age: data.age || "",
          gender: data.gender || "",
          sport: data.sport || "",
          level: data.level || "",
          phone: data.phone || "",
          country: data.country || "",
          city: data.city || "",
          photo: data.photo || "",
          about: data.about || "",
          experience: data.experience || [""],
          recognitions: data.recognitions || [""],
          skills: data.skills || [""],
          certifications: data.certifications || [""],
          scout: data.scout?._id || "",
          sponsor: data.sponsor?._id || "",
          club: data.club?._id || "",
        });
        setProfileType(data.profileType);
        if (data.photo && typeof data.photo === "string") {
          setPhotoPreview(data.photo);
        }
      });
  }, [id]);

  // Scouts
  useEffect(() => {
    setLoadingScouts(true);
    fetch("https://deportes-production.up.railway.app/scouts")
      .then((res) => res.json())
      .then((data) => {
        setScoutOptions(
          data.map((scout) => ({
            value: scout._id,
            label: `${scout.name} ${scout.lastName}` + (scout.specialization ? ` - ${scout.specialization}` : ""),
          }))
        );
      })
      .catch(() => setScoutOptions([]))
      .finally(() => setLoadingScouts(false));
  }, []);

  // Sponsors
  useEffect(() => {
    setLoadingSponsors(true);
    fetch("https://deportes-production.up.railway.app/sponsors")
      .then((res) => res.json())
      .then((data) => {
        setSponsorOptions(
          data.map((sponsor) => ({
            value: sponsor._id,
            label: `${sponsor.name || sponsor.companyName}` + (sponsor.industry ? ` - ${sponsor.industry}` : ""),
          }))
        );
      })
      .catch(() => setSponsorOptions([]))
      .finally(() => setLoadingSponsors(false));
  }, []);

  // Clubs
  useEffect(() => {
    setLoadingClubs(true);
    fetch("https://deportes-production.up.railway.app/clubs")
      .then((res) => res.json())
      .then((data) => {
        setClubOptions(
          data.map((club) => ({
            value: club._id,
            label: `${club.name}` + (club.city ? ` - ${club.city}` : ""),
          }))
        );
      })
      .catch(() => setClubOptions([]))
      .finally(() => setLoadingClubs(false));
  }, []);

  // Ciudades por país
  useEffect(() => {
    if (form.country) {
      setLoadingCities(true);
      const username = "jerodev0";
      fetch(
        `https://secure.geonames.org/searchJSON?country=${form.country}&featureClass=P&maxRows=1000&username=${username}`
      )
        .then((res) => res.json())
        .then((data) => {
          const uniqueCities = Array.from(new Set(data.geonames.map((city) => city.name)));
          setCityOptions(uniqueCities.map((city) => ({ value: city, label: city })));
          setLoadingCities(false);
        })
        .catch(() => {
          setCityOptions([]);
          setLoadingCities(false);
        });
    } else {
      setCityOptions([]);
      setLoadingCities(false);
    }
  }, [form.country]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Para selects
  const handleSelectChange = (selectedOption, fieldName) => {
    const value = selectedOption ? selectedOption.value : "";
    if (fieldName === "country") {
      setForm((prev) => ({ ...prev, country: value, city: "" }));
    } else {
      setForm((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleArrayChange = (e, field, idx) => {
    const arr = [...form[field]];
    let value = e.target.value;
    if (field === "skills") {
      value = value.replace(/\s/g, "");
    }
    arr[idx] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayField = (field) => {
    if (form[field].length < (field === "skills" ? 7 : 10)) {
      setForm({ ...form, [field]: [...form[field], ""] });
    }
  };

  const removeArrayField = (field, idx) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, photo: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // 🚀 Ya no se transforman mayúsculas/minúsculas
    const cleanForm = { ...form };

    const formData = new FormData();
    Object.entries(cleanForm).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    const res = await fetch(`https://deportes-production.up.railway.app/deportistas/${id}`, {
      method: "PUT",
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { error: "Respuesta inválida del servidor" };
    }

    if (res.ok) {
      setMsg("Perfil actualizado");
      setTimeout(() => navigate(`/profile/${id}`), 800);
    } else {
      setMsg(data.error || "Error al actualizar");
    }
  };

  // Render chips para campos array
  const renderChipList = (field, placeholder, max = 10) => (
    <div className={styles.chipList}>
      {form[field].map((item, idx) => (
        <div key={idx} className={styles.chip}>
          <input
            value={item}
            onChange={(e) => handleArrayChange(e, field, idx)}
            className={styles.chipInput}
            placeholder={placeholder}
            pattern={field === "skills" ? "^\\S+$" : undefined}
            title={field === "skills" ? "Solo una palabra por skill" : undefined}
          />
          {form[field].length > 1 && (
            <button
              type="button"
              className={styles.chipRemove}
              onClick={() => removeArrayField(field, idx)}
              title="Eliminar"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {form[field].length < max && (
        <button
          type="button"
          className={styles.chipAdd}
          onClick={() => addArrayField(field)}
          title="Agregar"
        >
          +
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.editProfileBg}>
      <div className={styles.editProfileCard}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back to Profile
        </button>
        <h1 className={styles.header}>EDIT PROFILE</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Columna izquierda */}
          <div className={styles.leftCol}>
            <div className={styles.photoSection}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder}>No Photo</div>
              )}
              <label htmlFor="photoUpload" className={styles.photoEditBtn}>
                ✎
              </label>
              <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoChange} hidden />
            </div>

            <div className={styles.skillsSection}>
              <h3>Skills</h3>
              {renderChipList("skills", "Skill", 7)}
            </div>
          </div>

          {/* Columna derecha */}
          <div className={styles.rightCol}>
            <label>Introduction</label>
            <textarea
              name="about"
              maxLength={1000}
              value={form.about}
              onChange={handleChange}
              placeholder="Create a short bio that introduces your athlete career and character"
              className={styles.introTextarea}
            />
            <div className={styles.charCount}>{form.about.length} of 300 characters</div>

            <div className={styles.personalInfo}>
              <input name="name" placeholder="First Name" value={form.name} onChange={handleChange} required />
              <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
              <Select
                options={GENDERS}
                value={GENDERS.find((g) => g.value === form.gender) || null}
                onChange={(opt) => handleSelectChange(opt, "gender")}
                placeholder="Gender"
                styles={selectStyles}
                isClearable
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                required
                min={1}
                max={120}
              />
              <input name="phone" placeholder="Phone (+country code)" value={form.phone} onChange={handleChange} />
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === form.country) || null}
                onChange={(opt) => handleSelectChange(opt, "country")}
                placeholder="Country"
                styles={selectStyles}
                isClearable
              />
              <Select
                options={cityOptions}
                value={cityOptions.find((c) => c.value === form.city) || null}
                onChange={(opt) => handleSelectChange(opt, "city")}
                placeholder={
                  loadingCities ? "Loading cities..." : form.country ? "Select your city" : "Select a country first"
                }
                isClearable
                isDisabled={!form.country || loadingCities || cityOptions.length === 0}
                styles={selectStyles}
              />
            </div>

            <div className={styles.sportCareer}>
              <label>Sport Career</label>
              <div className={styles.sportCareerFields}>
                <Select
                  options={SPORTS}
                  value={SPORTS.find((s) => s.value === form.sport) || null}
                  onChange={(opt) => handleSelectChange(opt, "sport")}
                  placeholder="Discipline"
                  styles={selectStyles}
                  isClearable
                />
                <Select
                  options={LEVELS}
                  value={LEVELS.find((l) => l.value === form.level) || null}
                  onChange={(opt) => handleSelectChange(opt, "level")}
                  placeholder="Level"
                  styles={selectStyles}
                  isClearable
                />
              </div>
            </div>

            {/* Relaciones */}
            <div className={styles.relationsSection}>
              <label>Professional Relations</label>
              <div className={styles.relationsFields}>
                <Select
                  options={scoutOptions}
                  value={scoutOptions.find((s) => s.value === form.scout) || null}
                  onChange={(opt) => handleSelectChange(opt, "scout")}
                  placeholder={loadingScouts ? "Loading scouts..." : "Select Scout"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingScouts}
                />
                <Select
                  options={sponsorOptions}
                  value={sponsorOptions.find((s) => s.value === form.sponsor) || null}
                  onChange={(opt) => handleSelectChange(opt, "sponsor")}
                  placeholder={loadingSponsors ? "Loading sponsors..." : "Select Sponsor"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingSponsors}
                />
                <Select
                  options={clubOptions}
                  value={clubOptions.find((c) => c.value === form.club) || null}
                  onChange={(opt) => handleSelectChange(opt, "club")}
                  placeholder={loadingClubs ? "Loading clubs..." : "Select Club"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingClubs}
                />
              </div>
            </div>

            {/* Achievements */}
            <div className={styles.achievementsSection}>
              <h3>Achievements</h3>
              {form.recognitions.map((ach, idx) => (
                <div key={idx} className={styles.achievementItem}>
                  <span className={styles.star}>★</span>
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => handleArrayChange(e, "recognitions", idx)}
                    placeholder="Add achievement"
                    className={styles.achievementInput}
                  />
                  {form.recognitions.length > 1 && (
                    <button type="button" onClick={() => removeArrayField("recognitions", idx)}>
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {form.recognitions.length < 10 && (
                <button type="button" onClick={() => addArrayField("recognitions")}>
                  Add Achievement +
                </button>
              )}
            </div>

            {/* Career */}
            <div className={styles.careerSection}>
              <h3>Career</h3>
              {form.experience.map((item, idx) => (
                <div key={idx} className={styles.careerItem}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(e, "experience", idx)}
                    placeholder="Add career milestone"
                    className={styles.careerInput}
                  />
                  {form.experience.length > 1 && (
                    <button type="button" onClick={() => removeArrayField("experience", idx)}>
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {form.experience.length < 10 && (
                <button type="button" onClick={() => addArrayField("experience")}>
                  Add Career +
                </button>
              )}
            </div>

            {(profileType === "scout" || profileType === "sponsor") && (
              <>
                <label>Certifications</label>
                {renderChipList("certifications", "Certification")}
              </>
            )}

            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
            {msg && <p className={msg.includes("error") ? styles.error : styles.success}>{msg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;