import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import Select from "react-select";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";

// Opciones para género, deportes y niveles
const GENDERS = [
  { value: "male", label: "male" },
  { value: "female", label: "female" },
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

const LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "SemiPro", label: "SemiPro" },
  { value: "Pro", label: "Pro" },
];

// Estilos para react-select (manteniendo tu estilo original)
const selectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
    border: '1px solid #253b4d',
    borderRadius: '10px',
    fontSize: '1.12rem',
    background: '#1a334a',
    color: '#eaf6ff',
  }),
  menu: (provided) => ({
    ...provided,
    background: '#1a334a',
    color: '#eaf6ff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#53fb52' : state.isFocused ? '#223c54' : '#1a334a',
    color: state.isSelected ? '#0d2635' : '#eaf6ff',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#eaf6ff',
  }),
  input: (provided) => ({
    ...provided,
    color: '#eaf6ff',
  }),
};

function capitalizeParagraph(str) {
  if (!str) return "";
  const s = str.trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function capitalizeWords(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

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
  });

  const [msg, setMsg] = useState("");
  const [profileType, setProfileType] = useState("atleta");
  const [photoPreview, setPhotoPreview] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const countryOptions = countryList().getData();

  // Cargar datos del perfil
  useEffect(() => {
    fetch(`https://deportes-production.up.railway.app/deportistas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ...form,
          ...data,
          experience: data.experience || [""],
          recognitions: data.recognitions || [""],
          skills: data.skills || [""],
          certifications: data.certifications || [""],
          level: data.level || "",
        });
        setProfileType(data.profileType);
        if (data.photo && typeof data.photo === "string") {
          setPhotoPreview(data.photo);
        }
      });
    // eslint-disable-next-line
  }, [id]);

  // Cargar ciudades cuando cambia el país
  useEffect(() => {
    if (form.country) {
      setLoadingCities(true);
      const username = "jerodev0"; // Tu usuario de GeoNames
      fetch(
        `https://secure.geonames.org/searchJSON?country=${form.country}&featureClass=P&maxRows=1000&username=${username}`
      )
        .then((res) => res.json())
        .then((data) => {
          const uniqueCities = Array.from(
            new Set(data.geonames.map((city) => city.name))
          );
          setCityOptions(
            uniqueCities.map((city) => ({
              value: city,
              label: city,
            }))
          );
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

    const cleanForm = { ...form };

    ["name", "lastName", "city", "country", "sport", "gender"].forEach((field) => {
      if (cleanForm[field]) cleanForm[field] = capitalizeWords(cleanForm[field]);
    });

    ["skills", "certifications"].forEach((field) => {
      if (Array.isArray(cleanForm[field])) {
        cleanForm[field] = cleanForm[field]
          .filter((v) => v && v.trim() !== "")
          .map((v) => capitalizeWords(v));
      }
    });

    ["experience", "recognitions"].forEach((field) => {
      if (Array.isArray(cleanForm[field])) {
        cleanForm[field] = cleanForm[field]
          .filter((v) => v && v.trim() !== "")
          .map((v) => capitalizeParagraph(v));
      }
    });

    if (cleanForm.about) cleanForm.about = capitalizeParagraph(cleanForm.about);

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

  // Render chips para arrays (skills, experience, recognitions, certifications)
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
              <svg width="16" height="16" fill="#e74c3c" viewBox="0 0 24 24"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11l4.89 4.89-4.89 4.89a1 1 0 1 0 1.41 1.41l4.89-4.89 4.89 4.89a1 1 0 0 0 1.41-1.41l-4.89-4.89 4.89-4.89a1 1 0 0 0 0-1.41z"/></svg>
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
          <svg width="18" height="18" fill="#53fb52" viewBox="0 0 24 24"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
        </button>
      )}
    </div>
  );

  // Render achievements and career with editable inputs (array of strings)
  const renderListInput = (field, placeholder) => (
    <div className={styles.listInputContainer}>
      {form[field].map((item, idx) => (
        <div key={idx} className={styles.listInputItem}>
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(e, field, idx)}
            placeholder={placeholder}
            className={styles.listInput}
          />
          {form[field].length > 1 && (
            <button
              type="button"
              className={styles.listRemoveBtn}
              onClick={() => removeArrayField(field, idx)}
              title="Eliminar"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      {form[field].length < 10 && (
        <button
          type="button"
          className={styles.listAddBtn}
          onClick={() => addArrayField(field)}
          title="Agregar"
        >
          + Add {placeholder}
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.editProfileBg}>
      <div className={styles.editProfileCard}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back to Profile</button>
        <h1 className={styles.header}>EDIT PROFILE</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Left column: photo, skills */}
          <div className={styles.leftCol}>
            <div className={styles.photoSection}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder}>No Photo</div>
              )}
              <label htmlFor="photoUpload" className={styles.photoEditBtn}>✎</label>
              <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoChange} hidden />
            </div>

            <div className={styles.skillsSection}>
              <h3>Skills</h3>
              {renderChipList("skills", "Skill", 7)}
            </div>
          </div>

          {/* Right column: all other fields */}
          <div className={styles.rightCol}>
            <label>Introduction</label>
            <textarea
              name="about"
              maxLength={300}
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
                value={GENDERS.find(g => g.value === form.gender) || null}
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
              <input
                name="phone"
                placeholder="Phone (+country code)"
                value={form.phone}
                onChange={handleChange}
              />
              <Select
                options={countryOptions}
                value={countryOptions.find(c => c.value === form.country) || null}
                onChange={(opt) => handleSelectChange(opt, "country")}
                placeholder="Country"
                styles={selectStyles}
                isClearable
              />
              <Select
                options={cityOptions}
                value={cityOptions.find(c => c.value === form.city) || null}
                onChange={(opt) => handleSelectChange(opt, "city")}
                placeholder={
                  loadingCities
                    ? "Loading cities..."
                    : form.country
                    ? "Select your city"
                    : "Select a country first"
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
                  value={SPORTS.find(s => s.value === form.sport) || null}
                  onChange={(opt) => handleSelectChange(opt, "sport")}
                  placeholder="Discipline"
                  styles={selectStyles}
                  isClearable
                />
                <Select
                  options={LEVELS}
                  value={LEVELS.find(l => l.value === form.level) || null}
                  onChange={(opt) => handleSelectChange(opt, "level")}
                  placeholder="Level"
                  styles={selectStyles}
                  isClearable
                />
              </div>
            </div>

            <div className={styles.achievementsSection}>
              <div className={styles.achievementsHeader}>
                <svg className={styles.trophyIcon} viewBox="0 0 24 24" fill="#999" width="20" height="20" aria-hidden="true">
                  <path d="M7 3v2H5v3a5 5 0 0 0 4 4.9V15H7v2h10v-2h-2v-2.1a5 5 0 0 0 4-4.9V5h-2V3H7zM6 8V5h2v3a3 3 0 0 1-2 2.83V8zm12 0v2.83A3 3 0 0 1 16 8V5h2v3z"/>
                </svg>
                <h3>Achievements</h3>
              </div>
              <p className={styles.achievementsDescription}>
                List your most important accomplishments as an athlete — from awards, titles, and rankings to national team selections, standout performances, or recognitions from clubs and organizations. Focus on what sets you apart.
              </p>
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
                    <button
                      type="button"
                      className={styles.removeAchievementBtn}
                      onClick={() => removeArrayField("recognitions", idx)}
                      title="Remove achievement"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {form.recognitions.length < 10 && (
                <button
                  type="button"
                  className={styles.addAchievementBtn}
                  onClick={() => addArrayField("recognitions")}
                  title="Add achievement"
                >
                  Add Achievement <span className={styles.plusIcon}>+</span>
                </button>
              )}
            </div>

            <div className={styles.careerSection}>
              <div className={styles.careerHeader}>
                <svg className={styles.trophyIcon} viewBox="0 0 24 24" fill="#999" width="20" height="20" aria-hidden="true">
                  <path d="M7 3v2H5v3a5 5 0 0 0 4 4.9V15H7v2h10v-2h-2v-2.1a5 5 0 0 0 4-4.9V5h-2V3H7zM6 8V5h2v3a3 3 0 0 1-2 2.83V8zm12 0v2.83A3 3 0 0 1 16 8V5h2v3z"/>
                </svg>
                <h3>Career</h3>
              </div>
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
                    <button
                      type="button"
                      className={styles.removeCareerBtn}
                      onClick={() => removeArrayField("experience", idx)}
                      title="Remove career item"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {form.experience.length < 10 && (
                <button
                  type="button"
                  className={styles.addCareerBtn}
                  onClick={() => addArrayField("experience")}
                  title="Add career item"
                >
                  Add Career <span className={styles.plusIcon}>+</span>
                </button>
              )}
            </div>

            {(profileType === "scout" || profileType === "sponsor") && (
              <>
                <label>Certifications</label>
                {renderChipList("certifications", "Certification")}
              </>
            )}

            <button type="submit" className={styles.saveBtn}>Save Changes</button>
            {msg && <p className={msg.includes("error") ? styles.error : styles.success}>{msg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;