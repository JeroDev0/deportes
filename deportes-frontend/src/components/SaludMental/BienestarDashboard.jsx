import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import styles from "./BienestarDashboard.module.css";

const API = "https://deportes-production.up.railway.app";

function nivelTexto(valor, invertido = false) {
  if (!valor) return "—";
  const v = invertido ? 11 - valor : valor;
  if (v <= 3) return "Bajo";
  if (v <= 6) return "Moderado";
  return "Alto";
}

function nivelColor(valor, invertido = false) {
  if (!valor) return "#4a6a8a";
  const v = invertido ? 11 - valor : valor;
  if (v <= 3) return "#e05555";
  if (v <= 6) return "#f0b429";
  return "#53fb52";
}

function sugerencias(checkin) {
  if (!checkin) return [];
  const lista = [];
  if (checkin.nivelEstres >= 7) lista.push({ texto: "Respiración Box Breathing — reduce tu estrés en 3 min", cat: "respiracion_foco" });
  if (checkin.calidadSueno <= 4) lista.push({ texto: "Optimización del Sueño — protocolo de ritmo circadiano", cat: "optimizacion_sueno" });
  if (checkin.motivacion <= 4) lista.push({ texto: "Reframing ante la desmotivación — técnica cognitiva", cat: "fortaleza_mental" });
  if (checkin.fatigaFisica >= 8) lista.push({ texto: "Protocolo de recuperación activa post-esfuerzo", cat: "recuperacion" });
  return lista.slice(0, 2);
}

function BienestarDashboard({ profile, onGoCheckIn }) {
  const { token } = useAuth();
  const [checkinHoy, setCheckinHoy] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { "x-auth-token": token };
    Promise.all([
      fetch(`${API}/checkins/today`, { headers }).then(r => r.json()),
      fetch(`${API}/checkins/history?dias=7`, { headers }).then(r => r.json()),
    ]).then(([hoy, hist]) => {
      setCheckinHoy(hoy);
      setHistorial(Array.isArray(hist) ? hist.slice(0, 7).reverse() : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const score = checkinHoy?.puntuacionPreparacion ?? null;

  const scoreColor = score === null ? "#4a6a8a" : score >= 70 ? "#53fb52" : score >= 40 ? "#f0b429" : "#e05555";
  const scoreLabel = score === null ? "—" : score >= 70 ? "Óptimo" : score >= 40 ? "Moderado" : "Bajo";

  const sugs = sugerencias(checkinHoy);

  if (loading) {
    return <div className={styles.loading}>Cargando bienestar...</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* Score principal */}
      <div className={styles.scoreRow}>
        <div className={styles.scoreCard}>
          <span className={styles.scoreLabel}>Preparación diaria</span>
          <div className={styles.scoreCircle} style={{ borderColor: scoreColor }}>
            <span className={styles.scoreNumber} style={{ color: scoreColor }}>
              {score !== null ? score : "—"}
            </span>
            <span className={styles.scoreMax}>/100</span>
          </div>
          <span className={styles.scoreBadge} style={{ color: scoreColor }}>{scoreLabel}</span>
        </div>

        {/* Estado mental */}
        {checkinHoy ? (
          <div className={styles.statusCard}>
            <p className={styles.statusTitle}>Estado mental</p>
            <div className={styles.statusRow}>
              <span className={styles.statusKey}>Estrés</span>
              <span className={styles.statusVal} style={{ color: nivelColor(checkinHoy.nivelEstres, true) }}>
                {nivelTexto(checkinHoy.nivelEstres, true)}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusKey}>Foco</span>
              <span className={styles.statusVal} style={{ color: nivelColor(checkinHoy.motivacion) }}>
                {nivelTexto(checkinHoy.motivacion)}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusKey}>Sueño</span>
              <span className={styles.statusVal} style={{ color: nivelColor(checkinHoy.calidadSueno) }}>
                {nivelTexto(checkinHoy.calidadSueno)}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusKey}>Estado ánimo</span>
              <span className={styles.statusVal} style={{ color: nivelColor(checkinHoy.estadoAnimo) }}>
                {nivelTexto(checkinHoy.estadoAnimo)}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.noCheckinCard}>
            <p>Aún no has completado el check-in de hoy</p>
            <button className={styles.checkinBtn} onClick={onGoCheckIn} type="button">
              Completar check-in
            </button>
          </div>
        )}
      </div>

      {/* Tendencia 7 días */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Tendencia — últimos 7 días</p>
        <div className={styles.barChart}>
          {historial.length > 0 ? historial.map((c, i) => {
            const h = c.puntuacionPreparacion ?? 0;
            const dia = c.fecha ? c.fecha.slice(5) : `D${i + 1}`;
            const col = h >= 70 ? "#53fb52" : h >= 40 ? "#f0b429" : "#e05555";
            return (
              <div key={c._id || i} className={styles.barItem}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ height: `${h}%`, background: col }} />
                </div>
                <span className={styles.barLabel}>{dia}</span>
              </div>
            );
          }) : (
            <p className={styles.emptyHint}>Registra tu primer check-in para ver la tendencia.</p>
          )}
        </div>
      </div>

      {/* Sugerencias automáticas */}
      {sugs.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Próximos pasos sugeridos</p>
          <div className={styles.suggestList}>
            {sugs.map((s, i) => (
              <div key={i} className={styles.suggestItem}>
                <span className={styles.suggestDot} />
                <span className={styles.suggestText}>{s.texto}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón check-in */}
      <button
        className={styles.mainCheckinBtn}
        onClick={onGoCheckIn}
        type="button"
      >
        {checkinHoy ? "Ver check-in de hoy" : "Completar check-in de hoy"}
      </button>
    </div>
  );
}

export default BienestarDashboard;
