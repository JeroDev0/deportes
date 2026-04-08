import React, { useEffect, useState } from "react";
import styles from "./RightProfileColumn.module.css";
import AdBanner from "../Ads/AdBanner";
import API_URL from "../../config/api";
import { useAuth } from "../../context/useAuth";

function RightProfileColumn() {
  const [ads, setAds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/ads?role=${user.profileType}`)
      .then(res => res.json())
      .then(setAds);
  }, [user]);

  return (
    <div className={styles.container}>
      {ads.map(ad => (
        <AdBanner
          key={ad._id}
          image={ad.imageUrl}
          link={ad.link}
          alt={ad.title}
        />
      ))}
    </div>
  );
}
export default RightProfileColumn;