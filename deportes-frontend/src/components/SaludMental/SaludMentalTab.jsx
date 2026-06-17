import React, { useState } from "react";
import styles from "./SaludMentalTab.module.css";
import { useLanguage } from "../../context/LanguageContext";
import BienestarDashboard from "./BienestarDashboard";
import DailyCheckIn from "./DailyCheckIn";
import RecursosLibrary from "./RecursosLibrary";
import SesionesPanel from "./SesionesPanel";
import AnalisisProgreso from "./AnalisisProgreso";

function SaludMentalTab({ profile }) {
  const { t } = useLanguage();
  const [seccion, setSeccion] = useState("dashboard");

  const SECCIONES = [
    { id: "dashboard", label: t("bien_tab_dashboard") },
    { id: "checkin",   label: t("bien_tab_checkin") },
    { id: "recursos",  label: t("bien_tab_recursos") },
    { id: "sesiones",  label: t("bien_tab_sesiones") },
    { id: "analisis",  label: t("bien_tab_analisis") },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Cabecera del módulo */}
      <div className={styles.moduleHeader}>
        <div className={styles.moduleTitle}>
          <span className={styles.moduleIcon}>◎</span>
          <h2>{t("tab_wellbeing")}</h2>
        </div>
        <p className={styles.moduleSubtitle}>{t("bien_subtitle")}</p>
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
