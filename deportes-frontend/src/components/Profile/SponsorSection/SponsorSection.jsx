import React from "react";
import styles from "./SponsorSection.module.css";

function SponsorSection() {
  return (
    <div className={styles.wrapper}>
      {/* Needs */}
      <section className={styles.needs}>
        <h3 className={styles.sectionTitle}>
          <img src="/assets/icon_needs.svg" alt="needs" />
          Needs
        </h3>

        <ul className={styles.needsList}>
          <li>
            <div>
              <strong>Nutritions</strong>
              <p>Here is a short text the athlete wrote to explain this point</p>
            </div>
            <span>250 €</span>
          </li>
          <li>
            <div>
              <strong>Equipment</strong>
              <p>Here is a short text the athlete wrote to explain this point</p>
            </div>
            <span>400 €</span>
          </li>
        </ul>

        <div className={styles.total}>
          <span>Total</span>
          <span>370 € / 650 €</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: "60%" }} />
        </div>
      </section>

      {/* Sponsor */}
      <section className={styles.sponsor}>
        <h3 className={styles.sectionTitle}>
          <img src="/assets/icon_sponsor.svg" alt="sponsor" />
          Sponsor
        </h3>

        {/* Sponsor without return */}
        <div className={styles.card}>
          <p className={styles.label}>Sponsor without Return</p>
          <p className={styles.desc}>
            Support the Athlete just because you like him.
          </p>
          <div className={styles.inputRow}>
            <input type="number" defaultValue={5} /> €
            <button>Sponsor 5 €</button>
          </div>
        </div>

        {/* Contact Athlete */}
        <div className={styles.card}>
          <p className={styles.label}>Get exclusive access</p>
          <p className={styles.desc}>
            Contact the athlete to offer individual support or sponsorship offer
          </p>
          <button className={styles.contactBtn}>Contact Athlete</button>
        </div>

        {/* Social Media Placement */}
        <div className={styles.card}>
          <p className={styles.label}>Social Media Placement 50 €</p>
          <p className={styles.desc}>
            Sponsor will be mentioned in Social Media profile
          </p>
          <div className={styles.actionRow}>
            <button>Sponsor 50 €</button>
            <span>4/8 left</span>
          </div>
        </div>

        {/* Jersey Placement */}
        <div className={styles.card}>
          <p className={styles.label}>Jersey Placement 200 €</p>
          <p className={styles.desc}>
            Sponsor will be applied as a patch on the jersey chest for at least
            12 months.
          </p>
          <div className={styles.actionRow}>
            <button>Sponsor 200 €</button>
            <span>2/3 left</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SponsorSection;