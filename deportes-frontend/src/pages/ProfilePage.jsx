import Profile from "../components/Profile/Profile";
import SidebarProfiles from "../components/Profile/SidebarProfiles";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <section className={styles.profileSection}>
          <Profile />
        </section>
        <div className={styles.divider} />
        <aside className={styles.sidebarSection}>
          <SidebarProfiles />
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;
