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

  useEffect(() => {
    fetch(`http://localhost:5000/deportistas/${id}`)
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
      });
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, field, idx) => {
    const arr = [...form[field]];
    let value = e.target.value;
    // Para skills: solo una palabra
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
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // Prepara los arrays para que no tengan strings vacíos
    const cleanForm = { ...form };

    // Capitaliza campos de una sola palabra o nombre propio
    ["name", "lastName", "city", "country", "sport", "gender"].forEach((field) => {
      if (cleanForm[field]) cleanForm[field] = capitalizeWords(cleanForm[field]);
    });

    // Capitaliza arrays de palabras (skills, certificaciones)
    ["skills", "certifications"].forEach((field) => {
      if (Array.isArray(cleanForm[field])) {
        cleanForm[field] = cleanForm[field]
          .filter((v) => v && v.trim() !== "")
          .map((v) => capitalizeWords(v));
      }
    });

    // Capitaliza arrays de párrafos (experiencia, reconocimientos)
    ["experience", "recognitions"].forEach((field) => {
      if (Array.isArray(cleanForm[field])) {
        cleanForm[field] = cleanForm[field]
          .filter((v) => v && v.trim() !== "")
          .map((v) => capitalizeParagraph(v));
      }
    });

    // Capitaliza el campo "about" como párrafo
    if (cleanForm.about) cleanForm.about = capitalizeParagraph(cleanForm.about);

    // Usa FormData para enviar archivos y arrays
    const formData = new FormData();
    Object.entries(cleanForm).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    const res = await fetch(`http://localhost:5000/deportistas/${id}`, {
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

  return (
    <div className={styles.editProfileBg}>
      <div className={styles.editProfileCard}>
        <h2 className={styles.title}>Editar tu perfil</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.col}>
            <label>Foto de perfil</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
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
            <label>Acerca de (máx 250 caracteres)</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              maxLength={250}
            />
            <label>Experiencia deportiva</label>
            {form.experience.map((exp, idx) => (
              <div key={idx} className={styles.arrayField}>
                <input
                  value={exp}
                  onChange={(e) => handleArrayChange(e, "experience", idx)}
                />
                {form.experience.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeArrayField("experience", idx)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => addArrayField("experience")}
            >
              + Experiencia
            </button>
            <label>Reconocimientos deportivos</label>
            {form.recognitions.map((rec, idx) => (
              <div key={idx} className={styles.arrayField}>
                <input
                  value={rec}
                  onChange={(e) => handleArrayChange(e, "recognitions", idx)}
                />
                {form.recognitions.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeArrayField("recognitions", idx)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => addArrayField("recognitions")}
            >
              + Reconocimiento
            </button>
            <label>Skills (máx 5, solo una palabra)</label>
            {form.skills.map((skill, idx) => (
              <div key={idx} className={styles.arrayField}>
                <input
                  value={skill}
                  onChange={(e) => handleArrayChange(e, "skills", idx)}
                  pattern="^\S+$"
                  title="Solo una palabra por skill"
                />
                {form.skills.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeArrayField("skills", idx)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            {form.skills.length < 5 && (
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => addArrayField("skills")}
              >
                + Skill
              </button>
            )}
            {(profileType === "scout" || profileType === "sponsor") && (
              <>
                <label>Certificaciones</label>
                {form.certifications.map((cert, idx) => (
                  <div key={idx} className={styles.arrayField}>
                    <input
                      value={cert}
                      onChange={(e) =>
                        handleArrayChange(e, "certifications", idx)
                      }
                    />
                    {form.certifications.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeArrayField("certifications", idx)}
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addArrayField("certifications")}
                >
                  + Certificación
                </button>
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