import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import styles from "./AnalisisProgreso.module.css";

const API = "https://deportes-production.up.railway.app";

function promedioArr(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function resumenSemana(checkins) {
  if (!checkins.length) return null;
  const estres  = promedioArr(checkins.map(c => c.nivelEstres));
  const sueno   = promedioArr(checkins.map(c => c.calidadSueno));
  const score   = promedioArr(checkins.map(c => c.puntuacionPreparacion));
  const lineas  = [];
  if (estres >= 7)       lineas.push(`Tu nivel de estrés estuvo elevado (${estres}/10) esta semana.`);
  else if (estres <= 3)  lineas.push(`Tu nivel de estrés fue bajo (${estres}/10) esta semana. ¡Buen control!`);
  if (sueno <= 4)        lineas.push(`La calidad de sueño fue baja (${sueno}/10). Revisa el módulo de optimización de sueño.`);
  else if (sueno >= 8)   lineas.push(`Tu sueño fue excelente esta semana (${sueno}/10).`);
  lineas.push(`Puntuación promedio de preparación: ${score}/100.`);
  return lineas.join(" ");
}

function alertas(checkins30) {
  if (!checkins30.length) return [];
  const msgs = [];
  const ultimos5 = checkins30.slice(0, 5);
  const estresAlto = ultimos5.filter(c => c.nivelEstres >= 7);
  if (estresAlto.length >= 4) msgs.push("Durante los últimos 5 días tu estrés ha sido Alto. Considera revisar tu carga de entrenamiento.");
  const bajos = checkins30.slice(0, 3).filter(c => c.puntuacionPreparacion < 40);
  if (bajos.length >= 2) msgs.push("Tu puntuación de preparación ha sido baja los últimos días. Considera un día de recuperación activa.");
  return msgs;
}

function AnalisisProgreso() {
  const { token } = useAuth();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState(30);

  useEffect(() => {
    fetch(`${API}/checkins/history?dias=${rango}`, { headers: { "x-auth-token": token } })
      .then(r => r.json())
      .then(data => { setCheckins(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, rango]);

  const ordenados  = [...checkins].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const ultimos7   = [...checkins].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 7);
  const scoresProm = promedioArr(checkins.map(c => c.puntuacionPreparacion));
  const estresArr  = checkins.map(c => c.nivelEstres);
  const estresDistrib = {
    bajo:  estresArr.filter(v => v <= 3).length,
    medio: estresArr.filter(v => v > 3 && v <= 6).length,
    alto:  estresArr.filter(v => v > 6).length,
  };
  const racha = (() => {
    let r = 0;
    for (let c of [...checkins].sort((a,b) => b.fecha.localeCompare(a.fecha))) {
      r++;
      break; // simplificado: solo cuenta si hay al menos uno
    }
    return checkins.length;
  })();

  const resumen  = resumenSemana(ultimos7);
  const alertList = alertas([...checkins].sort((a, b) => b.fecha.localeCompare(a.fecha)));

  if (loading) return <div className={styles.loading}>Cargando análisis...</div>;

  if (!checkins.length) {
    return (
      <div className={styles.empty}>
        <p>Aún no tienes datos suficientes.</p>
        <p className={styles.emptyHint}>Completa al menos un check-in diario para ver tu análisis de progreso.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Selector de rango */}
      <div className={styles.rangoRow}>
        {[7, 14, 30].map(d => (
          <button
            key={d}
            className={`${styles.rangoBtn} ${rango === d ? styles.rangoBtnActive : ""}`}
            onClick={() => setRango(d)}
            type="button"
          >
            {d} días
          </button>
        ))}
      </div>

      {/* Alertas automáticas */}
      {alertList.length > 0 && (
        <div className={styles.alertBox}>
          <p className={styles.alertTitle}>⚠ Atención</p>
          {alertList.map((a, i) => <p key={i} className={styles.alertText}>{a}</p>)}
        </div>
      )}

      {/* Stats rápidas */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statVal} style={{ color: scoresProm >= 70 ? "#53fb52" : scoresProm >= 40 ? "#f0b429" : "#e05555" }}>
            {scoresProm}
          </span>
          <span className={styles.statKey}>Bienestar promedio</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statVal} style={{ color: "#53fb52" }}>{checkins.length}</span>
          <span className={styles.statKey}>Check-ins registrados</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statVal} style={{ color: estresDistrib.alto > estresDistrib.bajo ? "#e05555" : "#53fb52" }}>
            {promedioArr(estresArr)}/10
          </span>
          <span className={styles.statKey}>Estrés promedio</span>
        </div>
      </div>

      {/* Gráfico bienestar vs carga */}
      <div className={styles.chartCard}>
        <p className={styles.chartTitle}>Bienestar vs Carga — {rango} días</p>
        <div className={styles.chartLegend}>
          <span className={styles.legendDot} style={{ background: "#53fb52" }} /> Bienestar
          <span className={styles.legendDot} style={{ background: "#f0b429", marginLeft: 14 }} /> Carga (estrés + fatiga)
        </div>
        <div className={styles.lineChart}>
          {ordenados.map((c, i) => {
            const bien   = c.puntuacionPreparacion;
            const carga  = Math.round(((c.nivelEstres + c.fatigaFisica) / 20) * 100);
            const fecha  = c.fecha.slice(5);
            return (
              <div key={c._id || i} className={styles.lineItem}>
                <div className={styles.lineTrack}>
                  <div className={styles.bienBar} style={{ height: `${bien}%` }} title={`Bienestar: ${bien}`} />
                  <div className={styles.cargaBar} style={{ height: `${carga}%` }} title={`Carga: ${carga}`} />
                </div>
                <span className={styles.lineLabel}>{fecha}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribución de estrés */}
      <div className={styles.distribCard}>
        <p className={styles.chartTitle}>Distribución de estrés</p>
        <div className={styles.distribRow}>
          {[
            { label: "Bajo", val: estresDistrib.bajo, color: "#53fb52" },
            { label: "Moderado", val: estresDistrib.medio, color: "#f0b429" },
            { label: "Alto", val: estresDistrib.alto, color: "#e05555" },
          ].map(d => (
            <div key={d.label} className={styles.distribItem}>
              <span className={styles.distribNum} style={{ color: d.color }}>{d.val}</span>
              <span className={styles.distribLabel}>{d.label}</span>
              <div className={styles.distribBar}>
                <div style={{
                  width: checkins.length ? `${(d.val / checkins.length) * 100}%` : "0%",
                  background: d.color,
                  height: "100%",
                  borderRadius: 4,
                  transition: "width 0.4s"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen semanal */}
      {resumen && (
        <div className={styles.resumenCard}>
          <p className={styles.chartTitle}>Resumen de la semana</p>
          <p className={styles.resumenText}>{resumen}</p>
        </div>
      )}
    </div>
  );
}

export default AnalisisProgreso;
