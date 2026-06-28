import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { apiFetch } from "../../config/fetchWithAuth";
import styles from "./RightProfileColumn.module.css";

const SPORT_ES = {
  "Soccer": "Fútbol", "Basketball": "Baloncesto", "Tennis": "Tenis",
  "Volleyball": "Voleibol", "Swimming": "Natación", "Athletics": "Atletismo",
  "Cycling": "Ciclismo", "Boxing": "Boxeo", "Chess": "Ajedrez", "Golf": "Golf",
  "Baseball": "Béisbol", "Rugby": "Rugby", "Hockey": "Hockey",
  "Handball": "Balonmano", "Futsal": "Fútbol Sala", "Padel": "Pádel",
  "Gymnastics": "Gimnasia", "Karate": "Kárate", "Judo": "Judo",
  "Taekwondo": "Taekwondo", "Fencing": "Esgrima", "Weightlifting": "Halterofilia",
  "Triathlon": "Triatlón", "Olympic Wrestling": "Lucha Olímpica",
  "Skating": "Patinaje", "Archery": "Tiro con Arco", "Pickleball": "Pickleball",
};

function getAvatar(gender) {
  const isFemale = gender === "femenino" || gender === "female";
  return isFemale ? "/assets/avatar-female.svg" : "/assets/avatar-male.svg";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function RightProfileColumn({ profile }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState([]);

  useEffect(() => {
    Promise.all([
      apiFetch("/deportistas").then(r => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/scouts").then(r => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/sponsors").then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([athletes, scouts, sponsors]) => {
      const currentId = profile?._id;
      const merged = [
        ...athletes.map(p => ({ ...p, _type: "athlete", _route: `/profile/${p._id}` })),
        ...scouts.map(p => ({ ...p, _type: "scout", _route: `/scout-profile/${p._id}` })),
        ...sponsors.map(p => ({ ...p, _type: "sponsor", _route: `/sponsor-profile/${p._id}` })),
      ].filter(p => p._id !== currentId && (p.name || p.company));
      setAllProfiles(merged);
      setSuggestions(shuffle(merged).slice(0, 6));
      setLoading(false);
    });
  }, [profile?._id]);

  const refresh = useCallback(() => {
    setSuggestions(shuffle(allProfiles).slice(0, 6));
  }, [allProfiles]);

  const getLabel = (p) => {
    if (p._type === "scout") return p.specialization || "Scout";
    if (p._type === "sponsor") return p.industry || "Sponsor";
    return SPORT_ES[p.sport] || p.sport || "";
  };

  const getName = (p) =>
    p._type === "sponsor"
      ? (p.company || p.name || "")
      : `${p.name || ""} ${p.lastName || ""}`.trim();

  const labels = {
    es: { title: "Descubre más perfiles", refresh: "Ver otros", athletes: "Deportistas", scouts: "Scouts", sponsors: "Patrocinadores" },
    en: { title: "Discover more profiles", refresh: "See others", athletes: "Athletes", scouts: "Scouts", sponsors: "Sponsors" },
    de: { title: "Mehr Profile entdecken", refresh: "Andere sehen", athletes: "Athleten", scouts: "Scouts", sponsors: "Sponsoren" },
  };
  const l = labels[lang] || labels.es;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{l.title}</h3>
        {!loading && allProfiles.length > 6 && (
          <button className={styles.refreshBtn} onClick={refresh} type="button">
            {l.refresh} ↻
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>
          <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
        </div>
      ) : suggestions.length === 0 ? null : (
        <ul className={styles.list}>
          {suggestions.map((p) => (
            <li
              key={p._id}
              className={styles.item}
              onClick={() => navigate(p._route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(p._route)}
            >
              <div className={styles.avatarWrap}>
                <img
                  src={p.photo || p.logo || getAvatar(p.gender)}
                  alt={getName(p)}
                  className={styles.avatar}
                />
                <span className={`${styles.typeDot} ${styles[p._type]}`} />
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{getName(p)}</span>
                <span className={styles.sub}>
                  {getLabel(p)}{p.city ? ` · ${p.city}` : ""}
                </span>
              </div>
              <span className={styles.arrow}>›</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RightProfileColumn;
