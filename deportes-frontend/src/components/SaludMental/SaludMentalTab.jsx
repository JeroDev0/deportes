import React, { useState } from "react";
import styles from "./SaludMentalTab.module.css";
import BienestarDashboard from "./BienestarDashboard";
import DailyCheckIn from "./DailyCheckIn";
import RecursosLibrary from "./RecursosLibrary";
import SesionesPanel from "./SesionesPanel";
import AnalisisProgreso from "./AnalisisProgreso";

const SECCIONES = [
  { id: "dashboard", label: "Bienestar" },
  { id: "checkin",   label: "Check-in" },
  { id: "recursos",  label: "Recursos" },
  { id: "sesiones",  label: "Sesiones" },
  { id: "analisis",  label: "Análisis" },
];

function SaludMentalTab({ profile }) {
  const [seccion, setSeccion] = useState("dashboard");

  return (
    <div className={styles.wrapper}>
      {/* Cabecera del módulo */}
      <div className={styles.moduleHeader}>
        <div className={styles.moduleTitle}>
          <span className={styles.moduleIcon}>◎</span>
          <h2>Salud Mental</h2>
        </div>
        <p className={styles.moduleSubtitle}>
          Herramientas de bienestar y rendimiento mental — solo visible para ti
        </p>
      </div>

      {/* Navegación interna */}
      <nav className={styles.nav}>
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            className={`${styles.navBtn} ${seccion === s.id ? styles.navBtnActive : ""}`}
            onClick={() => setSeccion(s.id)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Contenido de la sección activa */}
      <div className={styles.content}>
        {seccion === "dashboard" && <BienestarDashboard profile={profile} onGoCheckIn={() => setSeccion("checkin")} />}
        {seccion === "checkin"   && <DailyCheckIn profile={profile} onSaved={() => setSeccion("dashboard")} />}
        {seccion === "recursos"  && <RecursosLibrary />}
        {seccion === "sesiones"  && <SesionesPanel profile={profile} />}
        {seccion === "analisis"  && <AnalisisProgreso profile={profile} />}
      </div>
    </div>
  );
}

export default SaludMentalTab;
