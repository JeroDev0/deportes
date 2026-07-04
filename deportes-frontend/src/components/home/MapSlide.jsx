import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "../../config/fetchWithAuth";
import { useNavigate } from "react-router-dom";
import styles from "./MapSlide.module.css";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: "", shadowUrl: "" });

const GEONAMES_USER = "jerodev0";

// Centroides de país como fallback
const COUNTRY_CENTROIDS = {
  AF:[33.9,67.7],AL:[41.2,20.2],DZ:[28.0,1.7],AO:[-11.2,17.9],AR:[-38.4,-63.6],
  AM:[40.1,45.0],AU:[-25.3,133.8],AT:[47.5,14.6],AZ:[40.1,47.6],BD:[23.7,90.4],
  BE:[50.5,4.5],BJ:[9.3,2.3],BO:[-16.3,-64.5],BA:[44.2,17.7],BW:[-22.3,24.7],
  BR:[-14.2,-51.9],BG:[42.7,25.5],CM:[4.0,12.4],CA:[60.1,-96.8],CF:[6.6,20.9],
  CL:[-35.7,-71.5],CN:[35.9,104.2],CO:[4.6,-74.3],CG:[-0.2,15.8],CR:[9.8,-83.8],
  HR:[45.1,15.2],CU:[21.5,-79.5],CZ:[49.8,15.5],DK:[56.3,9.5],DO:[18.7,-70.2],
  EC:[-1.8,-77.8],EG:[26.8,30.8],ET:[9.1,40.5],FI:[61.9,25.8],FR:[46.2,2.2],
  GA:[-0.8,11.6],GE:[42.3,43.4],DE:[51.2,10.5],GH:[8.0,-1.0],GR:[39.1,21.8],
  GT:[15.8,-90.2],GN:[10.9,-11.8],GY:[4.9,-58.9],HT:[19.0,-72.3],HN:[15.2,-86.2],
  HU:[47.2,19.5],IN:[20.6,78.7],ID:[-0.8,113.9],IR:[32.4,53.7],IQ:[33.2,43.7],
  IE:[53.4,-8.2],IL:[31.0,34.9],IT:[41.9,12.6],JM:[18.1,-77.3],JP:[36.2,138.3],
  JO:[31.2,36.2],KZ:[48.0,66.9],KE:[0.0,37.9],KR:[35.9,127.8],KW:[29.3,47.5],
  LV:[56.9,24.6],LB:[33.9,35.9],LY:[26.3,17.2],LT:[55.2,23.9],LU:[49.8,6.1],
  MG:[-18.8,46.9],MW:[-13.3,34.3],MY:[4.2,109.7],ML:[17.6,-2.0],MT:[35.9,14.4],
  MX:[23.6,-102.6],MD:[47.4,28.4],MN:[46.9,103.9],ME:[42.7,19.4],MA:[31.8,-7.1],
  MZ:[-18.7,35.5],MM:[21.9,96.4],NA:[-23.0,18.5],NP:[28.4,83.9],NL:[52.1,5.3],
  NZ:[-40.9,171.5],NI:[12.9,-85.0],NE:[17.6,8.1],NG:[9.1,8.7],NO:[60.5,8.5],
  OM:[21.5,57.6],PK:[30.4,69.4],PA:[8.5,-80.8],PY:[-23.4,-58.4],PE:[-9.2,-75.0],
  PH:[12.9,121.8],PL:[51.9,19.2],PT:[39.4,-8.2],RO:[45.9,25.0],RU:[61.5,105.3],
  RW:[-1.9,29.9],SA:[23.9,45.1],SN:[14.5,-14.5],RS:[44.0,21.0],SL:[8.5,-11.8],
  SG:[1.4,103.8],SK:[48.7,19.7],SI:[46.2,15.0],SO:[6.6,46.2],ZA:[-29.0,25.1],
  ES:[40.5,-3.8],LK:[7.9,80.8],SD:[12.9,29.9],SR:[3.9,-56.0],SE:[60.1,18.6],
  CH:[46.8,8.2],SY:[34.8,38.3],TJ:[38.9,71.3],TZ:[-6.4,34.9],TH:[15.9,101.0],
  TG:[8.6,0.8],TT:[10.7,-61.2],TN:[33.9,9.5],TR:[39.0,35.2],UG:[1.4,32.3],
  UA:[48.4,31.2],AE:[23.4,53.9],GB:[55.4,-3.4],US:[37.1,-95.7],UY:[-32.5,-55.8],
  UZ:[41.4,64.6],VE:[6.4,-66.6],VN:[14.1,108.3],YE:[15.6,47.6],ZM:[-13.1,27.9],ZW:[-19.0,29.2],
};

function getAvatar(gender) {
  const f = gender === "femenino" || gender === "female";
  return f ? "/assets/avatar-female.svg" : "/assets/avatar-male.svg";
}

const SPORT_ES = {
  "Soccer":"Fútbol","Basketball":"Baloncesto","Tennis":"Tenis","Volleyball":"Voleibol",
  "Swimming":"Natación","Athletics":"Atletismo","Cycling":"Ciclismo","Boxing":"Boxeo",
  "Gymnastics":"Gimnasia","Handball":"Balonmano","Rugby":"Rugby","Hockey":"Hockey",
};

function makeIcon(type) {
  const color = type === "scout" ? "#4a9fff" : type === "sponsor" ? "#f0b429" : "#53fb52";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};
      border:2px solid #07111c;
      box-shadow:0 0 0 3px ${color}44;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

function InvalidateSizeOnShow({ active }) {
  const map = useMap();
  useEffect(() => {
    if (active) {
      setTimeout(() => map.invalidateSize(), 100);
    }
  }, [active, map]);
  return null;
}

async function geocodeCity(city, country) {
  if (!city || !country) return null;
  try {
    const url = `https://secure.geonames.org/searchJSON?name=${encodeURIComponent(city)}&country=${country}&featureClass=P&maxRows=1&username=${GEONAMES_USER}`;
    const data = await fetch(url).then(r => r.json());
    const g = data.geonames?.[0];
    if (g) return [parseFloat(g.lat), parseFloat(g.lng)];
  } catch {}
  return COUNTRY_CENTROIDS[(country || "").toUpperCase()] || null;
}

export default function MapSlide({ active }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch("/deportistas").then(r => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/scouts").then(r => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/sponsors").then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(async ([athletes, scouts, sponsors]) => {
      const all = [
        ...athletes.map(p => ({ ...p, _type: "athlete", _route: `/profile/${p._id}` })),
        ...scouts.map(p => ({ ...p, _type: "scout", _route: `/scout-profile/${p._id}` })),
        ...sponsors.map(p => ({ ...p, _type: "sponsor", _route: `/sponsor-profile/${p._id}` })),
      ].filter(p => p.country && (p.city || p.country));

      // Geocodificar solo ciudades únicas (máx 60 para respetar límite de GeoNames)
      const uniqueKeys = [...new Set(all.map(p => `${p.city}|${(p.country||"").toUpperCase()}`))].slice(0, 60);
      const coordCache = {};
      await Promise.all(
        uniqueKeys.map(async (key) => {
          const [city, country] = key.split("|");
          coordCache[key] = await geocodeCity(city, country);
          if (!coordCache[key]) {
            coordCache[key] = COUNTRY_CENTROIDS[country] || null;
          }
        })
      );

      if (cancelled) return;
      const result = all
        .map(p => {
          const key = `${p.city}|${(p.country||"").toUpperCase()}`;
          const coords = coordCache[key];
          if (!coords) return null;
          // pequeño jitter para no superponer marcadores en la misma ciudad
          const jitter = () => (Math.random() - 0.5) * 0.08;
          return { ...p, coords: [coords[0] + jitter(), coords[1] + jitter()] };
        })
        .filter(Boolean);

      setMarkers(result);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.mapWrap}>
      {/* Overlay de texto */}
      <div className={styles.overlay}>
        <div className={styles.badge}>◎ COMUNIDAD GLOBAL</div>
        <h2 className={styles.title}>
          {markers.length} deportistas<br />
          <span className={styles.accent}>en todo el mundo</span>
        </h2>
        <div className={styles.legend}>
          <span><span className={styles.dot} style={{background:"#53fb52"}} /> Deportistas</span>
          <span><span className={styles.dot} style={{background:"#4a9fff"}} /> Scouts</span>
          <span><span className={styles.dot} style={{background:"#f0b429"}} /> Patrocinadores</span>
        </div>
      </div>

      {/* Mapa Leaflet */}
      {loading ? (
        <div className={styles.loader}><span/><span/><span/></div>
      ) : (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={14}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <InvalidateSizeOnShow active={active} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          {markers.map((p, i) => (
            <Marker key={`${p._id}-${i}`} position={p.coords} icon={makeIcon(p._type)}>
              <Popup className={styles.popup} closeButton={false} maxWidth={220}>
                <div className={styles.card}>
                  <img
                    src={p.photo || p.logo || getAvatar(p.gender)}
                    alt=""
                    className={styles.cardPhoto}
                  />
                  <div className={styles.cardInfo}>
                    <p className={styles.cardName}>
                      {p._type === "sponsor" ? p.company : `${p.name} ${p.lastName || ""}`}
                    </p>
                    <p className={styles.cardSub}>
                      {SPORT_ES[p.sport] || p.sport || p.specialization || p.industry || ""}
                      {p.city ? ` · ${p.city}` : ""}
                    </p>
                    {p.level && <span className={styles.cardLevel}>{p.level}</span>}
                    <button
                      className={styles.cardBtn}
                      onClick={() => navigate(p._route)}
                    >
                      Ver perfil →
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
