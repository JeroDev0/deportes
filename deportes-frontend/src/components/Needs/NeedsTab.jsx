import React, { useState } from "react";
import styles from "./NeedsTab.module.css";
import { useLanguage } from "../../context/LanguageContext";
import { apiFetch } from "../../config/fetchWithAuth";
import SponsorTiers from "./SponsorTiers.jsx";

const CATEGORIES = ["nutrition", "equipment", "methodology"];

const CATEGORY_ICONS = {
  nutrition: "/assets/icon_nutrition.svg",
  equipment: "/assets/icon_equipment.svg",
  methodology: "/assets/icon_list.svg",
};

function NeedsTab({ profile, isMyProfile }) {
  const { t } = useLanguage();
  const needs = profile.needs || {};

  const [donatingCategory, setDonatingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [localNeeds, setLocalNeeds] = useState(needs);

  return (
    <div className={styles.wrapper}>
      <div className={styles.moduleHeader}>
        <div className={styles.moduleTitle}>
          <img src="/assets/icon_needs.svg" alt="" className={styles.moduleIcon} />
          <h2>{t("tab_needs")}</h2>
        </div>
        <p className={styles.moduleSubtitle}>{t("needs_subtitle")}</p>
        <p className={styles.disclaimer}>{t("needs_disclaimer")}</p>
      </div>

      <ul className={styles.needsList}>
        {CATEGORIES.map((category) => (
          <NeedCard
            key={category}
            category={category}
            need={localNeeds[category] || { description: "", goalAmount: 0, raisedAmount: 0 }}
            athleteId={profile._id}
            isMyProfile={isMyProfile}
            t={t}
            onDonateClick={() => setDonatingCategory(category)}
            onEditClick={() => setEditingCategory(category)}
          />
        ))}
      </ul>

      <SponsorTiers profile={profile} isMyProfile={isMyProfile} />

      {donatingCategory && (
        <DonateModal
          category={donatingCategory}
          athleteId={profile._id}
          t={t}
          onClose={() => setDonatingCategory(null)}
        />
      )}

      {editingCategory && (
        <EditNeedModal
          category={editingCategory}
          athleteId={profile._id}
          currentNeed={localNeeds[editingCategory] || { description: "", goalAmount: 0 }}
          t={t}
          onClose={() => setEditingCategory(null)}
          onSaved={(updatedNeeds) => {
            setLocalNeeds(updatedNeeds);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

function NeedCard({ category, need, isMyProfile, t, onDonateClick, onEditClick }) {
  const goal = Number(need.goalAmount) || 0;
  const raised = Number(need.raisedAmount) || 0;
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <li className={styles.item}>
      <div className={styles.itemRow}>
        <img src={CATEGORY_ICONS[category]} alt="" className={styles.itemIcon} />
        <div className={styles.itemText}>
          <strong className={styles.itemTitle}>{t(`needs_category_${category}`)}</strong>
          <p className={styles.itemDescription}>
            {need.description ? need.description : t("needs_no_description")}
          </p>
        </div>
        <span className={styles.itemAmount}>
          {raised.toLocaleString()} € / {goal.toLocaleString()} €
        </span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>

      <div className={styles.itemActions}>
        {isMyProfile ? (
          <button className={styles.editLink} type="button" onClick={onEditClick}>
            {t("needs_edit_button")}
          </button>
        ) : (
          <button className={styles.donateBtn} type="button" onClick={onDonateClick}>
            {t("needs_donate_button")}
          </button>
        )}
      </div>
    </li>
  );
}

function DonateModal({ category, athleteId, t, onClose }) {
  const [amount, setAmount] = useState(10);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/donations/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ athleteId, category, amount, donorName, donorEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "error");
      window.location.href = data.url;
    } catch {
      setError(t("needs_donate_error"));
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          {t("needs_donate_button")} · {t(`needs_category_${category}`)}
        </h3>

        <label className={styles.modalLabel}>{t("needs_donate_amount_label")}</label>
        <input
          className={styles.modalInput}
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className={styles.modalLabel}>{t("needs_donate_name_label")}</label>
        <input
          className={styles.modalInput}
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
        />

        <label className={styles.modalLabel}>{t("needs_donate_email_label")}</label>
        <input
          className={styles.modalInput}
          type="email"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
        />

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} type="button" onClick={onClose} disabled={loading}>
            {t("needs_donate_cancel")}
          </button>
          <button className={styles.modalConfirmBtn} type="button" onClick={handleConfirm} disabled={loading}>
            {loading ? t("needs_donate_processing") : t("needs_donate_confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditNeedModal({ category, athleteId, currentNeed, t, onClose, onSaved }) {
  const [description, setDescription] = useState(currentNeed.description || "");
  const [goalAmount, setGoalAmount] = useState(currentNeed.goalAmount || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`/donations/needs/${athleteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description, goalAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      onSaved(data);
    } catch {
      setError(t("needs_edit_error"));
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          {t("needs_edit_button")} · {t(`needs_category_${category}`)}
        </h3>

        <label className={styles.modalLabel}>{t("needs_edit_description_label")}</label>
        <textarea
          className={styles.modalTextarea}
          maxLength={300}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className={styles.modalLabel}>{t("needs_edit_goal_label")}</label>
        <input
          className={styles.modalInput}
          type="number"
          min="0"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} type="button" onClick={onClose} disabled={loading}>
            {t("needs_donate_cancel")}
          </button>
          <button className={styles.modalConfirmBtn} type="button" onClick={handleSave} disabled={loading}>
            {loading ? t("needs_donate_processing") : t("needs_edit_save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NeedsTab;
