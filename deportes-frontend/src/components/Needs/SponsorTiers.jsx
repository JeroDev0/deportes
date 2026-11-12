import React, { useState } from "react";
import styles from "./SponsorTiers.module.css";
import { useLanguage } from "../../context/LanguageContext";
import { apiFetch } from "../../config/fetchWithAuth";

const SOCIAL_MEDIA_TOTAL = 8;
const JERSEY_TOTAL = 3;
const SPONSOR_PRICE_SOCIAL = 50;
const SPONSOR_PRICE_JERSEY = 200;

function SponsorTiers({ profile, isMyProfile }) {
  const { t } = useLanguage();
  const slots = profile.sponsorSlots || {};
  const socialTaken = slots.socialMedia?.taken || 0;
  const jerseyTaken = slots.jersey?.taken || 0;

  const [openAmount, setOpenAmount] = useState(5);
  const [loadingTier, setLoadingTier] = useState(null);
  const [error, setError] = useState("");

  const startCheckout = async (tier, amount) => {
    setLoadingTier(tier);
    setError("");
    try {
      const res = await apiFetch("/donations/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId: profile._id,
          donationType: "sponsor",
          tier,
          amount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "error");
      window.location.href = data.url;
    } catch {
      setError(t("sponsor_error"));
      setLoadingTier(null);
    }
  };

  const handleContact = () => {
    const subject = encodeURIComponent(t("sponsor_contact_subject"));
    const athleteName = `${profile.name} ${profile.lastName || ""}`.trim();
    const body = encodeURIComponent(`${t("sponsor_contact_body")} ${athleteName} (ID: ${profile._id})`);
    window.location.href = `mailto:support@ibkme.com?subject=${subject}&body=${body}`;
  };

  const socialRemaining = Math.max(0, SOCIAL_MEDIA_TOTAL - socialTaken);
  const jerseyRemaining = Math.max(0, JERSEY_TOTAL - jerseyTaken);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.sectionTitle}>
        <img src="/assets/icon_sponsor.svg" alt="" className={styles.sectionIcon} />
        {t("sponsor_section_title")}
      </h3>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <p className={styles.label}>{t("sponsor_without_return_title")}</p>
        <p className={styles.desc}>{t("sponsor_without_return_desc")}</p>
        {!isMyProfile && (
          <div className={styles.inputRow}>
            <input
              type="number"
              min="1"
              value={openAmount}
              onChange={(e) => setOpenAmount(e.target.value)}
              aria-label={t("sponsor_amount_label")}
            />
            <span>€</span>
            <button
              type="button"
              onClick={() => startCheckout("open", openAmount)}
              disabled={loadingTier === "open"}
            >
              {t("sponsor_donate_prefix")} {openAmount} €
            </button>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.label}>{t("sponsor_exclusive_title")}</p>
        <p className={styles.desc}>{t("sponsor_exclusive_desc")}</p>
        {!isMyProfile && (
          <button type="button" className={styles.contactBtn} onClick={handleContact}>
            {t("sponsor_contact_button")}
          </button>
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.label}>
          {t("sponsor_social_title")} {SPONSOR_PRICE_SOCIAL} €
        </p>
        <p className={styles.desc}>{t("sponsor_social_desc")}</p>
        <div className={styles.actionRow}>
          {!isMyProfile && socialRemaining > 0 && (
            <button
              type="button"
              onClick={() => startCheckout("social_media", SPONSOR_PRICE_SOCIAL)}
              disabled={loadingTier === "social_media"}
            >
              {t("sponsor_donate_prefix")} {SPONSOR_PRICE_SOCIAL} €
            </button>
          )}
          {!isMyProfile && socialRemaining <= 0 && (
            <span className={styles.soldOut}>{t("sponsor_sold_out")}</span>
          )}
          <span className={styles.slotsLabel}>
            {socialRemaining}/{SOCIAL_MEDIA_TOTAL} {t("sponsor_slots_available")}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.label}>
          {t("sponsor_jersey_title")} {SPONSOR_PRICE_JERSEY} €
        </p>
        <p className={styles.desc}>{t("sponsor_jersey_desc")}</p>
        <div className={styles.actionRow}>
          {!isMyProfile && jerseyRemaining > 0 && (
            <button
              type="button"
              onClick={() => startCheckout("jersey", SPONSOR_PRICE_JERSEY)}
              disabled={loadingTier === "jersey"}
            >
              {t("sponsor_donate_prefix")} {SPONSOR_PRICE_JERSEY} €
            </button>
          )}
          {!isMyProfile && jerseyRemaining <= 0 && (
            <span className={styles.soldOut}>{t("sponsor_sold_out")}</span>
          )}
          <span className={styles.slotsLabel}>
            {jerseyRemaining}/{JERSEY_TOTAL} {t("sponsor_slots_available")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SponsorTiers;
