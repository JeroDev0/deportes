import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.modelType !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [user, token, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://deportes-production.up.railway.app/admin/users", {
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, modelType) => {
    if (window.confirm("¿ESTÁS SEGURO? Esta acción eliminará permanentemente el perfil y todos sus datos.")) {
      try {
        const response = await fetch(`https://deportes-production.up.railway.app/admin/users/${modelType}/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token },
        });
        if (response.ok) {
          setUsers(users.filter((u) => u._id !== id));
        }
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  // Lógica de navegación inteligente
  const handleViewProfile = (u) => {
    const routes = {
      deportista: `/profile/${u._id}`,
      scout: `/scout-profile/${u._id}`,
      sponsor: `/sponsor-profile/${u._id}`,
      club: `/club-profile/${u._id}`
    };
    navigate(routes[u.modelType] || "/");
  };

  const handleEditProfile = (u) => {
    const routes = {
      deportista: `/profile/${u._id}/edit`,
      scout: `/scout-profile/${u._id}/edit`,
      sponsor: `/sponsor-profile/${u._id}/edit`,
      club: `/club-profile/${u._id}/edit`
    };
    navigate(routes[u.modelType] || "/");
  };

  // Filtrado y Búsqueda combinada
  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === "all" || u.modelType === filter;
    const fullName = `${u.name} ${u.lastName} ${u.email}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className={styles.loader}>Cargando Sistema de Control...</div>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Control Center</h1>
          <p>Super Admin Mode</p>
        </div>
        <div className={styles.statsCard}>
          <span className={styles.statNumber}>{users.length}</span>
          <span className={styles.statLabel}>Usuarios Registrados</span>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterBox}>
          <select onChange={(e) => setFilter(e.target.value)} className={styles.select}>
            <option value="all">Todos los Perfiles</option>
            <option value="deportista">Deportistas</option>
            <option value="scout">Scouts</option>
            <option value="sponsor">Sponsors</option>
            <option value="club">Clubs</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Contacto Privado</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className={styles.userRow}>
                <td className={styles.userInfo}>
                  <div className={styles.userName} onClick={() => handleViewProfile(u)}>
                    {u.name || "N/A"} {u.lastName || ""}
                  </div>
                  <div className={styles.userEmail}>{u.email}</div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[u.modelType]}`}>
                    {u.modelType}
                  </span>
                </td>
                <td className={styles.privateData}>
                  <div>📞 {u.phone || "Sin teléfono"}</div>
                </td>
                <td className={styles.locationData}>
                  {u.city || "N/A"}, {u.country || "N/A"}
                </td>
                <td className={styles.actions}>
                  <button className={styles.viewBtn} onClick={() => handleViewProfile(u)}>Ver</button>
                  <button className={styles.editBtn} onClick={() => handleEditProfile(u)}>Editar</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(u._id, u.modelType)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;