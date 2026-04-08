import React from "react";

function AdBanner({ image, alt, link }) {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <img
        src={image}
        alt={alt}
        style={{ width: "100%", borderRadius: "8px" }}
      />
    </a>
  );
}

export default AdBanner;