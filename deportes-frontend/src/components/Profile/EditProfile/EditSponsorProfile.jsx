import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.js";
import Select from "react-select";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";
import API_URL from "../../../config/api";

const INDUSTRIES = [
  { value: "Sports Equipment", label: "Sports Equipment" },
  { value: "Nutrition & Health", label: "Nutrition & Health" },
  { value: "Apparel & Footwear", label: "Apparel & Footwear" },
  { value: "Technology", label: "Technology" },
  { value: "Beverages", label: "Beverages" },
  { value: "Banking & Finance", label: "Banking & Finance" },
  { value: "Automotive", label: "Automotive" },
  { value: "Media & Entertainment", label: "Media & Entertainment" },
];

const SPORTS = [
  { value: "Soccer", label: "Soccer" },
  { value: "Cycling", label: "Cycling" },
  { value: "Athletics", label: "Athletics" },
  { value: "Basketball", label: "Basketball" },
  { value: "Swimming", label: "Swimming" },
  { value: "Tennis", label: "Tennis" },
  { value: "Boxing", label: "Boxing" },
  { value: "Weightlifting", label: "Weightlifting" },
];

const CATEGORIES = [
  { value: "Sub 13", label: "Sub 13" },
  { value: "Sub 15", label: "Sub 15" },
  { value: "Sub 17", label: "Sub 17" },
  { value: "Junior", label: "Junior" },
  { value: "Sub 23", label: "Sub 23" },
  { value: "Elite", label: "Elite" },
  { value: "Senior", label: "Senior" },
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
    backgroundColor: state.isSelected
      ? "#53fb52"
      : state.isFocused
      ? "#223c54"
      : "#1a334a",
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
    ":hover": { backgroundColor: "#3dd93c", color: "#0d2635" },
  }),
  input: (provided) => ({ ...provided, color: "#eaf6ff" }),
};

function EditSponsorProfile() {
  const { id } = useParams();
  useAuth(); // (no lo usas, pero lo dejo por consistencia)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    industry: "",
    name: "",
    phone: "",
    country: "",
    city: "",
    logo: "", // string (URL o base64)
    about: "",
    shortDescription: "",
    sports: [],
    categories: [],
    athletes: [],
    clubs: [],
  });

  const [msg, setMsg] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [readingLogo, setReadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [athleteOptions, setAthleteOptions] = useState([]);
  const [clubOptions, setClubOptions] = useState([]);

  const countryOptions = countryList().getData();

  useEffect(() => {
    fetch(`${API_URL}/sponsors/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          company: data.company || "",
          industry: data.industry || "",
          name: data.name || "",
          phone: data.phone || "",
          country: data.country || "",
          city: data.city || "",
          logo: data.logo || "",
          about: data.about || "",
          shortDescription: data.shortDescription || "",
          sports: data.sports || [],
          categories: data.categories || [],
          athletes: data.athletes?.map((a) => a._id) || [],
          clubs: data.clubs?.map((c) => c._id) || [],
        });

        if (data.logo) setLogoPreview(data.logo);
      })
      .catch((err) => {
        console.error("Error cargando sponsor:", err);
      });
  }, [id]);

  // Carga de ciudades
  useEffect(() => {
    if (!form.country) return;

    setLoadingCities(true);
    fetch(
      `https://secure.geonames.org/searchJSON?country=${form.country}&featureClass=P&maxRows=1000&username=jerodev0`
    )
      .then((res) => res.json())
      .then((data) => {
        const uniqueCities = Array.from(
          new Set((data.geonames || []).map((city) => city.name))
        );
        setCityOptions(uniqueCities.map((city) => ({ value: city, label: city })));
        setLoadingCities(false);
      })
      .catch(() => {
        setCityOptions([]);
        setLoadingCities(false);
      });
  }, [form.country]);

  // Carga de Atletas y Clubes para el selector
  useEffect(() => {
    fetch(`${API_URL}/deportistas`)
      .then((res) => res.json())
      .then((data) => {
        setAthleteOptions(
          (data || []).map((a) => ({ value: a._id, label: `${a.name} ${a.lastName}` }))
        );
      });

    fetch(`${API_URL}/clubs`)
      .then((res) => res.json())
      .then((data) => {
        setClubOptions((data || []).map((c) => ({ value: c._id, label: c.name })));
      });
  }, []);

  // ✅ FIX: setForm funcional (evita pisadas)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    const value = selectedOption ? selectedOption.value : "";
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleMultiSelectChange = (selectedOptions, fieldName) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setForm((prev) => ({ ...prev, [fieldName]: values }));
  };

  // ✅ FIX: convertir a base64 y guardar como string; bloquear guardar mientras lee
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReadingLogo(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result; // string: data:image/...;base64,...
      setLogoPreview(base64String);

      setForm((prev) => ({
        ...prev,
        logo: typeof base64String === "string" ? base64String : "",
      }));

      setReadingLogo(false);
    };

    reader.onerror = () => {
      setReadingLogo(false);
      setMsg("❌ Error leyendo la imagen");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (readingLogo) {
      setMsg("⌛ Espera a que termine de cargarse el logo...");
      return;
    }

    setSaving(true);
    setMsg("");

    // ✅ Protección: logo debe ser string sí o sí
    const payload = { ...form };
    if (payload.logo && typeof payload.logo !== "string") {
      delete payload.logo;
    }

    // Debug útil (puedes quitarlo luego)
    console.log("ENVIANDO logo typeof:", typeof payload.logo);
    console.log("ENVIANDO logo preview:", (payload.logo || "").slice(0, 30));

    try {
      const res = await fetch(`${API_URL}/sponsors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error del servidor:", data);
        setMsg(`❌ Error al guardar perfil: ${data?.details || data?.error || ""}`);
        setSaving(false);
        return;
      }

      console.log("✅ Perfil guardado:", data);
      setMsg("✅ Perfil actualizado correctamente");
      setSaving(false);
      setTimeout(() => navigate(`/sponsor-profile/${id}`), 800);
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setMsg("❌ Error de conexión");
      setSaving(false);
    }
  };

  return (
    <div className={styles.editProfileBg}>
      <div className={styles.editProfileCard}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.header}>EDIT SPONSOR PROFILE</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.leftCol}>
            <div className={styles.photoSection}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder}>No Logo</div>
              )}

              <label htmlFor="logoUpload" className={styles.photoEditBtn}>
                ✎
              </label>

              <input
                type="file"
                id="logoUpload"
                accept="image/*"
                onChange={handleLogoChange}
                hidden
              />

              {readingLogo && (
                <p style={{ marginTop: 10, color: "#eaf6ff" }}>Cargando logo...</p>
              )}
            </div>

            <div className={styles.sportsSection}>
              <h3>Target Sports</h3>
              <Select
                isMulti
                options={SPORTS}
                value={SPORTS.filter((s) => form.sports.includes(s.value))}
                onChange={(opt) => handleMultiSelectChange(opt, "sports")}
                styles={selectStyles}
              />
            </div>

            <div className={styles.sportsSection}>
              <h3>Target Categories</h3>
              <Select
                isMulti
                options={CATEGORIES}
                value={CATEGORIES.filter((c) => form.categories.includes(c.value))}
                onChange={(opt) => handleMultiSelectChange(opt, "categories")}
                styles={selectStyles}
              />
            </div>
          </div>

          <div className={styles.rightCol}>
            <label>Company Name</label>
            <input name="company" value={form.company} onChange={handleChange} required />

            <label>Industry</label>
            <Select
              options={INDUSTRIES}
              value={INDUSTRIES.find((i) => i.value === form.industry)}
              onChange={(opt) => handleSelectChange(opt, "industry")}
              styles={selectStyles}
            />

            <label>Short Description</label>
            <textarea
              name="shortDescription"
              maxLength={200}
              value={form.shortDescription}
              onChange={handleChange}
              rows="2"
            />

            <label>About the Company</label>
            <textarea
              name="about"
              maxLength={1000}
              value={form.about}
              onChange={handleChange}
              rows="5"
            />

            <div className={styles.personalInfo}>
              <input
                name="name"
                placeholder="Contact Person"
                value={form.name}
                onChange={handleChange}
              />
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.currentLocation}>
              <h3>Location</h3>
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === form.country)}
                onChange={(opt) => handleSelectChange(opt, "country")}
                styles={selectStyles}
              />
              <Select
                options={cityOptions}
                value={cityOptions.find((c) => c.value === form.city)}
                onChange={(opt) => handleSelectChange(opt, "city")}
                isDisabled={!form.country || loadingCities}
                placeholder={loadingCities ? "Loading..." : "Select City"}
                styles={selectStyles}
              />
            </div>

            <div className={styles.professionalConnections}>
              <h3>Sponsored Network</h3>

              <label>Athletes</label>
              <Select
                isMulti
                options={athleteOptions}
                value={athleteOptions.filter((o) => form.athletes.includes(o.value))}
                onChange={(opt) => handleMultiSelectChange(opt, "athletes")}
                styles={selectStyles}
              />

              <label>Clubs</label>
              <Select
                isMulti
                options={clubOptions}
                value={clubOptions.filter((o) => form.clubs.includes(o.value))}
                onChange={(opt) => handleMultiSelectChange(opt, "clubs")}
                styles={selectStyles}
              />
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving || readingLogo}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {msg && (
              <p className={msg.includes("❌") ? styles.error : styles.success}>
                {msg}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSponsorProfile;