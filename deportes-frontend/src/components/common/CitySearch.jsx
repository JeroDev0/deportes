import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CitySearch.module.css";

const GEONAMES_USER = "jerodev0";
const API = `https://secure.geonames.org/searchJSON`;

export default function CitySearch({ countryCode, value, onChange, placeholder, disabled }) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // sincronizar si el value externo cambia (ej: al cargar el perfil)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback((q, country) => {
    if (!q || q.length < 2 || !country) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const url = `${API}?name_startsWith=${encodeURIComponent(q)}&country=${country}&featureClass=P&maxRows=8&orderby=population&username=${GEONAMES_USER}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const cities = (data.geonames || []).map(g => g.name);
        const unique = [...new Set(cities)];
        setResults(unique);
        setOpen(unique.length > 0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onChange(q);       // actualiza el valor en el padre en tiempo real
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q, countryCode), 320);
  };

  const handleSelect = (city) => {
    setQuery(city);
    onChange(city);
    setResults([]);
    setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={containerRef}>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          value={query}
          onChange={handleChange}
          placeholder={disabled ? "Selecciona primero un país" : (placeholder || "Escribe una ciudad...")}
          disabled={disabled}
          autoComplete="off"
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <span className={styles.spinner} />}
        {query && !loading && (
          <button type="button" className={styles.clearBtn} onClick={handleClear}>✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((city) => (
            <li key={city} className={styles.option} onMouseDown={() => handleSelect(city)}>
              📍 {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
