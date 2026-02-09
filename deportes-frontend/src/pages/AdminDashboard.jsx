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

  useEffect(() => {
    // Seguridad: Si no es admin, redirigir al inicio
    if (!user || user.modelType !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [user, token, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://deportes-production.up.railway.app/admin/users", {
        headers: {
          "x-auth-token": token,
        },
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
    if (window.confirm("¿Estás seguro de eliminar este perfil? Esta acción es permanente.")) {
      try {
        const response = await fetch(`https://deportes-production.up.railway.app/admin/users/${modelType}/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token },
        });
        if (response.ok) {
          setUsers(users.filter((u) => u._id !== id));
          alert("Usuario eliminado correctamente");
        }
      } catch (error) {
        alert("Error al intentar eliminar el usuario");
      }
    }
  };

  const filteredUsers = filter === "all" 
    ? users 
    : users.filter(u => u.modelType === filter);

  if (loading) return <div className={styles.loader}>Cargando Panel de Control...</div>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Panel de Administración (Super Admin)</h1>
        <div className={styles.stats}>
          Total Usuarios: {users.length}
        </div>
      </header>

      <div className={styles.controls}>
        <label>Filtrar por tipo:</label>
        <select onChange={(e) => setFilter(e.target.value)} className={styles.select}>
          <option value="all">Todos</option>
          <option value="deportista">Deportistas</option>
          <option value="scout">Scouts</option>
          <option value="sponsor">Sponsors</option>
          <option value="club">Clubs</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Tipo</th>
            <th>Email (Privado)</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name || "Sin nombre"} {u.lastName || ""}</td>
              <td><span className={styles.badge}>{u.modelType}</span></td>
              <td>{u.email}</td>
              <td>{u.phone || "No registrado"}</td>
              <td>{u.address || "No registrada"}</td>
              <td className={styles.actions}>
                <button 
                  className={styles.editBtn}
                  onClick={() => navigate(`/profile/${u._id}/edit`)}
                >
                  Editar
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(u._id, u.modelType)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;