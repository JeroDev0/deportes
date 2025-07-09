import styles from "./ProfileFeed.module.css";

function ProfileTabs({ tab, setTab }) {
  return (
    <div className={styles.tabs}>
      <button className={tab === "posts" ? styles.active : ""} onClick={() => setTab("posts")}>Publicaciones</button>
      <button className={tab === "images" ? styles.active : ""} onClick={() => setTab("images")}>Imágenes</button>
      <button className={tab === "videos" ? styles.active : ""} onClick={() => setTab("videos")}>Videos</button>
    </div>
  );
}

export default ProfileTabs;