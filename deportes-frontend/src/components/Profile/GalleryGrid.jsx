import { useState } from "react";
import styles from "./ProfileFeed.module.css";

function GalleryGrid({ items, type }) {
  const [modal, setModal] = useState(null);

  if (!items.length) return <div className={styles.empty}>Sin {type === "image" ? "imágenes" : "videos"}</div>;

  return (
    <>
      <div className={styles.grid}>
        {items.map(item => (
          <div key={item._id} className={styles.gridItem} onClick={() => setModal(item)}>
            {type === "image" ? (
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
            {type === "image" ? (
              <img src={modal.mediaUrl} alt="Imagen grande" className={styles.modalImg} />
            ) : (
              <video src={modal.mediaUrl} controls className={styles.modalImg} />
            )}
            <p className={styles.modalText}>{modal.text}</p>
            <button className={styles.closeBtn} onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryGrid;