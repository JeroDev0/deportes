import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./SesionesPanel.module.css";

const API = "https://deportes-production.up.railway.app";

const FORM_INIT = {
  profesionalNombre: "", profesionalEspecialidad: "psicologo_deporte",
  modalidad: "video_call", fechaSolicitada: "", horaInicio: "", horaFin: "",
};

function SesionesPanel() {
  const { token } = useAuth();
  const { t } = useLanguage();

  const ESPECIALIDADES = [
    { id: "psicologo_deporte",         label: t("ses_spec_psy") },
    { id: "coach_recuperacion",        label: t("ses_spec_coach") },
    { id: "nutricionista_rendimiento", label: t("ses_spec_nut") },
  ];

  const ESTADO_STYLE = {
    pendiente:  { color: "#f0b429", bg: "rgba(240,180,41,0.08)", label: t("ses_state_pending") },
    confirmada: { color: "#53fb52", bg: "rgba(83,251,82,0.08)",  label: t("ses_state_confirmed") },
    completada: { color: "#8aaccc", bg: "rgba(138,172,204,0.08)",label: t("ses_state_completed") },
    cancelada:  { color: "#e05555", bg: "rgba(224,85,85,0.08)",  label: t("ses_state_cancelled") },
    rechazada:  { color: "#e05555", bg: "rgba(224,85,85,0.08)",  label: t("ses_state_rejected") },
  };
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_INIT);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [notasAbiertas, setNotasAbiertas] = useState(null);
  const [notas, setNotas] = useState("");
  const [guardandoNotas, setGuardandoNotas] = useState(false);

  const cargar = () => {
    fetch(`${API}/sesiones/my`, { headers: { "x-auth-token": token } })
      .then(r => r.json())
      .then(data => { setSesiones(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, [token]);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const r = await fetch(`${API}/sesiones`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        setShowForm(false);
        setForm(FORM_INIT);
        cargar();
      }
    } finally {
      setGuardando(false);
    }
  };

  const abrirNotas = (sesion) => {
    setNotasAbiertas(sesion._id);
    setNotas(sesion.notasDeportista || "");
  };

  const guardarNotas = async (id) => {
    setGuardandoNotas(true);
    await fetch(`${API}/sesiones/${id}/notas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ notas }),
    });
    setGuardandoNotas(false);
    setNotasAbiertas(null);
    cargar();
  };

  const pendientes = sesiones.filter(s => s.estado === "pendiente" || s.estado === "confirmada");
  const historial  = sesiones.filter(s => s.estado === "completada" || s.estado === "cancelada" || s.estado === "rechazada");

  if (loading) return <div className={styles.loading}>{t("ses_loading")}</div>;

  return (
    <div className={styles.wrapper}>
      {/* Botón nueva sesión */}
      <button className={styles.newBtn} onClick={() => setShowForm(!showForm)} type="button">
        {showForm ? t("ses_cancel_form") : t("ses_new")}
      </button>

      {/* Formulario de solicitud */}
      {showForm && (
        <form onSubmit={handleSolicitar} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t("ses_prof_name")}</label>
              <input
                className={styles.input}
                placeholder={t("ses_prof_name_ph")}
                value={form.profesionalNombre}
                onChange={e => setForm(f => ({ ...f, profesionalNombre: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t("ses_specialty")}</label>
              <select
                className={styles.input}
                value={form.profesionalEspecialidad}
                onChange={e => setForm(f => ({ ...f, profesionalEspecialidad: e.target.value }))}
              >
                {ESPECIALIDADES.map(es => <option key={es.id} value={es.id}>{es.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t("ses_modality")}</label>
              <select
                className={styles.input}
                value={form.modalidad}
                onChange={e => setForm(f => ({ ...f, modalidad: e.target.value }))}
              >
                <option value="video_call">Video-call</option>
                <option value="presencial">{t("ses_presencial")}</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t("ses_date")}</label>
              <input
                className={styles.input}
                type="date"
                value={form.fechaSolicitada}
                onChange={e => setForm(f => ({ ...f, fechaSolicitada: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t("ses_start_time")}</label>
              <input
                className={styles.input}
                type="time"
                value={form.horaInicio}
                onChange={e => setForm(f => ({ ...f, horaInicio: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t("ses_end_time")}</label>
              <input
                className={styles.input}
                type="time"
                value={form.horaFin}
                onChange={e => setForm(f => ({ ...f, horaFin: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={guardando}>
            {guardando ? t("ses_sending") : t("ses_send")}
          </button>
        </form>
      )}

      {/* Próximas sesiones */}
      {pendientes.length > 0 && (
        <div className={styles.seccion}>
          <p className={styles.seccionTitulo}>{t("ses_upcoming")}</p>
          {pendientes.map(s => <SesionCard key={s._id} sesion={s} onNotas={abrirNotas} />)}
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className={styles.seccion}>
          <p className={styles.seccionTitulo}>{t("ses_history")}</p>
          {historial.map(s => (
            <SesionCard key={s._id} sesion={s} onNotas={abrirNotas} />
          ))}
        </div>
      )}

      {sesiones.length === 0 && !showForm && (
        <div className={styles.empty}>
          <p>{t("ses_empty")}</p>
          <p className={styles.emptyHint}>{t("ses_empty_hint")}</p>
        </div>
      )}

      {/* Modal de notas */}
      {notasAbiertas && (
        <div className={styles.notasOverlay} onClick={() => setNotasAbiertas(null)}>
          <div className={styles.notasModal} onClick={e => e.stopPropagation()}>
            <p className={styles.notasTitle}>Notas de sesión</p>
            <textarea
              className={styles.notasTextarea}
              placeholder="Escribe tus observaciones sobre esta sesión..."
              maxLength={1000}
              rows={6}
              value={notas}
              onChange={e => setNotas(e.target.value)}
            />
            <div className={styles.notasActions}>
              <button className={styles.cancelNotasBtn} onClick={() => setNotasAbiertas(null)} type="button">Cancelar</button>
              <button className={styles.saveNotasBtn} onClick={() => guardarNotas(notasAbiertas)} disabled={guardandoNotas} type="button">
                {guardandoNotas ? "Guardando..." : "Guardar notas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SesionCard({ sesion, onNotas }) {
  const est = ESTADO_STYLE[sesion.estado] || ESTADO_STYLE.pendiente;
  const esp = { psicologo_deporte: "Psicólogo", coach_recuperacion: "Coach", nutricionista_rendimiento: "Nutricionista" };
  return (
    <div className={styles.sesionCard}>
      <div className={styles.sesionHeader}>
        <div>
          <p className={styles.sesionNombre}>{sesion.profesionalNombre}</p>
          <p className={styles.sesionEsp}>{esp[sesion.profesionalEspecialidad] || sesion.profesionalEspecialidad}</p>
        </div>
        <span className={styles.estadoBadge} style={{ color: est.color, background: est.bg }}>
          {est.label}
        </span>
      </div>
      <div className={styles.sesionMeta}>
        <span>📅 {sesion.fechaSolicitada}</span>
        {sesion.horaInicio && <span>🕐 {sesion.horaInicio}{sesion.horaFin ? ` — ${sesion.horaFin}` : ""}</span>}
        <span>{sesion.modalidad === "video_call" ? "📹 Video-call" : "📍 Presencial"}</span>
      </div>
      <button className={styles.notasBtn} onClick={() => onNotas(sesion)} type="button">
        {sesion.notasDeportista ? "Ver / editar notas" : "Añadir notas"}
      </button>
    </div>
  );
}

export default SesionesPanel;
