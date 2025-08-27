// GalleryGrid.jsx
import { useState } from "react";
import styles from "./ProfileFeed.module.css";

function GalleryGrid({ items, isMyProfile, onEdit, onDelete }) {
  const [modal, setModal] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEdit = () => {
    if (!editText.trim()) return alert("El texto no puede estar vacío");
    onEdit({ ...modal, text: editText });
    setModal(null);
  };

  if (!items.length) return <div className={styles.empty}>Sin publicaciones</div>;

  return (
    <>
      <div className={styles.grid}>
        {items.map(item => (
          <div key={item._id} className={styles.gridItem} onClick={() => { setModal(item); setEditText(item.text); }}>
            {item.type === "image" ? (
              <img src={item.mediaUrl} alt="Imagen" className={styles.gridImg} />
            ) : (
              <video src={item.mediaUrl} className={styles.gridImg} />
            )}
          </div>
        ))}
      </div>
      {modal && (
        <div className={styles.modal} onClick={() => setModal(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {modal.type === "image" ? (
              <img src={modal.mediaUrl} alt="Imagen grande" className={styles.modalImg} />
            ) : (
              <video src={modal.mediaUrl} controls className={styles.modalImg} />
            )}
            {isMyProfile && (
              <div className={styles.modalActions}>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className={styles.editTextarea}
                />
                <button onClick={handleEdit} className={styles.saveBtn}>Guardar</button>
                <button onClick={() => { onDelete(modal._id); setModal(null); }} className={styles.deleteBtn}>Eliminar</button>
                <button className={styles.closeBtn} onClick={() => setModal(null)}>Cerrar</button>
              </div>
            )}
            {!isMyProfile && (
              <button className={styles.closeBtn} onClick={() => setModal(null)}>Cerrar</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryGrid;