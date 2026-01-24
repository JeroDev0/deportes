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

  const openModal = (item) => {
    setModal(item);
    setEditText(item.text);
  };

  if (!items.length) return <div className={styles.empty}>Sin publicaciones</div>;

  return (
    <>
      <div className={styles.grid}>
        {items.map(item => (
          <div 
            key={item._id} 
            className={styles.gridItem} 
            onClick={() => openModal(item)}
          >
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
            
            {/* ✅ Imagen o Video grande */}
            {modal.type === "image" ? (
              <img 
                src={modal.mediaUrl} 
                alt="Imagen grande" 
                className={styles.modalImg} 
              />
            ) : (
              <video 
                src={modal.mediaUrl} 
                controls 
                className={styles.modalImg} 
              />
            )}

            {/* ✅ Acciones solo si es mi perfil */}
            {isMyProfile && (
              <div className={styles.modalActions}>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className={styles.modalTextarea}
                  placeholder="Edita el texto de tu publicación..."
                />
                <button 
                  onClick={handleEdit} 
                  className={styles.saveBtn}
                  title="Guardar cambios"
                >
                  💾 Guardar
                </button>
                <button 
                  onClick={() => { 
                    if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
                      onDelete(modal._id); 
                      setModal(null); 
                    }
                  }} 
                  className={styles.deleteBtn}
                  title="Eliminar publicación"
                >
                  🗑️ Eliminar
                </button>
                <button 
                  className={styles.closeBtn} 
                  onClick={() => setModal(null)}
                >
                  ✖️ Cerrar
                </button>
              </div>
            )}

            {/* ✅ Solo botón cerrar si NO es mi perfil */}
            {!isMyProfile && (
              <button 
                className={styles.closeBtn} 
                onClick={() => setModal(null)}
              >
                ✖️ Cerrar
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryGrid;