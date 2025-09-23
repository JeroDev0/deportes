import { useState } from "react";
import styles from "./EditProfile.module.css";

function EditScoutProfile({ profile, onSave }) {
  const [form, setForm] = useState(profile);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(
      `https://deportes-production.up.railway.app/scouts/${profile._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (res.ok) onSave(data);
    else alert("Error al guardar cambios");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Nombre" />
      <input name="lastName" value={form.lastName || ""} onChange={handleChange} placeholder="Apellido" />
      <input name="company" value={form.company || ""} onChange={handleChange} placeholder="Compañía" />
      <input name="country" value={form.country || ""} onChange={handleChange} placeholder="País" />
      <input name="city" value={form.city || ""} onChange={handleChange} placeholder="Ciudad" />
      <button type="submit">Guardar</button>
    </form>
  );
}
export default EditScoutProfile;