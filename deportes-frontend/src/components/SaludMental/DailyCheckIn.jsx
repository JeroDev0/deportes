import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./DailyCheckIn.module.css";

const API = "https://deportes-production.up.railway.app";

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

const INIT = { estadoAnimo: 5, nivelEstres: 5, calidadSueno: 5, fatigaFisica: 5, motivacion: 5, notas: "" };

function DailyCheckIn({ onSaved }) {
  const { token } = useAuth();
  const { t } = useLanguage();

  const CAMPOS = [
    { key: "estadoAnimo",  label: t("checkin_mood"),         izq: t("checkin_exhausted"),    der: t("checkin_excellent"),   invertido: false },
    { key: "nivelEstres",  label: t("checkin_stress_level"), izq: t("checkin_no_stress"),    der: t("checkin_very_high"),   invertido: true  },
    { key: "calidadSueno", label: t("checkin_sleep_q"),      izq: t("checkin_very_bad"),     der: t("checkin_excellent"),   invertido: false },
    { key: "fatigaFisica", label: t("checkin_fatigue"),      izq: t("checkin_no_fatigue"),   der: t("checkin_exhaustion"),  invertido: true  },
    { key: "motivacion",   label: t("checkin_motivation"),   izq: t("checkin_no_motivation"),der: t("checkin_max"),         invertido: false },
  ];

  const valorTexto = (val, invertido) => {
    const v = invertido ? 11 - val : val;
    if (v <= 3) return { texto: t("checkin_low"), color: "#e05555" };
    if (v <= 6) return { texto: t("checkin_moderate"), color: "#f0b429" };
    return { texto: t("checkin_high"), color: "#53fb52" };
  };
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

  if (loading) return <div className={styles.loading}>{t("checkin_loading")}</div>;

  return (
    <div className={styles.wrapper}>
      {/* Cabecera */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{t("checkin_title")}</h3>
          <p className={styles.fecha}>{fechaHoy()}</p>
        </div>
        {checkinExistente && (
          <span className={styles.yaRegistrado}>{t("checkin_already")}</span>
        )}
      </div>

      {guardado ? (
        <div className={styles.successMsg}>
          <span className={styles.successIcon}>✓</span>
          <p>{t("checkin_saved")}</p>
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
              <span className={styles.campoLabel}>{t("checkin_notes_label")}</span>
              <span className={styles.charCount}>{form.notas.length}/500</span>
            </div>
            <textarea
              className={styles.textarea}
              placeholder={t("checkin_notes_ph")}
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
            {guardando ? t("checkin_saving") : checkinExistente ? t("checkin_update") : t("checkin_save")}
          </button>
        </form>
      )}
    </div>
  );
}

export default DailyCheckIn;
