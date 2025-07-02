import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./SidebarProfiles.module.css";

function SidebarProfiles() {
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Simula fetch de amigos y solicitudes
    setFriends([
      { _id: "1", name: "Ana", lastName: "Gómez", photo: "" },
      { _id: "2", name: "Luis", lastName: "Pérez", photo: "" },
    ]);
    setRequests([
      { _id: "3", name: "Carlos", lastName: "Ruiz", photo: "" },
    ]);
    // Sugerencias
    fetch("http://localhost:5000/deportistas")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(
          data
            .filter((p) => p._id !== currentId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
        );
      });
  }, [currentId]);

  return (
    <div className={styles.sidebar}>
      {/* Amigos */}
      <div className={styles.block}>
        <div className={styles.blockHeader} onClick={() => navigate("/amigos")}>
          <span>Amigos</span>
          <span className={styles.link}>Ver todos</span>
        </div>
        <div className={styles.avatarsRow}>
          {friends.map((f) => (
            <img
              key={f._id}
              src={f.photo || "https://placehold.co/32x32?text=?"}
              alt={f.name}
              className={styles.avatarMini}
              title={`${f.name} ${f.lastName}`}
            />
          ))}
        </div>
      </div>
      {/* Solicitudes */}
      <div className={styles.block}>
        <div className={styles.blockHeader} onClick={() => navigate("/solicitudes")}>
          <span>Solicitudes</span>
          <span className={styles.link}>Ver</span>
        </div>
        <div className={styles.avatarsRow}>
          {requests.length === 0 && <span className={styles.empty}>Sin solicitudes</span>}
          {requests.map((r) => (
            <img
              key={r._id}
              src={r.photo || "https://placehold.co/32x32?text=?"}
              alt={r.name}
              className={styles.avatarMini}
              title={`${r.name} ${r.lastName}`}
            />
          ))}
        </div>
      </div>
      {/* Sugerencias */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <span>Personas que podrías conocer</span>
        </div>
        <ul className={styles.suggestionsList}>
          {profiles.map((p) => (
            <li key={p._id} className={styles.suggestionItem}>
              <img
                src={p.photo || "https://placehold.co/40x40?text=?"}
                alt={p.name}
                className={styles.avatar}
              />
              <div className={styles.info}>
                <div className={styles.name}>{p.name} {p.lastName}</div>
                <div className={styles.sport}>
                  {p.sport} {p.city ? `- ${p.city}` : ""}
                </div>
              </div>
              <button
                className={styles.addBtn}
                title="Agregar amigo"
              >
                +
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SidebarProfiles;