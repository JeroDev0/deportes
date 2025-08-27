// ProfileFeed.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/useAuth.js";
import ProfileTabs from "./ProfileTabs";
import NewPostForm from "./NewPostForm";
import ProfilePost from "./ProfilePost";
import GalleryGrid from "./GalleryGrid";
import styles from "./ProfileFeed.module.css";

function ProfileFeed({ profileId, isMyProfile }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://deportes-production.up.railway.app/publicaciones?user=${profileId}`)
      .then(res => {
        // Ordenar publicaciones por fecha descendente (más reciente primero)
        const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profileId]);

  // Añadir nueva publicación
  const handleNewPost = post => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  // Actualizar likes
  const handleLike = (postId, likes) => {
    setPosts(posts =>
      posts.map(p => (p._id === postId ? { ...p, likes } : p))
    );
  };

  // Eliminar publicación
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`https://deportes-production.up.railway.app/publicaciones/${postId}`);
      setPosts(posts => posts.filter(p => p._id !== postId));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("La publicación ya no existe. Se eliminará de la vista.");
        setPosts(posts => posts.filter(p => p._id !== postId));
      } else {
        console.error("Error completo:", err);
        alert(`Error al eliminar publicación: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  // Editar publicación
  const handleEdit = async (updatedPost) => {
    try {
      const res = await axios.put(`https://deportes-production.up.railway.app/publicaciones/${updatedPost._id}`, {
        text: updatedPost.text,
        mediaUrl: updatedPost.mediaUrl,
        type: updatedPost.type
      });
      setPosts(posts => posts.map(p => p._id === updatedPost._id ? res.data : p));
    } catch (err) {
      alert("Error al editar publicación");
      console.error(err);
    }
  };

  return (
    <div className={styles.feedContainer}>
      <ProfileTabs tab={tab} setTab={setTab} />

      {isMyProfile && tab === "posts" && (
        <div className={styles.newPostCard}>
          <h4>Crear nueva publicación</h4>
          <NewPostForm userId={profileId} onNewPost={handleNewPost} />
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando publicaciones...</div>
      ) : (
        <>
          {tab === "posts" && (
            posts.length > 0 ? (
              posts.map(post => (
                <ProfilePost
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  isMyProfile={isMyProfile}
                  userId={user?.id}
                />
              ))
            ) : (
              <div className={styles.empty}>Sin publicaciones</div>
            )
          )}
          {tab === "grid" && (
            <GalleryGrid 
              items={posts} 
              isMyProfile={isMyProfile}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ProfileFeed;