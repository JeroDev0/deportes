import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import styles from "./RecursosLibrary.module.css";

const API = "https://deportes-production.up.railway.app";

const CATEGORIAS = [
  { id: "",                   label: "Todos" },
  { id: "respiracion_foco",   label: "Respiración y Foco" },
  { id: "optimizacion_sueno", label: "Sueño" },
  { id: "fortaleza_mental",   label: "Fortaleza Mental" },
  { id: "recuperacion",       label: "Recuperación" },
];

const TIPO_LABEL = { articulo: "Artículo", video: "Video", ejercicio: "Ejercicio" };
const INTENSIDAD_COLOR = { bajo: "#53fb52", medio: "#f0b429", alto: "#e05555" };

function RecursosLibrary() {
  const { token } = useAuth();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    const url = categoria
      ? `${API}/recursos?categoria=${categoria}`
      : `${API}/recursos`;
    fetch(url, { headers: { "x-auth-token": token } })
      .then(r => r.json())
      .then(data => { setRecursos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, categoria]);

  const filtrados = recursos.filter(r =>
    r.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.descripcionBreve?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div className={styles.loading}>Cargando recursos...</div>;

  return (
    <div className={styles.wrapper}>
      {/* Buscador */}
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Buscar artículos, ejercicios o videos..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros de categoría */}
      <div className={styles.catRow}>
        {CATEGORIAS.map(c => (
          <button
            key={c.id}
            className={`${styles.catBtn} ${categoria === c.id ? styles.catBtnActive : ""}`}
            onClick={() => setCategoria(c.id)}
            type="button"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Listado */}
      {filtrados.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay recursos disponibles en esta categoría todavía.</p>
          <p className={styles.emptyHint}>El equipo de ibkme está preparando contenido para ti.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtrados.map(r => (
            <div key={r._id} className={styles.card}>
              {/* Tags */}
              <div className={styles.cardTags}>
                <span
                  className={styles.catTag}
                  style={{ color: INTENSIDAD_COLOR[r.intensidad] || "#53fb52" }}
                >
                  {CATEGORIAS.find(c => c.id === r.categoria)?.label || r.categoria}
                </span>
                <span className={styles.tipoTag}>{TIPO_LABEL[r.tipo] || r.tipo}</span>
              </div>

              {/* Título */}
              <h3 className={styles.cardTitle}>{r.titulo}</h3>

              {/* Descripción breve */}
              <p className={styles.cardDesc}>{r.descripcionBreve}</p>

              {/* Meta */}
              <div className={styles.cardMeta}>
                {r.tiempoEstimado && <span>⏱ {r.tiempoEstimado}</span>}
                <span
                  className={styles.intensidadBadge}
                  style={{ color: INTENSIDAD_COLOR[r.intensidad] }}
                >
                  Intensidad: {r.intensidad}
                </span>
              </div>

              {/* Expandir contenido */}
              <button
                className={styles.expandBtn}
                onClick={() => setExpandido(expandido === r._id ? null : r._id)}
                type="button"
              >
                {expandido === r._id ? "Cerrar" : "Leer más"}
              </button>

              {expandido === r._id && (
                <div className={styles.contenido}>
                  <p>{r.contenido}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecursosLibrary;
