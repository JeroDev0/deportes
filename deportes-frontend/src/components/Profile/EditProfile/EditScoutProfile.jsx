import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import { apiFetch } from "../../../config/fetchWithAuth";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";
import API_URL from "../../../config/api";

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

const SPECIALIZATIONS = [
  { value: "Technical Analysis", label: "Análisis Técnico" },
  { value: "Athletic Performance", label: "Rendimiento Atlético" },
  { value: "Youth Development", label: "Desarrollo Juvenil" },
  { value: "Tactical Scouting", label: "Scouting Táctico" },
  { value: "International Recruiting", label: "Reclutamiento Internacional" },
  { value: "Team Building", label: "Formación de Equipos" },
  { value: "Performance Analysis", label: "Análisis de Rendimiento" },
  { value: "Talent Identification", label: "Identificación de Talento" },
];

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
    ':hover': {
      backgroundColor: "#3dd93c",
      color: "#0d2635",
    },
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
  const match = String(item).match(/^(\d{4})[\s\-:]+(.+)$/);
  if (match) return { startYear: match[1], endYear: "", text: match[2] };
  return { startYear: "", endYear: "", text: String(item) };
};

function EditScoutProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    company: "",
    specialization: "",
    sports: [],
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
    certifications: [""],
    athletes: [],
    clubs: [],
    sponsors: [],
  });

  const [recognitionsFields, setRecognitionsFields] = useState([{ startYear: "", endYear: "", text: "" }]);
  const [experienceFields, setExperienceFields] = useState([{ startYear: "", endYear: "", text: "" }]);

  const [msg, setMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  const [birthCityOptions, setBirthCityOptions] = useState([]);
  const [loadingBirthCities, setLoadingBirthCities] = useState(false);

  const [athleteOptions, setAthleteOptions] = useState([]);
  const [clubOptions, setClubOptions] = useState([]);
  const [sponsorOptions, setSponsorOptions] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [loadingSponsors, setLoadingSponsors] = useState(false);

  const countryOptions = countryList().getData();

  useEffect(() => {
    apiFetch(`/scouts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          lastName: data.lastName || "",
          age: data.age || "",
          gender: data.gender || "",
          phone: data.phone || "",
          company: data.company || "",
          specialization: data.specialization || "",
          sports: data.sports || [],
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
          certifications: data.certifications || [""],
          athletes: data.athletes?.map(a => a._id) || [],
          clubs: data.clubs?.map(c => c._id) || [],
          sponsors: data.sponsors?.map(s => s._id) || [],
        });
        
        const parsedRecognitions = (data.recognitions || []).map(parseEntry);
        setRecognitionsFields(parsedRecognitions.length > 0 ? parsedRecognitions : [{ startYear: "", endYear: "", text: "" }]);

        const parsedExperience = (data.experience || []).map(parseEntry);
        setExperienceFields(parsedExperience.length > 0 ? parsedExperience : [{ startYear: "", endYear: "", text: "" }]);
        
        if (data.photo && typeof data.photo === "string") {
          setPhotoPreview(data.photo);
        }
      });
  }, [id]);

  useEffect(() => {
    setLoadingAthletes(true);
    apiFetch("/deportistas")
      .then((res) => res.json())
      .then((data) => {
        setAthleteOptions(
          data.map((athlete) => ({
            value: athlete._id,
            label: `${athlete.name} ${athlete.lastName}` + (athlete.sport ? ` - ${athlete.sport}` : ""),
          }))
        );
      })
      .catch(() => setAthleteOptions([]))
      .finally(() => setLoadingAthletes(false));
  }, []);

  useEffect(() => {
    setLoadingClubs(true);
    apiFetch("/clubs")
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

  useEffect(() => {
    setLoadingSponsors(true);
    apiFetch("/sponsors")
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

  const handleMultiSelectChange = (selectedOptions, fieldName) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setForm(prev => ({ ...prev, [fieldName]: values }));
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

    console.log("=== ENVIANDO DATOS ===");
    console.log("Form data:", form);

    const formData = new FormData();
    
    const simpleFields = [
      'name', 'lastName', 'age', 'gender', 'phone', 'company', 
      'specialization', 'country', 'city', 'postalCode', 'address', 
      'birthCountry', 'birthCity', 'about', 'shortDescription'
    ];

    simpleFields.forEach(field => {
      const value = form[field];
      if (value !== null && value !== undefined) {
        formData.append(field, value === '' ? '' : String(value));
      }
    });

    const expData = experienceFields
      .filter(f => f.text || f.startYear || f.endYear)
      .map(f => ({ description: f.text, startYear: f.startYear, endYear: f.endYear }));
    const recData = recognitionsFields
      .filter(f => f.text || f.startYear || f.endYear)
      .map(f => ({ description: f.text, startYear: f.startYear, endYear: f.endYear }));
    formData.append('experience', JSON.stringify(expData));
    formData.append('recognitions', JSON.stringify(recData));

    const certItems = form.certifications.filter(item =>
      item && item.trim() !== '' && item !== 'null' && item !== 'undefined'
    );
    formData.append('certifications', JSON.stringify(certItems.length > 0 ? certItems : []));

    if (form.sports && form.sports.length > 0) {
      formData.append('sports', JSON.stringify(form.sports));
    } else {
      formData.append('sports', JSON.stringify([]));
    }

    ['athletes', 'clubs', 'sponsors'].forEach(field => {
      const ids = form[field].filter(id => 
        id && id !== 'null' && id !== 'undefined'
      );
      
      if (ids.length > 0) {
        formData.append(field, JSON.stringify(ids));
      } else {
        formData.append(field, JSON.stringify([]));
      }
    });

    if (form.photo instanceof File) {
      formData.append('photo', form.photo);
    }

    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

    try {
      const res = await fetch(`${API_URL}/scouts/${id}`, {
        method: "PUT",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { error: "Respuesta inválida del servidor" };
      }

      console.log("Respuesta del servidor:", data);

      if (res.ok) {
        setMsg("✅ Perfil actualizado exitosamente");
        setTimeout(() => navigate(`/scout-profile/${id}`), 1000);
      } else {
        setMsg(data.error || "❌ Error al actualizar");
        console.error("Error details:", data.details);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setMsg("❌ Error de conexión");
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

  return (
    <div className={styles.editProfileBg}>
      <div className={styles.editProfileCard}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Volver al perfil
        </button>
        <h1 className={styles.header}>EDITAR PERFIL PROFESIONAL DEPORTIVO</h1>

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

            <div className={styles.sportsSection}>
              <h3>Especialización deportiva</h3>
              <Select
                isMulti
                options={SPORTS}
                value={SPORTS.filter(sport => form.sports.includes(sport.value))}
                onChange={(selectedOptions) => {
                  if (selectedOptions && selectedOptions.length <= 3) {
                    handleMultiSelectChange(selectedOptions, 'sports');
                  }
                }}
                placeholder="Seleccionar hasta 3 deportes"
                styles={selectStyles}
                className={styles.sportsSelect}
                isOptionDisabled={() => form.sports.length >= 3}
              />
              <div className={styles.helperText}>
                {form.sports.length}/3 deportes seleccionados
              </div>
            </div>

            <div className={styles.certificationsSection}>
              <h3>Certificación</h3>
              <input
                type="url"
                name="certificationUrl"
                value={form.certifications[0] || ""}
                onChange={(e) => {
                  const newCerts = [e.target.value];
                  setForm({ ...form, certifications: newCerts });
                }}
                placeholder="https://tu-url-de-certificacion.com"
                className={styles.certificationInput}
              />
              <div className={styles.helperText}>
                Ingresa la URL de tu certificación profesional
              </div>
            </div>
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

            <label>Bio profesional</label>
            <textarea
              name="about"
              maxLength={1000}
              value={form.about}
              onChange={handleChange}
              placeholder="Comparte tu experiencia profesional, enfoque y filosofía de scouting"
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
                type="number"
                name="age"
                placeholder="Edad"
                value={form.age}
                onChange={handleChange}
                min={1}
                max={120}
              />
              <input name="phone" placeholder="Teléfono (+código de país)" value={form.phone} onChange={handleChange} />
            </div>

            <div className={styles.companyInfo}>
              <h3>Información profesional</h3>
              <input
                name="company"
                placeholder="Empresa u organización"
                value={form.company}
                onChange={handleChange}
              />
              <Select
                options={SPECIALIZATIONS}
                value={SPECIALIZATIONS.find((s) => s.value === form.specialization) || null}
                onChange={(opt) => handleSelectChange(opt, "specialization")}
                placeholder="Especialización"
                styles={selectStyles}
                isClearable
              />
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

            <div className={styles.professionalConnections}>
              <h3>Red profesional</h3>
              <label>Deportistas</label>
              <Select
                isMulti
                options={athleteOptions}
                value={athleteOptions.filter(option => form.athletes.includes(option.value))}
                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'athletes')}
                placeholder={loadingAthletes ? "Cargando deportistas..." : "Seleccionar deportistas"}
                styles={selectStyles}
                isDisabled={loadingAthletes}
              />

              <label>Clubes</label>
              <Select
                isMulti
                options={clubOptions}
                value={clubOptions.filter(option => form.clubs.includes(option.value))}
                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'clubs')}
                placeholder={loadingClubs ? "Cargando clubes..." : "Seleccionar clubes"}
                styles={selectStyles}
                isDisabled={loadingClubs}
              />

              <label>Patrocinadores</label>
              <Select
                isMulti
                options={sponsorOptions}
                value={sponsorOptions.filter(option => form.sponsors.includes(option.value))}
                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'sponsors')}
                placeholder={loadingSponsors ? "Cargando patrocinadores..." : "Seleccionar patrocinadores"}
                styles={selectStyles}
                isDisabled={loadingSponsors}
              />
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
              <h3>Experiencia profesional</h3>
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
                    placeholder="Cargo o rol profesional"
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
                  Agregar experiencia +
                </button>
              )}
            </div>

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

export default EditScoutProfile;