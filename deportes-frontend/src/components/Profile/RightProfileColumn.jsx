import React from "react";
import styles from "./RightProfileColumn.module.css";

const data = [
  {
    category: "Scouting / Sports Services",
    entries: [
      { institution: "Body Attack Sports Nutrition GmbH", location: "body-attack.com" },
      { institution: "Kollektiv Sport", location: "europages listing" },
      { institution: "Sauerland Elektroanlagen GmbH", location: "sea-flutlicht.de" },
    ],
  },
  {
    category: "Sports Clubs",
    entries: [
      { institution: "Hamburger Polo Club", location: "hamburger-polo-club.de" },
      { institution: "USC Paloma Hamburg", location: "uscpaloma.de" },
      { institution: "SC Victoria Hamburg", location: "sc-victoria.de" },
    ],
  },
  {
    category: "Sports Sponsors",
    entries: [
      { institution: "Komali Tortillas GmbH", location: "komalitortillas.com" },
      { institution: "Body Attack Sports Nutrition GmbH", location: "body-attack.com" },
      { institution: "Kollektiv Sport", location: "europages listing https://www.kollektiv.rocks/" },
    ],
  },
];

function RightProfileColumn() {
  return (
    <div className={styles.container}>
      {data.map(({ category, entries }, idx) => (
        <section key={idx} className={styles.section}>
          <h3 className={styles.categoryTitle}>{category}</h3>
          <ul className={styles.entryList}>
            {entries.map(({ institution, location }, i) => (
              <li key={i} className={styles.entryItem}>
                <div className={styles.icon} />
                <div className={styles.entryText}>
                  <span className={styles.institution}>{institution}</span>
                  <span className={styles.location}>{location}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default RightProfileColumn;