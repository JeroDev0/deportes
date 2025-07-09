import { useState } from "react";
import axios from "axios";
import styles from "./ProfileFeed.module.css";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dx9l2xf44/auto/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned";

function NewPostForm({ userId, onNewPost }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    let mediaUrl = "";
    if (file) {
      // Subir a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await axios.post(CLOUDINARY_URL, formData);
        mediaUrl = res.data.secure_url;
      } catch (err) {
        alert("Error subiendo archivo a Cloudinary");
        setLoading(false);
        return;
      }
    }

    // Crear publicación en backend
    try {
      const res = await axios.post("https://deportes-production.up.railway.app/publicaciones", {
        user: userId,
        text,
        type,
        mediaUrl
      });
      onNewPost(res.data);
      setText("");
      setFile(null);
    } catch (err) {
      alert("Error creando publicación");
    }
    setLoading(false);
  };

  return (
    <form className={styles.newPostForm} onSubmit={handleSubmit}>
      <textarea
        placeholder="¿Qué quieres compartir?"
        value={text}
        onChange={e => setText(e.target.value)}
        required
      />
      <div className={styles.formRow}>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="image">Imagen</option>
          <option value="video">Video</option>
        </select>
        <input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={e => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}

export default NewPostForm;