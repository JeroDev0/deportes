import React from "react";

function ProfileHeader({ profile, isMyProfile }) {
  return (
    <div style={{ position: "relative" }}>
      <img
        src={profile.bannerImage || "DEFAULT_BANNER_URL"}
        alt="Profile banner"
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      />

      {isMyProfile && (
        <button
          style={{ position: "absolute", bottom: 10, right: 10 }}
        >
          Change Image
        </button>
      )}
    </div>
  );
}

export default ProfileHeader;