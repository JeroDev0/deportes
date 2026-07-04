import { useState, useEffect, memo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { apiFetch } from "../../config/fetchWithAuth";
import styles from "./WorldMapBanner.module.css";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Centroides por código de país ISO 2
const CENTROIDS = {
  AF:[67.7,33.9],AL:[20.2,41.2],DZ:[1.7,28.0],AO:[17.9,-11.2],AR:[-63.6,-38.4],
  AM:[45.0,40.1],AU:[133.8,-25.3],AT:[14.6,47.5],AZ:[47.6,40.1],BD:[90.4,23.7],
  BE:[4.5,50.5],BJ:[2.3,9.3],BO:[-64.5,-16.3],BA:[17.7,44.2],BW:[24.7,-22.3],
  BR:[-51.9,-14.2],BG:[25.5,42.7],BF:[-1.6,12.4],BI:[29.9,-3.4],CM:[12.4,4.0],
  CA:[-96.8,60.1],CF:[20.9,6.6],TD:[18.7,15.5],CL:[-71.5,-35.7],CN:[104.2,35.9],
  CO:[-74.3,4.6],CG:[15.8,-0.2],CR:[-83.8,9.8],HR:[15.2,45.1],CU:[-79.5,21.5],
  CY:[33.4,35.1],CZ:[15.5,49.8],DK:[9.5,56.3],DO:[-70.2,18.7],EC:[-77.8,-1.8],
  EG:[30.8,26.8],SV:[-88.9,13.8],ET:[40.5,9.1],FI:[25.8,61.9],FR:[2.2,46.2],
  GA:[11.6,-0.8],GE:[43.4,42.3],DE:[10.5,51.2],GH:[-1.0,8.0],GR:[21.8,39.1],
  GT:[-90.2,15.8],GN:[-11.8,10.9],GW:[-15.2,11.8],GY:[-58.9,4.9],HT:[-72.3,19.0],
  HN:[-86.2,15.2],HU:[19.5,47.2],IN:[78.7,20.6],ID:[113.9,-0.8],IR:[53.7,32.4],
  IQ:[43.7,33.2],IE:[-8.2,53.4],IL:[34.9,31.0],IT:[12.6,41.9],JM:[-77.3,18.1],
  JP:[138.3,36.2],JO:[36.2,31.2],KZ:[66.9,48.0],KE:[37.9,0.0],KR:[127.8,35.9],
  KW:[47.5,29.3],LA:[102.5,17.9],LV:[24.6,56.9],LB:[35.9,33.9],LY:[17.2,26.3],
  LT:[23.9,55.2],LU:[6.1,49.8],MG:[46.9,-18.8],MW:[34.3,-13.3],MY:[109.7,4.2],
  ML:[-2.0,17.6],MT:[14.4,35.9],MX:[-102.6,23.6],MD:[28.4,47.4],MN:[103.9,46.9],
  ME:[19.4,42.7],MA:[-7.1,31.8],MZ:[35.5,-18.7],MM:[96.4,21.9],NA:[18.5,-23.0],
  NP:[83.9,28.4],NL:[5.3,52.1],NZ:[171.5,-40.9],NI:[-85.0,12.9],NE:[8.1,17.6],
  NG:[8.7,9.1],NO:[8.5,60.5],OM:[57.6,21.5],PK:[69.4,30.4],PA:[-80.8,8.5],
  PG:[144.0,-6.3],PY:[-58.4,-23.4],PE:[-75.0,-9.2],PH:[121.8,12.9],PL:[19.2,51.9],
  PT:[-8.2,39.4],RO:[25.0,45.9],RU:[105.3,61.5],RW:[29.9,-1.9],SA:[45.1,23.9],
  SN:[-14.5,14.5],RS:[21.0,44.0],SL:[-11.8,8.5],SG:[103.8,1.4],SK:[19.7,48.7],
  SI:[15.0,46.2],SO:[46.2,6.6],ZA:[25.1,-29.0],ES:[-3.8,40.5],LK:[80.8,7.9],
  SD:[29.9,12.9],SR:[-56.0,3.9],SE:[18.6,60.1],CH:[8.2,46.8],SY:[38.3,34.8],
  TJ:[71.3,38.9],TZ:[34.9,-6.4],TH:[101.0,15.9],TG:[0.8,8.6],TT:[-61.2,10.7],
  TN:[9.5,33.9],TR:[35.2,39.0],TM:[58.5,39.0],UG:[32.3,1.4],UA:[31.2,48.4],
  AE:[53.9,23.4],GB:[-3.4,55.4],US:[-95.7,37.1],UY:[-55.8,-32.5],UZ:[64.6,41.4],
  VE:[-66.6,6.4],VN:[108.3,14.1],YE:[47.6,15.6],ZM:[27.9,-13.1],ZW:[29.2,-19.0],
};

const DOT_SIZES = { 1: 4, 5: 6, 15: 8, 40: 11, 100: 14 };
function dotSize(count) {
  const keys = Object.keys(DOT_SIZES).map(Number).sort((a, b) => a - b);
  for (const k of keys.reverse()) if (count >= k) return DOT_SIZES[k];
  return 4;
}

const PulsingDot = memo(({ coordinates, count, delay = 0 }) => {
  const r = dotSize(count);
  return (
    <Marker coordinates={coordinates}>
      <circle r={r + 6} fill="#53fb52" opacity={0} className={styles.pulse}
        style={{ animationDelay: `${delay}s` }} />
      <circle r={r} fill="#53fb52" stroke="#07111c" strokeWidth={1.5}
        opacity={0.9} />
      {count > 10 && (
        <text textAnchor="middle" y={-r - 4} fontSize={9} fontWeight={700}
          fill="#53fb52" style={{ pointerEvents: "none" }}>
          {count}
        </text>
      )}
    </Marker>
  );
});

export default function WorldMapBanner() {
  const [dots, setDots] = useState([]);
  const [total, setTotal] = useState(0);
  const [countries, setCountries] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/deportistas").then(r => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/scouts").then(r => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/sponsors").then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([athletes, scouts, sponsors]) => {
      const all = [...athletes, ...scouts, ...sponsors];
      const byCountry = {};
      all.forEach(u => {
        const code = (u.country || "").toUpperCase();
        if (code && CENTROIDS[code]) {
          byCountry[code] = (byCountry[code] || 0) + 1;
        }
      });
      setDots(
        Object.entries(byCountry).map(([code, count], i) => ({
          code, count, coords: CENTROIDS[code], delay: (i * 0.18) % 2,
        }))
      );
      setTotal(all.length);
      setCountries(Object.keys(byCountry).length);
      setLoading(false);
    });
  }, []);

  return (
    <section className={styles.section}>
      {/* cabecera */}
      <div className={styles.header}>
        <div className={styles.badge}>◎ COMUNIDAD GLOBAL</div>
        <h2 className={styles.title}>
          Nuestra red deportiva<br />
          <span className={styles.accent}>sin fronteras</span>
        </h2>
        {!loading && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{total}</span>
              <span className={styles.statLabel}>Perfiles activos</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{countries}</span>
              <span className={styles.statLabel}>Países</span>
            </div>
          </div>
        )}
      </div>

      {/* mapa */}
      <div className={styles.mapWrap}>
        <div className={styles.mapInner}>
          {loading ? (
            <div className={styles.loader}>
              <span /><span /><span />
            </div>
          ) : (
            <ComposableMap
              projection="geoNaturalEarth1"
              projectionConfig={{ scale: 155, center: [0, 20] }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup zoom={1} center={[0, 20]} minZoom={1} maxZoom={1}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#0d2635"
                        stroke="#1a3a52"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#122d45", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {dots.map(({ code, count, coords, delay }) => (
                  <PulsingDot
                    key={code}
                    coordinates={coords}
                    count={count}
                    delay={delay}
                  />
                ))}
              </ZoomableGroup>
            </ComposableMap>
          )}
        </div>

        {/* overlay inferior con degradado */}
        <div className={styles.fadeBottom} />
      </div>
    </section>
  );
}
