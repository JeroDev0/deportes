import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileMain from "../components/Profile/ProfileMain";
import SidebarProfiles from "../components/Profile/SidebarProfiles";
import styles from "./ProfilePage.module.css"; 

function ProfilePage() {
  return (
    <div className={styles.profileLayout}>
      <aside className={styles.left}>
        <ProfileSidebar />
      </aside>
      <main className={styles.center}>
        <ProfileMain />
      </main>
      <aside className={styles.right}>
        <SidebarProfiles />
      </aside>
    </div>
  );
}

export default ProfilePage;