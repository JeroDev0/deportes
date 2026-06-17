import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";

// Opciones para género, deportes y niveles
const GENDERS = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
];

const SPORTS = [
  { value: "Soccer", label: "Fútbol" },
  { value: "Basketball", label: "Baloncesto" },
  { value: "Tennis", label: "Tenis" },
  { value: "Volleyball", label: "Voleibol" },
  { value: "Swimming", label: "Natación" },
  { value: "Athletics", label: "Atletismo" },
  { value: "Cycling", label: "Ciclismo" },
  { value: "Boxing", label: "Boxeo" },
  { value: "Chess", label: "Ajedrez" },
  { value: "Golf", label: "Golf" },
  { value: "Baseball", label: "Béisbol" },
  { value: "Rugby", label: "Rugby" },
  { value: "Hockey", label: "Hockey" },
  { value: "Handball", label: "Balonmano" },
  { value: "Futsal", label: "Fútbol Sala" },
  { value: "Padel", label: "Pádel" },
  { value: "Pickleball", label: "Pickleball" },
  { value: "Gymnastics", label: "Gimnasia" },
  { value: "Karate", label: "Kárate" },
  { value: "Judo", label: "Judo" },
  { value: "Taekwondo", label: "Taekwondo" },
  { value: "Fencing", label: "Esgrima" },
  { value: "Weightlifting", label: "Halterofilia" },
  { value: "Triathlon", label: "Triatlón" },
  { value: "Boccia", label: "Boccia" },
  { value: "Olympic Wrestling", label: "Lucha Olímpica" },
  { value: "Skating", label: "Patinaje" },
  { value: "Archery", label: "Tiro con Arco" },
  { value: "Para Cycling", label: "Paraciclismo" },
  { value: "Para Athletics", label: "Paraatletismo" },
  { value: "Para Swimming", label: "Paranatación" },
  { value: "Para Powerlifting", label: "Parapowerlifting" },
];

const LEVELS = [
  { value: "amateur", label: "Amateur" },
  { value: "semi profesional", label: "Semi Profesional" },
  { value: "profesional", label: "Profesional" },
];

// Categorías de habilidades
const SKILLS_CATEGORIES = {
  cognitive: {
    label: "Habilidades Cognitivas y Tácticas",
    options: [
      { value: "Game/situation reading", label: "Lectura del juego/situación" },
      { value: "Decision making under pressure", label: "Toma de decisiones bajo presión" },
      { value: "Movement or play anticipation", label: "Anticipación de movimiento o jugada" },
      { value: "Tactical adaptability", label: "Adaptabilidad táctica" },
      { value: "Emotional management in competition", label: "Gestión emocional en competencia" },
      { value: "Sustained concentration", label: "Concentración sostenida" },
      { value: "Motor memory / rapid technical learning", label: "Memoria motriz / aprendizaje técnico rápido" }
    ]
  },
  physical: {
    label: "Habilidades Físicas Generales",
    options: [
      { value: "Reaction speed", label: "Velocidad de reacción" },
      { value: "Acceleration / maximum speed", label: "Aceleración / velocidad máxima" },
      { value: "Aerobic endurance", label: "Resistencia aeróbica" },
      { value: "Anaerobic endurance", label: "Resistencia anaeróbica" },
      { value: "Muscular power", label: "Potencia muscular" },
      { value: "Functional strength", label: "Fuerza funcional" },
      { value: "Motor coordination", label: "Coordinación motriz" },
      { value: "Balance and body stability", label: "Equilibrio y estabilidad corporal" },
      { value: "Agility and direction changes", label: "Agilidad y cambios de dirección" },
      { value: "Flexibility / joint mobility", label: "Flexibilidad / movilidad articular" },
      { value: "Vertical / horizontal jump", label: "Salto vertical / horizontal" },
      { value: "Postural control in movement", label: "Control postural en movimiento" }
    ]
  },
  technical: {
    label: "Habilidades Técnicas Transversales",
    options: [
      { value: "Technical execution precision", label: "Precisión en la ejecución técnica" },
      { value: "Sport-specific gesture mastery", label: "Dominio del gesto específico del deporte" },
      { value: "Object/implement control", label: "Control del objeto/implemento (balón, raqueta, arma, etc.)" },
      { value: "Movement synchronization", label: "Sincronización del movimiento" },
      { value: "Energy efficiency in technique", label: "Eficiencia energética en la técnica" },
      { value: "Technical automation capacity", label: "Capacidad de automatización técnica" },
      { value: "Smooth transition between movement phases", label: "Transición fluida entre fases de movimiento" }
    ]
  },
  social: {
    label: "Habilidades Sociales y de Equipo",
    options: [
      { value: "Effective communication", label: "Comunicación efectiva (verbal y no verbal)" },
      { value: "Teamwork / cooperation", label: "Trabajo en equipo / cooperación" },
      { value: "Sports leadership", label: "Liderazgo deportivo" },
      { value: "Respect for roles and strategies", label: "Respeto por roles y estrategias" },
      { value: "Positive and motivating attitude", label: "Actitud positiva y motivadora" },
      { value: "Discipline and group commitment", label: "Disciplina y compromiso grupal" }
    ]
  },
  psychological: {
    label: "Habilidades Psicológicas de Alto Rendimiento",
    options: [
      { value: "Resilience in adversity", label: "Resiliencia ante la adversidad" },
      { value: "Self-confidence in competition", label: "Confianza en sí mismo en competencia" },
      { value: "Competitive stress management", label: "Gestión del estrés competitivo" },
      { value: "Visualization / mental preparation", label: "Visualización / preparación mental" },
      { value: "Focus and activation routines", label: "Rutinas de enfoque y activación" },
      { value: "Continuous improvement mindset", label: "Mentalidad de mejora continua" }
    ]
  },
  trainability: {
    label: "Habilidades de Entrenabilidad y Progreso",
    options: [
      { value: "Ability to receive and apply feedback", label: "Capacidad para recibir y aplicar retroalimentación" },
      { value: "Training consistency", label: "Consistencia en el entrenamiento" },
      { value: "Autonomy in improvement process", label: "Autonomía en el proceso de mejora" },
      { value: "Technical / tactical curiosity", label: "Curiosidad técnica / táctica" },
      { value: "Adaptability to new environments", label: "Adaptabilidad a nuevos entornos" },
      { value: "Commitment to sports objectives", label: "Compromiso con los objetivos deportivos" }
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
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#53fb52",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#0d2635",
    fontWeight: "600",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#0d2635",
    ':hover': { backgroundColor: "#3dd93c", color: "#0d2635" },
  }),
  input: (provided) => ({
    ...provided,
    color: "#eaf6ff",
  }),
};

const parseEntry = (item) => {
  if (!item) return { startYear: "", endYear: "", text: "" };
  if (typeof item === "object") {
    return {
      startYear: item.startYear || "",
      endYear: item.endYear || "",
      text: item.description || "",
    };
  }
  // compatibilidad con formato antiguo "YEAR - texto"
  const match = String(item).match(/^(\d{4})[\s\-:]+(.+)$/);
  if (match) return { startYear: match[1], endYear: "", text: match[2] };
  return { startYear: "", endYear: "", text: String(item) };
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
    birthDate: "",
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
    nationalities: [],
    scout: "",
    sponsor: "",
    club: "",
  });

  const [recognitionsFields, setRecognitionsFields] = useState([{ startYear: "", endYear: "", text: "" }]);
  const [experienceFields, setExperienceFields] = useState([{ startYear: "", endYear: "", text: "" }]);

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
          birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
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
          experience: data.experience || [],
          recognitions: data.recognitions || [],
          skills: convertSkillsToObject(data.skills || []),
          certifications: data.certifications || [""],
          nationalities: data.nationalities || [],
          scout: data.scout?._id || "",
          sponsor: data.sponsor?._id || "",
          club: data.club?._id || "",
        });

        const parsedRecognitions = (data.recognitions || []).map(parseEntry);
        setRecognitionsFields(parsedRecognitions.length > 0 ? parsedRecognitions : [{ startYear: "", endYear: "", text: "" }]);

        const parsedExperience = (data.experience || []).map(parseEntry);
        setExperienceFields(parsedExperience.length > 0 ? parsedExperience : [{ startYear: "", endYear: "", text: "" }]);
        
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
        setRecognitionsFields([...recognitionsFields, { startYear: "", endYear: "", text: "" }]);
      }
    } else if (field === "experience") {
      if (experienceFields.length < 10) {
        setExperienceFields([...experienceFields, { startYear: "", endYear: "", text: "" }]);
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

    // Construir experience y recognitions como arrays de objetos y excluirlos del loop
    const expData = experienceFields
      .filter(f => f.text || f.startYear || f.endYear)
      .map(f => ({ description: f.text, startYear: f.startYear, endYear: f.endYear }));
    const recData = recognitionsFields
      .filter(f => f.text || f.startYear || f.endYear)
      .map(f => ({ description: f.text, startYear: f.startYear, endYear: f.endYear }));
    delete cleanForm.experience;
    delete cleanForm.recognitions;
    const nationalitiesData = Array.isArray(cleanForm.nationalities) ? cleanForm.nationalities : [];
    delete cleanForm.nationalities;

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
    formData.append('experience', JSON.stringify(expData));
    formData.append('recognitions', JSON.stringify(recData));
    formData.append('nationalities', JSON.stringify(nationalitiesData));

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
      <h3>Habilidades (Selecciona una de cada categoría)</h3>
      {Object.entries(SKILLS_CATEGORIES).map(([categoryKey, category]) => (
        <div key={categoryKey} className={styles.skillCategory}>
          <label className={styles.categoryLabel}>{category.label}</label>
          <Select
            options={category.options}
            value={category.options.find(option => option.value === form.skills[categoryKey]) || null}
            onChange={(selectedOption) => handleSkillChange(selectedOption, categoryKey)}
            placeholder={`Seleccionar ${category.label.toLowerCase()}`}
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
          ← Volver al perfil
        </button>
        <h1 className={styles.header}>EDITAR PERFIL</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.leftCol}>
            <div className={styles.photoSection}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder}>Sin Foto</div>
              )}
              <label htmlFor="photoUpload" className={styles.photoEditBtn}>
                ✎
              </label>
              <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoChange} hidden />
            </div>

            {renderSkillsSection()}
          </div>

          <div className={styles.rightCol}>
            <label>Descripción corta</label>
            <textarea
              name="shortDescription"
              maxLength={200}
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Descripción breve para la vista previa del perfil (máx. 200 caracteres)"
              className={styles.shortDescTextarea}
              rows="3"
            />
            <div className={styles.charCount}>{form.shortDescription.length} de 200 caracteres</div>

            <label>Mi historia</label>
            <textarea
              name="about"
              maxLength={1000}
              value={form.about}
              onChange={handleChange}
              placeholder="Crea una bio detallada que presente tu carrera deportiva y personalidad"
              className={styles.introTextarea}
            />
            <div className={styles.charCount}>{form.about.length} de 1000 caracteres</div>

            <div className={styles.personalInfo}>
              <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
              <input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
              <Select
                options={GENDERS}
                value={GENDERS.find((g) => g.value === form.gender) || null}
                onChange={(opt) => handleSelectChange(opt, "gender")}
                placeholder="Género"
                styles={selectStyles}
                isClearable
              />
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
              <input name="phone" placeholder="Teléfono (+código de país)" value={form.phone} onChange={handleChange} />
            </div>

            <div className={styles.birthInfo}>
              <h3>Información de nacimiento</h3>
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === form.birthCountry) || null}
                onChange={(opt) => handleSelectChange(opt, "birthCountry")}
                placeholder="País de nacimiento"
                styles={selectStyles}
                isClearable
              />
              <Select
                options={birthCityOptions}
                value={birthCityOptions.find((c) => c.value === form.birthCity) || null}
                onChange={(opt) => handleSelectChange(opt, "birthCity")}
                placeholder={
                  loadingBirthCities ? "Cargando ciudades..." : form.birthCountry ? "Seleccionar ciudad de nacimiento" : "Selecciona primero el país de nacimiento"
                }
                isClearable
                isDisabled={!form.birthCountry || loadingBirthCities || birthCityOptions.length === 0}
                styles={selectStyles}
              />
            </div>

            <div className={styles.currentLocation}>
              <h3>Ubicación actual</h3>
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === form.country) || null}
                onChange={(opt) => handleSelectChange(opt, "country")}
                placeholder="País actual"
                styles={selectStyles}
                isClearable
              />
              <Select
                options={cityOptions}
                value={cityOptions.find((c) => c.value === form.city) || null}
                onChange={(opt) => handleSelectChange(opt, "city")}
                placeholder={
                  loadingCities ? "Cargando ciudades..." : form.country ? "Seleccionar ciudad actual" : "Selecciona primero el país"
                }
                isClearable
                isDisabled={!form.country || loadingCities || cityOptions.length === 0}
                styles={selectStyles}
              />
              <input
                name="postalCode"
                placeholder="Código Postal"
                value={form.postalCode}
                onChange={handleChange}
              />
              <input
                name="address"
                placeholder="Dirección completa"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className={styles.sportCareer}>
              <label>Carrera deportiva</label>
              <div className={styles.sportCareerFields}>
                <Select
                  options={SPORTS}
                  value={SPORTS.find((s) => s.value === form.sport) || null}
                  onChange={(opt) => handleSelectChange(opt, "sport")}
                  placeholder="Disciplina"
                  styles={selectStyles}
                  isClearable
                />
                <Select
                  options={LEVELS}
                  value={LEVELS.find((l) => l.value === form.level) || null}
                  onChange={(opt) => handleSelectChange(opt, "level")}
                  placeholder="Nivel"
                  styles={selectStyles}
                  isClearable
                />
              </div>
            </div>

            <div className={styles.relationsSection}>
              <label>Relaciones profesionales (Selecciona de la lista o escribe manualmente)</label>
              <div className={styles.relationsFields}>
                <CreatableSelect
                  options={scoutOptions}
                  value={scoutDisplay}
                  onChange={(opt) => handleRelationChange(opt, 'scout')}
                  placeholder={loadingScouts ? "Cargando scouts..." : "Seleccionar o escribir nombre de Scout"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingScouts}
                  formatCreateLabel={(inputValue) => `Usar: "${inputValue}"`}
                />
                <CreatableSelect
                  options={sponsorOptions}
                  value={sponsorDisplay}
                  onChange={(opt) => handleRelationChange(opt, 'sponsor')}
                  placeholder={loadingSponsors ? "Cargando patrocinadores..." : "Seleccionar o escribir nombre de Patrocinador"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingSponsors}
                  formatCreateLabel={(inputValue) => `Usar: "${inputValue}"`}
                />
                <CreatableSelect
                  options={clubOptions}
                  value={clubDisplay}
                  onChange={(opt) => handleRelationChange(opt, 'club')}
                  placeholder={loadingClubs ? "Cargando clubes..." : "Seleccionar o escribir nombre de Club"}
                  styles={selectStyles}
                  isClearable
                  isDisabled={loadingClubs}
                  formatCreateLabel={(inputValue) => `Usar: "${inputValue}"`}
                />
              </div>
            </div>

            <div className={styles.achievementsSection}>
              <h3>Logros</h3>
              {recognitionsFields.map((field, idx) => (
                <div key={idx} className={styles.achievementItem}>
                  <span className={styles.star}>★</span>
                  <input
                    type="number"
                    value={field.startYear}
                    onChange={(e) => handleRecognitionFieldChange(idx, "startYear", e.target.value)}
                    placeholder="Inicio"
                    className={styles.yearInput}
                    min="1900"
                    max="2050"
                    style={{ width: "72px", marginRight: "6px" }}
                  />
                  <span style={{ color: "#aaa", marginRight: "6px" }}>–</span>
                  <input
                    type="number"
                    value={field.endYear}
                    onChange={(e) => handleRecognitionFieldChange(idx, "endYear", e.target.value)}
                    placeholder="Fin"
                    className={styles.yearInput}
                    min="1900"
                    max="2050"
                    style={{ width: "72px", marginRight: "10px" }}
                  />
                  <input
                    type="text"
                    value={field.text}
                    onChange={(e) => handleRecognitionFieldChange(idx, "text", e.target.value)}
                    placeholder="Descripción del logro"
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
                  Agregar logro +
                </button>
              )}
            </div>

            <div className={styles.careerSection}>
              <h3>Carrera</h3>
              {experienceFields.map((field, idx) => (
                <div key={idx} className={styles.careerItem}>
                  <input
                    type="number"
                    value={field.startYear}
                    onChange={(e) => handleExperienceFieldChange(idx, "startYear", e.target.value)}
                    placeholder="Inicio"
                    className={styles.yearInput2}
                    min="1900"
                    max="2050"
                    style={{ width: "72px", marginRight: "6px" }}
                  />
                  <span style={{ color: "#aaa", marginRight: "6px" }}>–</span>
                  <input
                    type="number"
                    value={field.endYear}
                    onChange={(e) => handleExperienceFieldChange(idx, "endYear", e.target.value)}
                    placeholder="Fin"
                    className={styles.yearInput2}
                    min="1900"
                    max="2050"
                    style={{ width: "72px", marginRight: "10px" }}
                  />
                  <input
                    type="text"
                    value={field.text}
                    onChange={(e) => handleExperienceFieldChange(idx, "text", e.target.value)}
                    placeholder="Equipo / club / descripción"
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
                  Agregar a carrera +
                </button>
              )}
            </div>

            <div className={styles.nationalitiesSection}>
              <h3>Nacionalidades (máximo 3)</h3>
              <Select
                isMulti
                options={countryOptions}
                value={countryOptions.filter(opt => form.nationalities.includes(opt.value))}
                onChange={(selected) => {
                  if (selected && selected.length <= 3) {
                    setForm(prev => ({ ...prev, nationalities: selected.map(s => s.value) }));
                  }
                }}
                placeholder="Seleccionar hasta 3 nacionalidades"
                styles={selectStyles}
                isOptionDisabled={() => form.nationalities.length >= 3}
              />
              <div className={styles.helperText}>{form.nationalities.length}/3 nacionalidades seleccionadas</div>
            </div>

            {(profileType === "scout" || profileType === "sponsor") && (
              <div className={styles.certificationsSection}>
                <label>Certificaciones</label>
                {renderChipList("certifications", "Certificación")}
              </div>
            )}

            <button type="submit" className={styles.saveBtn}>
              Guardar cambios
            </button>
            {msg && <p className={msg.includes("error") ? styles.error : styles.success}>{msg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;