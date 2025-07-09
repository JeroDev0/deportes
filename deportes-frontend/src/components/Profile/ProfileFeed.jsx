import { useState, useEffect } from "react";
import axios from "axios";
import ProfileTabs from "./ProfileTabs";
import NewPostForm from "./NewPostForm";
import ProfilePost from "./ProfilePost";
import GalleryGrid from "./GalleryGrid";
import styles from "./ProfileFeed.module.css";

function ProfileFeed({ profileId, isMyProfile }) {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://deportes-production.up.railway.app/publicaciones?user=${profileId}`)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profileId]);

  // Filtrar imágenes y videos
  const images = posts.filter(post => post.type === "image");
  const videos = posts.filter(post => post.type === "video");

  // Última publicación
  const lastPost = posts[0];

  // Añadir nueva publicación
  const handleNewPost = post => setPosts([post, ...posts]);

  // Actualizar likes
  const handleLike = (postId, likes) => {
    setPosts(posts =>
      posts.map(p => (p._id === postId ? { ...p, likes } : p))
    );
  };

  return (
    <div className={styles.feedContainer}>
      <ProfileTabs tab={tab} setTab={setTab} />
      {isMyProfile && <NewPostForm userId={profileId} onNewPost={handleNewPost} />}
      {loading ? (
        <div className={styles.loading}>Cargando publicaciones...</div>
      ) : (
        <>
          {tab === "posts" && (
            lastPost ? (
              <ProfilePost post={lastPost} onLike={handleLike} />
            ) : (
              <div className={styles.empty}>Sin publicaciones</div>
            )
          )}
          {tab === "images" && (
            <GalleryGrid items={images} type="image" />
          )}
          {tab === "videos" && (
            <GalleryGrid items={videos} type="video" />
          )}
        </>
      )}
    </div>
  );
}

export default ProfileFeed;