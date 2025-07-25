import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import styles from "./EditProfile.module.css";

// Solo la primera letra del párrafo en mayúscula, el resto en minúscula
function capitalizeParagraph(str) {
  if (!str) return "";
  const s = str.trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Cada palabra con la primera letra en mayúscula
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
        });
        setProfileType(data.profileType);
        if (data.photo && typeof data.photo === "string") {
          setPhotoPreview(data.photo);
        }
      });
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (form[field].length < (field === "skills" ? 5 : 10)) {
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

  // Render chips para arrays
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

  return (
    <div className={styles.editProfileBg}>
      <div className={styles.editProfileCard}>
        <h2 className={styles.title}>Editar tu perfil</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.col}>
            <label className={styles.photoP}>Foto de perfil</label>
              <div className={styles.photoUpload}>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
                <label htmlFor="photo" className={styles.photoLabel}>
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Foto de perfil" className={styles.photoPreview} />
                      <span>Cambiar o subir foto</span>
                    </>
                  ) : (
                    <>
                      <svg width="28" height="28" fill="#53fb52" style={{ marginRight: 12, verticalAlign: "middle" }} viewBox="0 0 24 24"><path d="M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm7-13h-3.586l-1.707-1.707c-.391-.391-1.023-.391-1.414 0l-1.707 1.707h-3.586c-1.104 0-2 .896-2 2v14c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2v-14c0-1.104-.896-2-2-2zm0 16h-14v-14h3.586l1.707-1.707c.391-.391 1.023-.391 1.414 0l1.707 1.707h3.586v14z"/></svg>
                      <span>Subir foto de perfil</span>
                    </>
                  )}
                </label>
              </div>
            <label>Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label>Apellido</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <label>Edad</label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />
            <label>Género</label>
            <input
              name="gender"
              value={form.gender}
              onChange={handleChange}
            />
            <label>Deporte</label>
            <input
              name="sport"
              value={form.sport}
              onChange={handleChange}
            />
            <label>Teléfono (+código país)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <label>País</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
            />
            <label>Ciudad</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className={styles.col}>
            <label>Acerca de (máx 1000 caracteres)</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              maxLength={1000}
              className={styles.textareaAbout}
            />
            <label>Experiencia deportiva</label>
            {renderChipList("experience", "Describe tu experiencia")}
            <label>Reconocimientos deportivos</label>
            {renderChipList("recognitions", "Reconocimiento")}
            <label>Skills (máx 5, solo una palabra)</label>
            {renderChipList("skills", "Skill", 5)}
            {(profileType === "scout" || profileType === "sponsor") && (
              <>
                <label>Certificaciones</label>
                {renderChipList("certifications", "Certificación")}
              </>
            )}
          </div>
          <button type="submit" className={styles.saveBtn}>
            Guardar cambios
          </button>
        </form>
        {msg && (
          <p className={msg.includes("error") ? styles.error : styles.success}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default EditProfile;