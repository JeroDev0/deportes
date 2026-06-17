import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth.js";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./RecursosLibrary.module.css";

const API = "https://deportes-production.up.railway.app";
const INTENSIDAD_COLOR = { bajo: "#53fb52", medio: "#f0b429", alto: "#e05555" };

function RecursosLibrary() {
  const { token } = useAuth();
  const { t } = useLanguage();

  const CATEGORIAS = [
    { id: "",                   label: t("rec_cat_all") },
    { id: "respiracion_foco",   label: t("rec_cat_breath") },
    { id: "optimizacion_sueno", label: t("rec_cat_sleep") },
    { id: "fortaleza_mental",   label: t("rec_cat_mental") },
    { id: "recuperacion",       label: t("rec_cat_recovery") },
  ];

  const TIPO_LABEL = {
    articulo: t("rec_type_article"),
    video: t("rec_type_video"),
    ejercicio: t("rec_type_exercise"),
  };
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

  if (loading) return <div className={styles.loading}>{t("rec_loading")}</div>;

  return (
    <div className={styles.wrapper}>
      {/* Buscador */}
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder={t("rec_search_ph")}
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
          <p>{t("rec_empty")}</p>
          <p className={styles.emptyHint}>{t("rec_empty_hint")}</p>
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
