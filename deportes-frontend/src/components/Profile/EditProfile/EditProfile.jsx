import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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

const LEVELS = [
  { value: "amateur", label: "Amateur" },
  { value: "semi profesional", label: "Semi Professional" },
  { value: "profesional", label: "Professional" },
];

// Categorías de habilidades
const SKILLS_CATEGORIES = {
  cognitive: {
    label: "Cognitive & Tactical Skills",
    options: [
      { value: "Game/situation reading", label: "Game/situation reading" },
      { value: "Decision making under pressure", label: "Decision making under pressure" },
      { value: "Movement or play anticipation", label: "Movement or play anticipation" },
      { value: "Tactical adaptability", label: "Tactical adaptability" },
      { value: "Emotional management in competition", label: "Emotional management in competition" },
      { value: "Sustained concentration", label: "Sustained concentration" },
      { value: "Motor memory / rapid technical learning", label: "Motor memory / rapid technical learning" }
    ]
  },
  physical: {
    label: "General Physical Skills",
    options: [
      { value: "Reaction speed", label: "Reaction speed" },
      { value: "Acceleration / maximum speed", label: "Acceleration / maximum speed" },
      { value: "Aerobic endurance", label: "Aerobic endurance" },
      { value: "Anaerobic endurance", label: "Anaerobic endurance" },
      { value: "Muscular power", label: "Muscular power" },
      { value: "Functional strength", label: "Functional strength" },
      { value: "Motor coordination", label: "Motor coordination" },
      { value: "Balance and body stability", label: "Balance and body stability" },
      { value: "Agility and direction changes", label: "Agility and direction changes" },
      { value: "Flexibility / joint mobility", label: "Flexibility / joint mobility" },
      { value: "Vertical / horizontal jump", label: "Vertical / horizontal jump" },
      { value: "Postural control in movement", label: "Postural control in movement" }
    ]
  },
  technical: {
    label: "Transversal Technical Skills",
    options: [
      { value: "Technical execution precision", label: "Technical execution precision" },
      { value: "Sport-specific gesture mastery", label: "Sport-specific gesture mastery" },
      { value: "Object/implement control", label: "Object/implement control (ball, racket, weapon, etc.)" },
      { value: "Movement synchronization", label: "Movement synchronization" },
      { value: "Energy efficiency in technique", label: "Energy efficiency in technique" },
      { value: "Technical automation capacity", label: "Technical automation capacity" },
      { value: "Smooth transition between movement phases", label: "Smooth transition between movement phases" }
    ]
  },
  social: {
    label: "Social & Team Skills",
    options: [
      { value: "Effective communication", label: "Effective communication (verbal and non-verbal)" },
      { value: "Teamwork / cooperation", label: "Teamwork / cooperation" },
      { value: "Sports leadership", label: "Sports leadership" },
      { value: "Respect for roles and strategies", label: "Respect for roles and strategies" },
      { value: "Positive and motivating attitude", label: "Positive and motivating attitude" },
      { value: "Discipline and group commitment", label: "Discipline and group commitment" }
    ]
  },
  psychological: {
    label: "High Performance Psychological Skills",
    options: [
      { value: "Resilience in adversity", label: "Resilience in adversity" },
      { value: "Self-confidence in competition", label: "Self-confidence in competition" },
      { value: "Competitive stress management", label: "Competitive stress management" },
      { value: "Visualization / mental preparation", label: "Visualization / mental preparation" },
      { value: "Focus and activation routines", label: "Focus and activation routines" },
      { value: "Continuous improvement mindset", label: "Continuous improvement mindset" }
    ]
  },
  trainability: {
    label: "Trainability & Progress Skills",
    options: [
      { value: "Ability to receive and apply feedback", label: "Ability to receive and apply feedback" },
      { value: "Training consistency", label: "Training consistency" },
      { value: "Autonomy in improvement process", label: "Autonomy in improvement process" },
      { value: "Technical / tactical curiosity", label: "Technical / tactical curiosity" },
      { value: "Adaptability to new environments", label: "Adaptability to new environments" },
      { value: "Commitment to sports objectives", label: "Commitment to sports objectives" }
    ]
  }
};

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

const parseYearText = (str) => {
  if (!str) return { year: "", text: "" };
  const match = str.match(/^(\d{4})[\s\-:]+(.+)$/);
  if (match) {
    return { year: match[1], text: match[2] };
  }
  return { year: "", text: str };
};

const combineYearText = (year, text) => {
  if (!year && !text) return "";
  if (!year) return text;
  if (!text) return year;
  return `${year} - ${text}`;
};

const convertSkillsToArray = (skillsObject) => {
  return Object.values(skillsObject).filter(skill => skill !== "");
};

const convertSkillsToObject = (skillsArray) => {
  const skillsObj = {
    cognitive: "",
    physical: "",
    technical: "",
    social: "",
    psychological: "",
    trainability: ""
  };
  
  if (Array.isArray(skillsArray)) {
    skillsArray.forEach(skill => {
      Object.keys(SKILLS_CATEGORIES).forEach(category => {
        const found = SKILLS_CATEGORIES[category].options.find(option => option.value === skill);
        if (found) {
          skillsObj[category] = skill;
        }
      });
    });
  }
  
  return skillsObj;
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
    postalCode: "",
    address: "",
    birthCountry: "",
    birthCity: "",
    photo: "",
    about: "",
    shortDescription: "",
    experience: [""],
    recognitions: [""],
    skills: {
      cognitive: "",
      physical: "",
      technical: "",
      social: "",
      psychological: "",
      trainability: ""
    },
    certifications: [""],
    scout: "",
    sponsor: "",
    club: "",
  });

  const [recognitionsFields, setRecognitionsFields] = useState([{ year: "", text: "" }]);
  const [experienceFields, setExperienceFields] = useState([{ year: "", text: "" }]);

  const [msg, setMsg] = useState("");
  const [profileType, setProfileType] = useState("atleta");
  const [photoPreview, setPhotoPreview] = useState("");
  
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  const [birthCityOptions, setBirthCityOptions] = useState([]);
  const [loadingBirthCities, setLoadingBirthCities] = useState(false);

  const [scoutOptions, setScoutOptions] = useState([]);
  const [sponsorOptions, setSponsorOptions] = useState([]);
  const [clubOptions, setClubOptions] = useState([]);
  const [loadingScouts, setLoadingScouts] = useState(false);
  const [loadingSponsors, setLoadingSponsors] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(false);

  // Estados para display (lo que ve el usuario)
  const [scoutDisplay, setScoutDisplay] = useState(null);
  const [sponsorDisplay, setSponsorDisplay] = useState(null);
  const [clubDisplay, setClubDisplay] = useState(null);

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
          postalCode: data.postalCode || "",
          address: data.address || "",
          birthCountry: data.birthCountry || "",
          birthCity: data.birthCity || "",
          photo: data.photo || "",
          about: data.about || "",
          shortDescription: data.shortDescription || "",
          experience: data.experience || [""],
          recognitions: data.recognitions || [""],
          skills: convertSkillsToObject(data.skills || []),
          certifications: data.certifications || [""],
          scout: data.scout?._id || "",
          sponsor: data.sponsor?._id || "",
          club: data.club?._id || "",
        });
        
        const parsedRecognitions = (data.recognitions || [""]).map(parseYearText);
        setRecognitionsFields(parsedRecognitions.length > 0 ? parsedRecognitions : [{ year: "", text: "" }]);
        
        const parsedExperience = (data.experience || [""]).map(parseYearText);
        setExperienceFields(parsedExperience.length > 0 ? parsedExperience : [{ year: "", text: "" }]);
        
        setProfileType(data.profileType);
        if (data.photo && typeof data.photo === "string") {
          setPhotoPreview(data.photo);
        }

        // Configurar displays para scout
        if (data.scout?._id) {
          // Es de BD
          setScoutDisplay({
            value: data.scout._id,
            label: `${data.scout.name} ${data.scout.lastName}` + (data.scout.specialization ? ` - ${data.scout.specialization}` : ""),
            isFromDB: true
          });
        } else if (data.scoutName) {
          // Es texto libre guardado
          setScoutDisplay({
            value: data.scoutName,
            label: data.scoutName,
            isFromDB: false
          });
        }

        // Configurar displays para sponsor
        if (data.sponsor?._id) {
          setSponsorDisplay({
            value: data.sponsor._id,
            label: `${data.sponsor.name || data.sponsor.companyName}` + (data.sponsor.industry ? ` - ${data.sponsor.industry}` : ""),
            isFromDB: true
          });
        } else if (data.sponsorName) {
          setSponsorDisplay({
            value: data.sponsorName,
            label: data.sponsorName,
            isFromDB: false
          });
        }

        // Configurar displays para club
        if (data.club?._id) {
          setClubDisplay({
            value: data.club._id,
            label: `${data.club.name}` + (data.club.city ? ` - ${data.club.city}` : ""),
            isFromDB: true
          });
        } else if (data.clubName) {
          setClubDisplay({
            value: data.clubName,
            label: data.clubName,
            isFromDB: false
          });
        }
      });
  }, [id]);

  useEffect(() => {
    const recognitionsStrings = recognitionsFields.map(field => combineYearText(field.year, field.text));
    setForm(prev => ({ ...prev, recognitions: recognitionsStrings }));
  }, [recognitionsFields]);

  useEffect(() => {
    const experienceStrings = experienceFields.map(field => combineYearText(field.year, field.text));
    setForm(prev => ({ ...prev, experience: experienceStrings }));
  }, [experienceFields]);

  // Cargar scouts
  useEffect(() => {
    setLoadingScouts(true);
    fetch("https://deportes-production.up.railway.app/scouts")
      .then((res) => res.json())
      .then((data) => {
        setScoutOptions(
          data.map((scout) => ({
            value: scout._id,
            label: `${scout.name} ${scout.lastName}` + (scout.specialization ? ` - ${scout.specialization}` : ""),
            isFromDB: true
          }))
        );
      })
      .catch(() => setScoutOptions([]))
      .finally(() => setLoadingScouts(false));
  }, []);

  // Cargar sponsors
  useEffect(() => {
    setLoadingSponsors(true);
    fetch("https://deportes-production.up.railway.app/sponsors")
      .then((res) => res.json())
      .then((data) => {
        setSponsorOptions(
          data.map((sponsor) => ({
            value: sponsor._id,
            label: `${sponsor.name || sponsor.companyName}` + (sponsor.industry ? ` - ${sponsor.industry}` : ""),
            isFromDB: true
          }))
        );
      })
      .catch(() => setSponsorOptions([]))
      .finally(() => setLoadingSponsors(false));
  }, []);

  // Cargar clubs
  useEffect(() => {
    setLoadingClubs(true);
    fetch("https://deportes-production.up.railway.app/clubs")
      .then((res) => res.json())
      .then((data) => {
        setClubOptions(
          data.map((club) => ({
            value: club._id,
            label: `${club.name}` + (club.city ? ` - ${club.city}` : ""),
            isFromDB: true
          }))
        );
      })
      .catch(() => setClubOptions([]))
      .finally(() => setLoadingClubs(false));
  }, []);

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

  useEffect(() => {
    if (form.birthCountry) {
      setLoadingBirthCities(true);
      const username = "jerodev0";
      fetch(
        `https://secure.geonames.org/searchJSON?country=${form.birthCountry}&featureClass=P&maxRows=1000&username=${username}`
      )
        .then((res) => res.json())
        .then((data) => {
          const uniqueCities = Array.from(new Set(data.geonames.map((city) => city.name)));
          setBirthCityOptions(uniqueCities.map((city) => ({ value: city, label: city })));
          setLoadingBirthCities(false);
        })
        .catch(() => {
          setBirthCityOptions([]);
          setLoadingBirthCities(false);
        });
    } else {
      setBirthCityOptions([]);
      setLoadingBirthCities(false);
    }
  }, [form.birthCountry]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    const value = selectedOption ? selectedOption.value : "";
    if (fieldName === "country") {
      setForm((prev) => ({ ...prev, country: value, city: "" }));
    } else if (fieldName === "birthCountry") {
      setForm((prev) => ({ ...prev, birthCountry: value, birthCity: "" }));
    } else {
      setForm((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  // Función para manejar cambios en relaciones profesionales
  const handleRelationChange = (selectedOption, field) => {
    if (field === 'scout') {
      setScoutDisplay(selectedOption);
      setForm(prev => ({
        ...prev,
        scout: selectedOption?.isFromDB ? selectedOption.value : ""
      }));
    } else if (field === 'sponsor') {
      setSponsorDisplay(selectedOption);
      setForm(prev => ({
        ...prev,
        sponsor: selectedOption?.isFromDB ? selectedOption.value : ""
      }));
    } else if (field === 'club') {
      setClubDisplay(selectedOption);
      setForm(prev => ({
        ...prev,
        club: selectedOption?.isFromDB ? selectedOption.value : ""
      }));
    }
  };

  const handleSkillChange = (selectedOption, category) => {
    const value = selectedOption ? selectedOption.value : "";
    setForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: value
      }
    }));
  };

  const handleArrayChange = (e, field, idx) => {
    const arr = [...form[field]];
    arr[idx] = e.target.value;
    setForm({ ...form, [field]: arr });
  };

  const handleRecognitionFieldChange = (idx, fieldType, value) => {
    const newFields = [...recognitionsFields];
    newFields[idx] = { ...newFields[idx], [fieldType]: value };
    setRecognitionsFields(newFields);
  };

  const handleExperienceFieldChange = (idx, fieldType, value) => {
    const newFields = [...experienceFields];
    newFields[idx] = { ...newFields[idx], [fieldType]: value };
    setExperienceFields(newFields);
  };

  const addArrayField = (field) => {
    if (field === "recognitions") {
      if (recognitionsFields.length < 10) {
        setRecognitionsFields([...recognitionsFields, { year: "", text: "" }]);
      }
    } else if (field === "experience") {
      if (experienceFields.length < 10) {
        setExperienceFields([...experienceFields, { year: "", text: "" }]);
      }
    } else if (form[field].length < 10) {
      setForm({ ...form, [field]: [...form[field], ""] });
    }
  };

  const removeArrayField = (field, idx) => {
    if (field === "recognitions") {
      const newFields = [...recognitionsFields];
      newFields.splice(idx, 1);
      setRecognitionsFields(newFields);
    } else if (field === "experience") {
      const newFields = [...experienceFields];
      newFields.splice(idx, 1);
      setExperienceFields(newFields);
    } else {
      const arr = [...form[field]];
      arr.splice(idx, 1);
      setForm({ ...form, [field]: arr });
    }
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
    
    cleanForm.skills = convertSkillsToArray(form.skills);
    
    const stringFields = ['postalCode', 'address', 'birthCountry', 'birthCity', 'shortDescription'];
    stringFields.forEach(field => {
      if (cleanForm[field] === null || cleanForm[field] === undefined || cleanForm[field] === 'undefined') {
        cleanForm[field] = '';
      }
      cleanForm[field] = String(cleanForm[field] || '');
    });

    const formData = new FormData();
    Object.entries(cleanForm).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          const cleanValue = v === null || v === undefined ? '' : String(v);
          formData.append(key, cleanValue);
        });
      } else {
        const cleanValue = value === null || value === undefined ? '' : value;
        formData.append(key, cleanValue);
      }
    });

    // IMPORTANTE: Agregar los nombres de texto libre
    if (scoutDisplay && !scoutDisplay.isFromDB) {
      formData.append('scoutName', scoutDisplay.value);
    } else {
      formData.append('scoutName', '');
    }

    if (sponsorDisplay && !sponsorDisplay.isFromDB) {
      formData.append('sponsorName', sponsorDisplay.value);
    } else {
      formData.append('sponsorName', '');
    }

    if (clubDisplay && !clubDisplay.isFromDB) {
      formData.append('clubName', clubDisplay.value);
    } else {
      formData.append('clubName', '');
    }

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

  const renderChipList = (field, placeholder, max = 10) => (
    <div className={styles.chipList}>
      {form[field].map((item, idx) => (
        <div key={idx} className={styles.chip}>
          <input
            value={item}
            onChange={(e) => handleArrayChange(e, field, idx)}
            className={styles.chipInput}
            placeholder={placeholder}
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

  const renderSkillsSection = () => (
    <div className={styles.skillsSection}>
      <h3>Skills (Select one from each category)</h3>
      {Object.entries(SKILLS_CATEGORIES).map(([categoryKey, category]) => (
        <div key={categoryKey} className={styles.skillCategory}>
          <label className={styles.categoryLabel}>{category.label}</label>
          <Select
            options={category.options}
            value={category.options.find(option => option.value === form.skills[categoryKey]) || null}
            onChange={(selectedOption) => handleSkillChange(selectedOption, categoryKey)}
            placeholder={`Select ${category.label.toLowerCase()}`}
            styles={selectStyles}
            isClearable
            className={styles.skillSelect}
          />
        </div>
      ))}
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

            {renderSkillsSection()}
          </div>

          <div className={styles.rightCol}>
            <label>Short Description</label>
            <textarea
              name="shortDescription"
              maxLength={200}
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Brief description for profile preview (max 200 characters)"
              className={styles.shortDescTextarea}
              rows="3"
            />
            <div className={styles.charCount}>{form.shortDescription.length} of 200 characters</div>

            <label>My Story</label>
            <textarea
              name="about"
              maxLength={1000}
              value={form.about}
              onChange={handleChange}
              placeholder="Create a detailed bio that introduces your athlete career and character"
              className={styles.introTextarea}
            />
            <div className={styles.charCount}>{form.about.length} of 1000 characters</div>

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
            </div>

            <div className={styles.birthInfo}>
              <h3>Birth Information</h3>
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === form.birthCountry) || null}
                onChange={(opt) => handleSelectChange(opt, "birthCountry")}
                placeholder="Birth Country"
                styles={selectStyles}
                isClearable
              />
              <Select
                options={birthCityOptions}
                value={birthCityOptions.find((c) => c.value === form.birthCity) || null}
                onChange={(opt) => handleSelectChange(opt, "birthCity")}
                placeholder={
                  loadingBirthCities ? "Loading cities..." : form.birthCountry ? "Select birth city" : "Select birth country first"
                }
                isClearable
                isDisabled={!form.birthCountry || loadingBirthCities || birthCityOptions.length === 0}
                styles={selectStyles}
              />
            </div>

            <div className={styles.currentLocation}>
              <h3>Current Location</h3>
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === form.country) || null}
                onChange={(opt) => handleSelectChange(opt, "country")}
                placeholder="Current Country"
                styles={selectStyles}
                isClearable
              />
              <Select
                options={cityOptions}
                value={cityOptions.find((c) => c.value === form.city) || null}
                onChange={(opt) => handleSelectChange(opt, "city")}
                placeholder={
                  loadingCities ? "Loading cities..." : form.country ? "Select current city" : "Select country first"
                }
                isClearable
                isDisabled={!form.country || loadingCities || cityOptions.length === 0}
                styles={selectStyles}
              />
              <input 
                name="postalCode" 
                placeholder="Postal Code" 
                value={form.postalCode} 
                onChange={handleChange} 
              />
              <input 
                name="address" 
                placeholder="Full Address" 
                value={form.address} 
                onChange={handleChange} 
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

            <div className={styles.relationsSection}>
              <label>Professional Relations (Select from list or type manually)</label>
              <div className={styles.relationsFields}>
                <CreatableSelect
                  options={scoutOptions}
                  value={scoutDisplay}
                  onChange={(opt) => handleRelationChange(opt, 'scout')}
                  placeholder={loadingScouts ? "Loading scouts..." : "Select or type Scout name"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingScouts}
                  formatCreateLabel={(inputValue) => `Use: "${inputValue}"`}
                />
                <CreatableSelect
                  options={sponsorOptions}
                  value={sponsorDisplay}
                  onChange={(opt) => handleRelationChange(opt, 'sponsor')}
                  placeholder={loadingSponsors ? "Loading sponsors..." : "Select or type Sponsor name"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingSponsors}
                  formatCreateLabel={(inputValue) => `Use: "${inputValue}"`}
                />
                <CreatableSelect
                  options={clubOptions}
                  value={clubDisplay}
                  onChange={(opt) => handleRelationChange(opt, 'club')}
                  placeholder={loadingClubs ? "Loading clubs..." : "Select or type Club name"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingClubs}
                  formatCreateLabel={(inputValue) => `Use: "${inputValue}"`}
                />
              </div>
            </div>

            <div className={styles.achievementsSection}>
              <h3>Achievements</h3>
              {recognitionsFields.map((field, idx) => (
                <div key={idx} className={styles.achievementItem}>
                  <span className={styles.star}>★</span>
                  <input
                    type="number"
                    value={field.year}
                    onChange={(e) => handleRecognitionFieldChange(idx, "year", e.target.value)}
                    placeholder="Year"
                    className={styles.yearInput}
                    min="1900"
                    max="2050"
                    style={{ width: "80px", marginRight: "10px" }}
                  />
                  <input
                    type="text"
                    value={field.text}
                    onChange={(e) => handleRecognitionFieldChange(idx, "text", e.target.value)}
                    placeholder="Achievement description"
                    className={styles.achievementInput}
                    style={{ flex: 1 }}
                  />
                  {recognitionsFields.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeArrayField("recognitions", idx)}
                      style={{ marginLeft: "10px" }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {recognitionsFields.length < 10 && (
                <button type="button" onClick={() => addArrayField("recognitions")}>
                  Add Achievement +
                </button>
              )}
            </div>

            <div className={styles.careerSection}>
              <h3>Career</h3>
              {experienceFields.map((field, idx) => (
                <div key={idx} className={styles.careerItem}>
                  <input
                    type="number"
                    value={field.year}
                    onChange={(e) => handleExperienceFieldChange(idx, "year", e.target.value)}
                    placeholder="Year"
                    className={styles.yearInput2}
                    min="1900"
                    max="2050"
                    style={{ width: "80px", marginRight: "10px" }}
                  />
                  <input
                    type="text"
                    value={field.text}
                    onChange={(e) => handleExperienceFieldChange(idx, "text", e.target.value)}
                    placeholder="team / club"
                    className={styles.careerInput}
                    style={{ flex: 1 }}
                  />
                  {experienceFields.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeArrayField("experience", idx)}
                      style={{ marginLeft: "10px" }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {experienceFields.length < 10 && (
                <button type="button" onClick={() => addArrayField("experience")}>
                  Add Career +
                </button>
              )}
            </div>

            {(profileType === "scout" || profileType === "sponsor") && (
              <div className={styles.certificationsSection}>
                <label>Certifications</label>
                {renderChipList("certifications", "Certification")}
              </div>
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