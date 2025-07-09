import { useState } from "react";
import axios from "axios";
import styles from "./ProfileFeed.module.css";

function ProfilePost({ post, onLike }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      // Aquí deberías pasar el id del usuario logueado
      const res = await axios.post(`https://deportes-production.up.railway.app/publicaciones/${post._id}/like`, {
        userId: post.user // <-- Cambia esto por el id del usuario logueado real
      });
      onLike(post._id, res.data.likes);
      setLiked(!liked);
    } catch (err) {
      alert("Error al dar like");
    }
  };

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <span className={styles.postDate}>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div className={styles.postContent}>
        {post.type === "image" && post.mediaUrl && (
          <img src={post.mediaUrl} alt="Publicación" className={styles.postImage} />
        )}
        {post.type === "video" && post.mediaUrl && (
          <video controls className={styles.postVideo}>
            <source src={post.mediaUrl} />
          </video>
        )}
        <p>{post.text}</p>
      </div>
      <button className={liked ? styles.likedBtn : styles.likeBtn} onClick={handleLike}>
        ❤️ {post.likes ? post.likes.length : 0}
      </button>
    </div>
  );
}

export default ProfilePost;