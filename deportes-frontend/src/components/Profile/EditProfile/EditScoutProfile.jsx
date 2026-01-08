import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";
import API_URL from "../../../config/api";

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

const SPECIALIZATIONS = [
  { value: "Technical Analysis", label: "Technical Analysis" },
  { value: "Athletic Performance", label: "Athletic Performance" },
  { value: "Youth Development", label: "Youth Development" },
  { value: "Tactical Scouting", label: "Tactical Scouting" },
  { value: "International Recruiting", label: "International Recruiting" },
  { value: "Team Building", label: "Team Building" },
  { value: "Performance Analysis", label: "Performance Analysis" },
  { value: "Talent Identification", label: "Talent Identification" },
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

  const [recognitionsFields, setRecognitionsFields] = useState([{ year: "", text: "" }]);
  const [experienceFields, setExperienceFields] = useState([{ year: "", text: "" }]);

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
    fetch(`${API_URL}/scouts/${id}`)
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
        
        const parsedRecognitions = (data.recognitions || [""]).map(parseYearText);
        setRecognitionsFields(parsedRecognitions.length > 0 ? parsedRecognitions : [{ year: "", text: "" }]);
        
        const parsedExperience = (data.experience || [""]).map(parseYearText);
        setExperienceFields(parsedExperience.length > 0 ? parsedExperience : [{ year: "", text: "" }]);
        
        if (data.photo && typeof data.photo === "string") {
          setPhotoPreview(data.photo);
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

  useEffect(() => {
    setLoadingAthletes(true);
    fetch("${API_URL}/deportistas")
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
    fetch("${API_URL}/clubs")
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
    fetch("${API_URL}/sponsors")
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

    ['experience', 'recognitions', 'certifications'].forEach(field => {
      const items = form[field].filter(item => 
        item && item.trim() !== '' && item !== 'null' && item !== 'undefined'
      );
      
      if (items.length > 0) {
        formData.append(field, JSON.stringify(items));
      } else {
        formData.append(field, JSON.stringify([]));
      }
    });

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
          ← Back to Profile
        </button>
        <h1 className={styles.header}>EDIT SPORTS PROFESSIONALS PROFILE</h1>

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

            <div className={styles.sportsSection}>
              <h3>Sports Specialization</h3>
              <Select
                isMulti
                options={SPORTS}
                value={SPORTS.filter(sport => form.sports.includes(sport.value))}
                onChange={(selectedOptions) => {
                  if (selectedOptions && selectedOptions.length <= 3) {
                    handleMultiSelectChange(selectedOptions, 'sports');
                  }
                }}
                placeholder="Select up to 3 sports"
                styles={selectStyles}
                className={styles.sportsSelect}
                isOptionDisabled={() => form.sports.length >= 3}
              />
              <div className={styles.helperText}>
                {form.sports.length}/3 sports selected
              </div>
            </div>

            <div className={styles.certificationsSection}>
              <h3>Certification</h3>
              <input
                type="url"
                name="certificationUrl"
                value={form.certifications[0] || ""}
                onChange={(e) => {
                  const newCerts = [e.target.value];
                  setForm({ ...form, certifications: newCerts });
                }}
                placeholder="https://your-certification-url.com"
                className={styles.certificationInput}
              />
              <div className={styles.helperText}>
                Enter the URL of your professional certification
              </div>
            </div>
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

            <label>Professional Bio</label>
            <textarea
              name="about"
              maxLength={1000}
              value={form.about}
              onChange={handleChange}
              placeholder="Share your professional experience, approach, and scouting philosophy"
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
                min={1}
                max={120}
              />
              <input name="phone" placeholder="Phone (+country code)" value={form.phone} onChange={handleChange} />
            </div>

            <div className={styles.companyInfo}>
              <h3>Professional Information</h3>
              <input
                name="company"
                placeholder="Company or Organization"
                value={form.company}
                onChange={handleChange}
              />
              <Select
                options={SPECIALIZATIONS}
                value={SPECIALIZATIONS.find((s) => s.value === form.specialization) || null}
                onChange={(opt) => handleSelectChange(opt, "specialization")}
                placeholder="Specialization"
                styles={selectStyles}
                isClearable
              />
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

            <div className={styles.professionalConnections}>
              <h3>Professional Network</h3>
              <label>Athletes</label>
              <Select
                isMulti
                options={athleteOptions}
                value={athleteOptions.filter(option => form.athletes.includes(option.value))}
                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'athletes')}
                placeholder={loadingAthletes ? "Loading athletes..." : "Select athletes"}
                styles={selectStyles}
                isDisabled={loadingAthletes}
              />

              <label>Clubs</label>
              <Select
                isMulti
                options={clubOptions}
                value={clubOptions.filter(option => form.clubs.includes(option.value))}
                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'clubs')}
                placeholder={loadingClubs ? "Loading clubs..." : "Select clubs"}
                styles={selectStyles}
                isDisabled={loadingClubs}
              />

              <label>Sponsors</label>
              <Select
                isMulti
                options={sponsorOptions}
                value={sponsorOptions.filter(option => form.sponsors.includes(option.value))}
                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'sponsors')}
                placeholder={loadingSponsors ? "Loading sponsors..." : "Select sponsors"}
                styles={selectStyles}
                isDisabled={loadingSponsors}
              />
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
              <h3>Professional Experience</h3>
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
                    placeholder="Professional position or role"
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
                  Add Experience +
                </button>
              )}
            </div>

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

export default EditScoutProfile;