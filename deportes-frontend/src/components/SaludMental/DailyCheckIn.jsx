import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import styles from "./DailyCheckIn.module.css";

const API = "https://deportes-production.up.railway.app";

const CAMPOS = [
  { key: "estadoAnimo",  label: "Estado de ánimo",   izq: "Agotado",      der: "Excelente",   invertido: false },
  { key: "nivelEstres",  label: "Nivel de estrés",   izq: "Sin estrés",   der: "Muy alto",    invertido: true  },
  { key: "calidadSueno", label: "Calidad del sueño", izq: "Muy mala",     der: "Excelente",   invertido: false },
  { key: "fatigaFisica", label: "Fatiga física",     izq: "Sin fatiga",   der: "Agotamiento", invertido: true  },
  { key: "motivacion",   label: "Motivación",        izq: "Sin ganas",    der: "Máximas",     invertido: false },
];

function valorTexto(val, invertido) {
  const v = invertido ? 11 - val : val;
  if (v <= 3) return { texto: "Bajo", color: "#e05555" };
  if (v <= 6) return { texto: "Moderado", color: "#f0b429" };
  return { texto: "Alto", color: "#53fb52" };
}

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

const INIT = { estadoAnimo: 5, nivelEstres: 5, calidadSueno: 5, fatigaFisica: 5, motivacion: 5, notas: "" };

function DailyCheckIn({ onSaved }) {
  const { token } = useAuth();
  const [form, setForm] = useState(INIT);
  const [checkinExistente, setCheckinExistente] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/checkins/today`, { headers: { "x-auth-token": token } })
      .then(r => r.json())
      .then(data => {
        if (data && data._id) {
          setCheckinExistente(data);
          setForm({
            estadoAnimo:  data.estadoAnimo,
            nivelEstres:  data.nivelEstres,
            calidadSueno: data.calidadSueno,
            fatigaFisica: data.fatigaFisica,
            motivacion:   data.motivacion,
            notas:        data.notas || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleSlider = (key, val) => setForm(f => ({ ...f, [key]: Number(val) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const r = await fetch(`${API}/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) {
        setGuardado(true);
        setTimeout(() => onSaved && onSaved(), 1400);
      } else {
        setError(data.error || `Error ${r.status}: no se pudo guardar el check-in`);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifica tu conexión.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className={styles.loading}>Cargando check-in...</div>;

  return (
    <div className={styles.wrapper}>
      {/* Cabecera */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Check-in diario</h3>
          <p className={styles.fecha}>{fechaHoy()}</p>
        </div>
        {checkinExistente && (
          <span className={styles.yaRegistrado}>Ya registrado hoy · Puedes editarlo</span>
        )}
      </div>

      {guardado ? (
        <div className={styles.successMsg}>
          <span className={styles.successIcon}>✓</span>
          <p>Check-in guardado correctamente</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {CAMPOS.map(({ key, label, izq, der, invertido }) => {
            const { texto, color } = valorTexto(form[key], invertido);
            return (
              <div key={key} className={styles.campo}>
                <div className={styles.campoHeader}>
                  <span className={styles.campoLabel}>{label}</span>
                  <span className={styles.campoValor} style={{ color }}>{texto}</span>
                </div>
                <div className={styles.sliderRow}>
                  <span className={styles.sliderExt}>{izq}</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form[key]}
                    onChange={e => handleSlider(key, e.target.value)}
                    className={styles.slider}
                    style={{ "--accent": color }}
                  />
                  <span className={styles.sliderExt}>{der}</span>
                </div>
              </div>
            );
          })}

          {/* Notas / Journaling */}
          <div className={styles.campo}>
            <div className={styles.campoHeader}>
              <span className={styles.campoLabel}>Notas del día</span>
              <span className={styles.charCount}>{form.notas.length}/500</span>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="¿Hubo algo especial en el entrenamiento de hoy? (opcional)"
              maxLength={500}
              value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
              rows={3}
            />
          </div>

          {error && (
            <div className={styles.errorMsg}>
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={guardando}>
            {guardando ? "Guardando..." : checkinExistente ? "Actualizar check-in" : "Guardar check-in"}
          </button>
        </form>
      )}
    </div>
  );
}

export default DailyCheckIn;
