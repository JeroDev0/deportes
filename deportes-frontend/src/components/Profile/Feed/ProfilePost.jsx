import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProfileFeed.module.css";

function ProfilePost({ post, onLike, onDelete, onEdit, isMyProfile, userId }) {
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [userInfo, setUserInfo] = useState(null);

  // Obtener información del usuario que hizo la publicación
  useEffect(() => {
    if (post.user) {
      fetch(`https://deportes-production.up.railway.app/deportistas/${post.user}`)
        .then(res => res.json())
        .then(data => setUserInfo(data))
        .catch(err => console.error("Error obteniendo info del usuario:", err));
    }
  }, [post.user]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`https://deportes-production.up.railway.app/publicaciones/${post._id}/like`, {
        userId: userId
      });
      onLike(post._id, res.data.likes);
      setLiked(!liked);
    } catch (err) {
      alert("Error al dar like");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;
    onDelete(post._id);
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      alert("El texto no puede estar vacío");
      return;
    }
    try {
      const res = await axios.put(`https://deportes-production.up.railway.app/publicaciones/${post._id}`, {
        text: editText,
        mediaUrl: post.mediaUrl,
        type: post.type
      });
      onEdit(res.data);
      setEditing(false);
    } catch (err) {
      alert("Error al editar publicación");
    }
  };

  const cancelEdit = () => {
    setEditText(post.text);
    setEditing(false);
  };

  return (
    <div className={styles.postCard}>
      {/* Header con información del usuario */}
      <div className={styles.postHeader}>
        <div className={styles.postUserInfo}>
          <img
            src={userInfo?.photo || "https://placehold.co/40x40?text=?"}
            alt={userInfo ? `${userInfo.name} ${userInfo.lastName}` : "Usuario"}
            className={styles.postUserAvatar}
          />
          <div className={styles.postUserDetails}>
            <h4>{userInfo ? `${userInfo.name} ${userInfo.lastName}` : "Cargando..."}</h4>
            <div className={styles.postDate}>
              {new Date(post.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      
        {isMyProfile && (
          <div className={styles.postActions}>
            <button 
              className={styles.editBtn} 
              onClick={() => setEditing(!editing)}
              title="Editar publicación"
            >
              ✏️
            </button>
            <button 
              className={styles.deleteBtn} 
              onClick={handleDelete}
              title="Eliminar publicación"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Contenido de la publicación */}
      <div className={styles.postContent}>
        {post.type === "image" && post.mediaUrl && (
          <img src={post.mediaUrl} alt="Publicación" className={styles.postImage} />
        )}
        {post.type === "video" && post.mediaUrl && (
          <video controls className={styles.postVideo}>
            <source src={post.mediaUrl} />
          </video>
        )}
      
        {editing ? (
          <div className={styles.editForm}>
            <textarea 
              value={editText} 
              onChange={e => setEditText(e.target.value)}
              className={styles.editTextarea}
              placeholder="Escribe tu publicación..."
            />
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleEdit}>
                Guardar
              </button>
              <button className={styles.cancelBtn} onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.postText}>{post.text}</p>
        )}
      </div>

      {/* Footer con likes */}
      <div className={styles.postFooter}>
        <button 
          className={liked ? styles.likedBtn : styles.likeBtn} 
          onClick={handleLike}
        >
          ❤️ {post.likes ? post.likes.length : 0}
        </button>
        <div className={styles.postStats}>
          <span>{post.likes ? post.likes.length : 0} likes</span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePost;