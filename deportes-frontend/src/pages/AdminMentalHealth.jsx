import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import styles from "./AdminMentalHealth.module.css";

const API = "https://deportes-production.up.railway.app";

const ESTADO_STYLE = {
  pendiente: { color: "#f0b429", label: "Pendiente" },
  confirmada: { color: "#53fb52", label: "Confirmada" },
  completada: { color: "#8aaccc", label: "Completada" },
  cancelada: { color: "#e05555", label: "Cancelada" },
  rechazada: { color: "#e05555", label: "Rechazada" },
};

function scoreColor(s) {
  if (s === null || s === undefined) return "#4a6a8a";
  if (s >= 70) return "#53fb52";
  if (s >= 40) return "#f0b429";
  return "#e05555";
}

function AdminMentalHealth() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Form nuevo recurso
  const [showRecursoForm, setShowRecursoForm] = useState(false);
  const [recursoForm, setRecursoForm] = useState({
    titulo: "", categoria: "respiracion_foco", descripcionBreve: "",
    contenido: "", tipo: "articulo", tiempoEstimado: "", intensidad: "bajo",
  });
  const [guardandoRecurso, setGuardandoRecurso] = useState(false);

  useEffect(() => {
    if (!user || user.modelType !== "admin") { navigate("/"); return; }
    cargarTodo();
  }, [user, token]);

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const headers = { "x-auth-token": token };
      const [s, c, ses, rec] = await Promise.all([
        fetch(`${API}/admin/salud-mental/stats`, { headers }).then(r => r.json()),
        fetch(`${API}/admin/salud-mental/checkins`, { headers }).then(r => r.json()),
        fetch(`${API}/admin/salud-mental/sesiones`, { headers }).then(r => r.json()),
        fetch(`${API}/admin/salud-mental/recursos`, { headers }).then(r => r.json()),
      ]);
      setStats(s);
      setCheckins(Array.isArray(c) ? c : []);
      setSesiones(Array.isArray(ses) ? ses : []);
      setRecursos(Array.isArray(rec) ? rec : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const cambiarEstadoSesion = async (id, estado) => {
    await fetch(`${API}/sesiones/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ estado }),
    });
    cargarTodo();
  };

  const guardarRecurso = async (e) => {
    e.preventDefault();
    setGuardandoRecurso(true);
    await fetch(`${API}/recursos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(recursoForm),
    });
    setGuardandoRecurso(false);
    setShowRecursoForm(false);
    setRecursoForm({ titulo: "", categoria: "respiracion_foco", descripcionBreve: "", contenido: "", tipo: "articulo", tiempoEstimado: "", intensidad: "bajo" });
    cargarTodo();
  };

  const eliminarRecurso = async (id) => {
    if (!window.confirm("¿Desactivar este recurso?")) return;
    await fetch(`${API}/recursos/${id}`, { method: "DELETE", headers: { "x-auth-token": token } });
    cargarTodo();
  };

  // Agrupar últimos check-ins por deportista (el más reciente de cada uno)
  const resumenDeportistas = (() => {
    const map = {};
    checkins.forEach(c => {
      const id = c.deportistaId?._id;
      if (!id) return;
      if (!map[id] || c.fecha > map[id].fecha) map[id] = c;
    });
    return Object.values(map);
  })();

  const filtrados = resumenDeportistas.filter(c => {
    const nombre = `${c.deportistaId?.name || ""} ${c.deportistaId?.lastName || ""}`.toLowerCase();
    return nombre.includes(busqueda.toLowerCase());
  });

  if (loading) return <div className={styles.loader}>Cargando datos de salud mental...</div>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Salud Mental <span className={styles.titleAccent}>— Panel Admin</span></h1>
          <p className={styles.subtitle}>Datos privados · Solo visible para administradores</p>
        </div>
        <button className={styles.backBtn} onClick={() => navigate("/admin-panel")} type="button">
          ← Volver al panel
        </button>
      </header>

      {/* Tabs */}
      <div className={styles.tabRow}>
        {[
          { id: "overview", label: "Resumen Global" },
          { id: "deportistas", label: "Deportistas" },
          { id: "sesiones", label: "Sesiones" },
          { id: "recursos", label: "Gestión de Recursos" },
        ].map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ""}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RESUMEN GLOBAL ── */}
      {tab === "overview" && stats && (
        <div className={styles.overviewGrid}>
          <StatCard label="Deportistas totales" val={stats.totalDeportistas} color="#c0d4e8" />
          <StatCard label="Activos últimos 7 días" val={stats.activosUltimos7Dias} color="#53fb52" />
          <StatCard label="Tasa de uso (7d)" val={`${stats.tasaUso7d}%`} color="#53fb52" />
          <StatCard label="Bienestar promedio" val={stats.promedioGlobal ?? "—"} color={scoreColor(stats.promedioGlobal)} />
          <StatCard label="Estrés promedio /10" val={stats.promedioEstres ?? "—"} color={stats.promedioEstres >= 7 ? "#e05555" : "#f0b429"} />
          <StatCard label="Sueño promedio /10" val={stats.promedioSueno ?? "—"} color={stats.promedioSueno >= 7 ? "#53fb52" : "#f0b429"} />
          <StatCard label="Alertas sin check-in (3d)" val={stats.alertasSinCheckin} color={stats.alertasSinCheckin > 0 ? "#e05555" : "#53fb52"} />
          <StatCard label="Alertas puntaje bajo" val={stats.alertasPuntajeBajo} color={stats.alertasPuntajeBajo > 0 ? "#e05555" : "#53fb52"} />

          <div className={styles.distribCard}>
            <p className={styles.distribTitle}>Distribución de estrés (últimos 7 días)</p>
            <div className={styles.distribRow}>
              {[
                { label: "Bajo", val: stats.distribucionEstres.bajo, color: "#53fb52" },
                { label: "Medio", val: stats.distribucionEstres.medio, color: "#f0b429" },
                { label: "Alto", val: stats.distribucionEstres.alto, color: "#e05555" },
              ].map(d => (
                <div key={d.label} className={styles.distribItem}>
                  <span className={styles.distribNum} style={{ color: d.color }}>{d.val}</span>
                  <span className={styles.distribLabel}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DEPORTISTAS ── */}
      {tab === "deportistas" && (
        <div className={styles.section}>
          <div className={styles.toolbar}>
            <input
              className={styles.search}
              placeholder="Buscar deportista..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Deportista</th>
                  <th>Deporte</th>
                  <th>Último check-in</th>
                  <th>Score</th>
                  <th>Estrés</th>
                  <th>Sueño</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => {
                  const d = c.deportistaId;
                  const sc = c.puntuacionPreparacion;
                  const sinCheckinReciente = (() => {
                    const f = new Date(c.fecha);
                    const hoy = new Date();
                    return (hoy - f) / 86400000 > 3;
                  })();
                  return (
                    <tr key={c._id} className={styles.tr}>
                      <td className={styles.tdAthlete}>
                        {d?.photo && <img src={d.photo} alt="" className={styles.avatar} />}
                        <div>
                          <div className={styles.athleteName}>{d?.name} {d?.lastName}</div>
                        </div>
                      </td>
                      <td className={styles.td}>{d?.sport || "—"}</td>
                      <td className={styles.td}>{c.fecha}</td>
                      <td className={styles.td}>
                        <span style={{ color: scoreColor(sc), fontWeight: 800 }}>{sc}</span>
                      </td>
                      <td className={styles.td}>
                        <span style={{ color: c.nivelEstres >= 7 ? "#e05555" : c.nivelEstres >= 5 ? "#f0b429" : "#53fb52", fontWeight: 700 }}>
                          {c.nivelEstres}/10
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span style={{ color: c.calidadSueno >= 7 ? "#53fb52" : c.calidadSueno >= 5 ? "#f0b429" : "#e05555", fontWeight: 700 }}>
                          {c.calidadSueno}/10
                        </span>
                      </td>
                      <td className={styles.td}>
                        {sinCheckinReciente
                          ? <span className={styles.alertBadge}>Sin check-in</span>
                          : sc < 40
                          ? <span className={styles.alertBadge} style={{ background: "rgba(224,85,85,0.1)", color: "#e05555", borderColor: "rgba(224,85,85,0.3)" }}>Score bajo</span>
                          : <span className={styles.okBadge}>OK</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtrados.length === 0 && <p className={styles.emptyMsg}>No hay datos de check-ins aún.</p>}
          </div>
        </div>
      )}

      {/* ── SESIONES ── */}
      {tab === "sesiones" && (
        <div className={styles.section}>
          <div className={styles.sesionesGrid}>
            {sesiones.map(s => {
              const est = ESTADO_STYLE[s.estado] || ESTADO_STYLE.pendiente;
              return (
                <div key={s._id} className={styles.sesionCard}>
                  <div className={styles.sesionTop}>
                    <div>
                      <p className={styles.sesionAthlete}>{s.deportistaId?.name} {s.deportistaId?.lastName}</p>
                      <p className={styles.sesionSport}>{s.deportistaId?.sport}</p>
                    </div>
                    <span className={styles.sesionEstado} style={{ color: est.color }}>{est.label}</span>
                  </div>
                  <p className={styles.sesionPro}>{s.profesionalNombre}</p>
                  <p className={styles.sesionFecha}>📅 {s.fechaSolicitada} {s.horaInicio && `· ${s.horaInicio}`}</p>
                  {s.estado === "pendiente" && (
                    <div className={styles.sesionActions}>
                      <button className={styles.confirmarBtn} onClick={() => cambiarEstadoSesion(s._id, "confirmada")} type="button">Confirmar</button>
                      <button className={styles.rechazarBtn} onClick={() => cambiarEstadoSesion(s._id, "rechazada")} type="button">Rechazar</button>
                    </div>
                  )}
                  {s.estado === "confirmada" && (
                    <button className={styles.completarBtn} onClick={() => cambiarEstadoSesion(s._id, "completada")} type="button">Marcar completada</button>
                  )}
                </div>
              );
            })}
            {sesiones.length === 0 && <p className={styles.emptyMsg}>No hay sesiones registradas.</p>}
          </div>
        </div>
      )}

      {/* ── RECURSOS ── */}
      {tab === "recursos" && (
        <div className={styles.section}>
          <button className={styles.newRecursoBtn} onClick={() => setShowRecursoForm(!showRecursoForm)} type="button">
            {showRecursoForm ? "Cancelar" : "+ Nuevo recurso"}
          </button>

          {showRecursoForm && (
            <form onSubmit={guardarRecurso} className={styles.recursoForm}>
              <div className={styles.recursoGrid}>
                <div className={styles.rField}>
                  <label className={styles.rLabel}>Título</label>
                  <input className={styles.rInput} value={recursoForm.titulo} onChange={e => setRecursoForm(f => ({ ...f, titulo: e.target.value }))} required />
                </div>
                <div className={styles.rField}>
                  <label className={styles.rLabel}>Categoría</label>
                  <select className={styles.rInput} value={recursoForm.categoria} onChange={e => setRecursoForm(f => ({ ...f, categoria: e.target.value }))}>
                    <option value="respiracion_foco">Respiración y Foco</option>
                    <option value="optimizacion_sueno">Optimización del Sueño</option>
                    <option value="fortaleza_mental">Fortaleza Mental</option>
                    <option value="recuperacion">Recuperación</option>
                  </select>
                </div>
                <div className={styles.rField}>
                  <label className={styles.rLabel}>Tipo</label>
                  <select className={styles.rInput} value={recursoForm.tipo} onChange={e => setRecursoForm(f => ({ ...f, tipo: e.target.value }))}>
                    <option value="articulo">Artículo</option>
                    <option value="video">Video</option>
                    <option value="ejercicio">Ejercicio</option>
                  </select>
                </div>
                <div className={styles.rField}>
                  <label className={styles.rLabel}>Intensidad</label>
                  <select className={styles.rInput} value={recursoForm.intensidad} onChange={e => setRecursoForm(f => ({ ...f, intensidad: e.target.value }))}>
                    <option value="bajo">Bajo</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                  </select>
                </div>
                <div className={styles.rField}>
                  <label className={styles.rLabel}>Tiempo estimado</label>
                  <input className={styles.rInput} placeholder="Ej: 5 Min" value={recursoForm.tiempoEstimado} onChange={e => setRecursoForm(f => ({ ...f, tiempoEstimado: e.target.value }))} />
                </div>
              </div>
              <div className={styles.rField}>
                <label className={styles.rLabel}>Descripción breve</label>
                <input className={styles.rInput} maxLength={300} value={recursoForm.descripcionBreve} onChange={e => setRecursoForm(f => ({ ...f, descripcionBreve: e.target.value }))} required />
              </div>
              <div className={styles.rField}>
                <label className={styles.rLabel}>Contenido completo</label>
                <textarea className={styles.rTextarea} rows={6} value={recursoForm.contenido} onChange={e => setRecursoForm(f => ({ ...f, contenido: e.target.value }))} required />
              </div>
              <button type="submit" className={styles.guardarRecursoBtn} disabled={guardandoRecurso}>
                {guardandoRecurso ? "Guardando..." : "Publicar recurso"}
              </button>
            </form>
          )}

          <div className={styles.recursosAdminList}>
            {recursos.map(r => (
              <div key={r._id} className={styles.recursoAdminCard}>
                <div className={styles.recursoAdminInfo}>
                  <p className={styles.recursoAdminTitulo}>{r.titulo}</p>
                  <p className={styles.recursoAdminMeta}>{r.categoria} · {r.tipo} · {r.intensidad}</p>
                </div>
                <div className={styles.recursoAdminActions}>
                  <span className={r.activo ? styles.activoBadge : styles.inactivoBadge}>
                    {r.activo ? "Activo" : "Inactivo"}
                  </span>
                  <button className={styles.deleteRecursoBtn} onClick={() => eliminarRecurso(r._id)} type="button">
                    Desactivar
                  </button>
                </div>
              </div>
            ))}
            {recursos.length === 0 && <p className={styles.emptyMsg}>No hay recursos creados aún.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, val, color }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statVal} style={{ color }}>{val}</span>
      <span className={styles.statKey}>{label}</span>
    </div>
  );
}

export default AdminMentalHealth;
