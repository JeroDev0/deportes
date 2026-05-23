import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import styles from "./SesionesPanel.module.css";

const API = "https://deportes-production.up.railway.app";

const ESPECIALIDADES = [
  { id: "psicologo_deporte",       label: "Psicólogo del Deporte" },
  { id: "coach_recuperacion",      label: "Coach de Recuperación" },
  { id: "nutricionista_rendimiento", label: "Nutricionista del Rendimiento" },
];

const ESTADO_STYLE = {
  pendiente:   { color: "#f0b429", bg: "rgba(240,180,41,0.08)", label: "Pendiente" },
  confirmada:  { color: "#53fb52", bg: "rgba(83,251,82,0.08)",  label: "Confirmada" },
  completada:  { color: "#8aaccc", bg: "rgba(138,172,204,0.08)", label: "Completada" },
  cancelada:   { color: "#e05555", bg: "rgba(224,85,85,0.08)",  label: "Cancelada" },
  rechazada:   { color: "#e05555", bg: "rgba(224,85,85,0.08)",  label: "Rechazada" },
};

const FORM_INIT = {
  profesionalNombre: "", profesionalEspecialidad: "psicologo_deporte",
  modalidad: "video_call", fechaSolicitada: "", horaInicio: "", horaFin: "",
};

function SesionesPanel() {
  const { token } = useAuth();
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

  if (loading) return <div className={styles.loading}>Cargando sesiones...</div>;

  return (
    <div className={styles.wrapper}>
      {/* Botón nueva sesión */}
      <button className={styles.newBtn} onClick={() => setShowForm(!showForm)} type="button">
        {showForm ? "Cancelar" : "+ Solicitar sesión"}
      </button>

      {/* Formulario de solicitud */}
      {showForm && (
        <form onSubmit={handleSolicitar} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Nombre del profesional</label>
              <input
                className={styles.input}
                placeholder="Ej: Dra. García"
                value={form.profesionalNombre}
                onChange={e => setForm(f => ({ ...f, profesionalNombre: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Especialidad</label>
              <select
                className={styles.input}
                value={form.profesionalEspecialidad}
                onChange={e => setForm(f => ({ ...f, profesionalEspecialidad: e.target.value }))}
              >
                {ESPECIALIDADES.map(es => <option key={es.id} value={es.id}>{es.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Modalidad</label>
              <select
                className={styles.input}
                value={form.modalidad}
                onChange={e => setForm(f => ({ ...f, modalidad: e.target.value }))}
              >
                <option value="video_call">Video-call</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Fecha solicitada</label>
              <input
                className={styles.input}
                type="date"
                value={form.fechaSolicitada}
                onChange={e => setForm(f => ({ ...f, fechaSolicitada: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Hora inicio</label>
              <input
                className={styles.input}
                type="time"
                value={form.horaInicio}
                onChange={e => setForm(f => ({ ...f, horaInicio: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Hora fin</label>
              <input
                className={styles.input}
                type="time"
                value={form.horaFin}
                onChange={e => setForm(f => ({ ...f, horaFin: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={guardando}>
            {guardando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      )}

      {/* Próximas sesiones */}
      {pendientes.length > 0 && (
        <div className={styles.seccion}>
          <p className={styles.seccionTitulo}>Próximas sesiones</p>
          {pendientes.map(s => <SesionCard key={s._id} sesion={s} onNotas={abrirNotas} />)}
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className={styles.seccion}>
          <p className={styles.seccionTitulo}>Historial</p>
          {historial.map(s => (
            <SesionCard key={s._id} sesion={s} onNotas={abrirNotas} />
          ))}
        </div>
      )}

      {sesiones.length === 0 && !showForm && (
        <div className={styles.empty}>
          <p>No tienes sesiones registradas aún.</p>
          <p className={styles.emptyHint}>Solicita tu primera sesión con un profesional del bienestar.</p>
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
