import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileMain from "../components/Profile/ProfileMain";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileRightbar from "../components/Profile/SidebarProfiles";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  return (
    <div className={styles.profileLayout}>
      <aside className={styles.left}>
        <ProfileSidebar />
      </aside>
      <main className={styles.center}>
        <div className={styles.mainTop}>
          <ProfileMain />
        </div>
        {/* <div className={styles.mainBottom}>
          <ProfileTabs />
        </div> */}
      </main>
      <aside className={styles.right}>
        <SidebarProfiles />
      </aside>
    </div>
  );
}

export default ProfilePage;