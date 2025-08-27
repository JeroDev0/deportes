import { useState, useRef } from "react";
import axios from "axios";
import styles from "./ProfileFeed.module.css";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dx9l2xf44/auto/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned";

function NewPostForm({ userId, onNewPost }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleTypeChange = e => {
    setType(e.target.value);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim()) {
      alert("El texto es obligatorio");
      return;
    }
    if (!file) {
      alert("Debes seleccionar un archivo");
      return;
    }
    setLoading(true);

    let mediaUrl = "";
    if (file) {
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert("Error creando publicación");
    }
    setLoading(false);
  };

  return (
    <form className={styles.newPostForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.postTextarea}
        placeholder="¿Qué quieres compartir?"
        value={text}
        onChange={e => setText(e.target.value)}
        required
      />
      <div className={styles.formRow}>
        <select 
          className={styles.typeSelect}
          value={type} 
          onChange={handleTypeChange}
        >
          <option value="image">Imagen</option>
          <option value="video">Video</option>
        </select>
        {/* Label personalizado */}
        <label className={styles.fileLabel}>
          <span>{file ? "Cambiar archivo" : "Seleccionar archivo"}</span>
          <input
            className={styles.fileInput}
            type="file"
            accept={type === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />
        </label>
        <button 
          type="submit" 
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
      {file && (
        <div className={styles.selectedFile}>
          Archivo seleccionado: <strong>{file.name}</strong>
        </div>
      )}
    </form>
  );
}

export default NewPostForm;