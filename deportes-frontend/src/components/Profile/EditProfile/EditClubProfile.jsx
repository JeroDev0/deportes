import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../config/fetchWithAuth";
import PhotoCropModal from "../../common/PhotoCropModal";
import CitySearch from "../../common/CitySearch";
import Select from "react-select";
import countryList from "react-select-country-list";
import styles from "./EditProfile.module.css";
import API_URL from "../../../config/api";

const ENTITY_TYPES = [
  { value: "Club", label: "Club" },
  { value: "Federación", label: "Federación" },
  { value: "Asociación", label: "Asociación" },
  { value: "Universidad", label: "Universidad" },
  { value: "Academia", label: "Academia" },
  { value: "Estudio Deportivo", label: "Estudio Deportivo" },
  { value: "Equipo", label: "Equipo" },
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
  singleValue: (provided) => ({ ...provided, color: "#eaf6ff" }),
  multiValue: (provided) => ({ ...provided, backgroundColor: "#53fb52" }),
  multiValueLabel: (provided) => ({ ...provided, color: "#0d2635", fontWeight: "600" }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#0d2635",
    ':hover': { backgroundColor: "#3dd93c", color: "#0d2635" },
  }),
  input: (provided) => ({ ...provided, color: "#eaf6ff" }),
};

function EditClubProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    entityType: "",
    founded: "",
    country: "",
    city: "",
    photo: "",
    about: "",
    shortDescription: "",
    sports: [],
  });

  const [msg, setMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const countryOptions = countryList().getData();

  useEffect(() => {
    apiFetch(`/clubs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          entityType: data.entityType || "",
          founded: data.founded ? data.founded.slice(0, 10) : "",
          country: data.country || "",
          city: data.city || "",
          photo: data.photo || "",
          about: data.about || "",
          shortDescription: data.shortDescription || "",
          sports: data.sports || [],
        });
        if (data.photo) setPhotoPreview(data.photo);
      });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectChange = (selectedOption, fieldName) => {
    const value = selectedOption ? selectedOption.value : "";
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleMultiSelectChange = (selectedOptions, fieldName) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setForm((prev) => ({ ...prev, [fieldName]: values }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropConfirm = useCallback((blob) => {
    const croppedFile = new File([blob], "photo.jpg", { type: "image/jpeg" });
    setForm((prev) => ({ ...prev, photo: croppedFile }));
    setPhotoPreview(URL.createObjectURL(blob));
    setShowCropper(false);
    setRawImageSrc(null);
  }, []);

  const handleCropCancel = useCallback(() => {
    setShowCropper(false);
    setRawImageSrc(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const formData = new FormData();
    const simpleFields = ["name", "entityType", "founded", "country", "city", "about", "shortDescription"];
    simpleFields.forEach((field) => {
      if (form[field] !== undefined && form[field] !== null) {
        formData.append(field, String(form[field]));
      }
    });
    formData.append("sports", JSON.stringify(form.sports || []));
    if (form.photo instanceof File) {
      formData.append("photo", form.photo);
    }

    try {
      const res = await fetch(`${API_URL}/clubs/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error del servidor:", data);
        setMsg(data.error || "❌ Error al actualizar");
        return;
      }

      setMsg("✅ Perfil actualizado correctamente");
      setTimeout(() => navigate(`/club-profile/${id}`), 1000);
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setMsg("❌ Error de conexión");
    }
  };

  return (
    <>
      {showCropper && rawImageSrc && (
        <PhotoCropModal
          imageSrc={rawImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <div className={styles.editProfileBg}>
        <div className={styles.editProfileCard}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
          <h1 className={styles.header}>EDITAR PERFIL DE CLUB</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.leftCol}>
              <div className={styles.photoSection}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Logo" className={styles.photo} />
                ) : (
                  <div className={styles.photoPlaceholder}>Sin Logo</div>
                )}
                <label htmlFor="photoUpload" className={styles.photoEditBtn}>✎</label>
                <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoChange} hidden />
              </div>

              <div className={styles.sportsSection}>
                <h3>Deportes</h3>
                <Select
                  isMulti
                  options={SPORTS}
                  value={SPORTS.filter((s) => form.sports.includes(s.value))}
                  onChange={(opt) => handleMultiSelectChange(opt, "sports")}
                  styles={selectStyles}
                />
              </div>
            </div>

            <div className={styles.rightCol}>
              <label>Nombre de la entidad</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Tipo de entidad</label>
              <Select
                options={ENTITY_TYPES}
                value={ENTITY_TYPES.find((i) => i.value === form.entityType)}
                onChange={(opt) => handleSelectChange(opt, "entityType")}
                styles={selectStyles}
              />

              <label>Fecha de fundación</label>
              <input type="date" name="founded" value={form.founded} onChange={handleChange} />

              <label>Descripción corta</label>
              <textarea name="shortDescription" maxLength={200} value={form.shortDescription} onChange={handleChange} rows="2" />

              <label>Sobre el club</label>
              <textarea name="about" maxLength={1000} value={form.about} onChange={handleChange} rows="5" />

              <div className={styles.currentLocation}>
                <h3>Ubicación</h3>
                <Select
                  options={countryOptions}
                  value={countryOptions.find((c) => c.value === form.country)}
                  onChange={(opt) => handleSelectChange(opt, "country")}
                  styles={selectStyles}
                />
                <CitySearch
                  countryCode={form.country}
                  value={form.city}
                  onChange={(val) => setForm((prev) => ({ ...prev, city: val }))}
                  placeholder="Escribe la ciudad..."
                  disabled={!form.country}
                />
              </div>

              <button type="submit" className={styles.saveBtn}>Guardar cambios</button>
              {msg && <p className={msg.includes("Error") || msg.includes("❌") ? styles.error : styles.success}>{msg}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditClubProfile;
