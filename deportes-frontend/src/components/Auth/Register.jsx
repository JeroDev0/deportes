import { useState } from "react";
import { useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import API_URL from "../../config/api";
import styles from "./Register.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPORTS_GRID = [
  { value: "Soccer", label: "FÚTBOL", emoji: "⚽" },
  { value: "Handball", label: "BALONMANO", emoji: "🤾" },
  { value: "Volleyball", label: "VOLEIBOL", emoji: "🏐" },
  { value: "Rugby", label: "RUGBY", emoji: "🏉" },
  { value: "Hockey", label: "HOCKEY", emoji: "🏑" },
  { value: "Basketball", label: "BALONCESTO", emoji: "🏀" },
  { value: "Futsal", label: "FUTSAL", emoji: "🥅" },
  { value: "Padel", label: "PADEL", emoji: "🎾" },
  { value: "Pickleball", label: "PICKLEBALL", emoji: "🏓" },
  { value: "Tennis", label: "TENIS", emoji: "🎾" },
  { value: "Swimming", label: "NATACIÓN", emoji: "🏊" },
  { value: "Athletics", label: "ATLETISMO", emoji: "🏃" },
  { value: "Cycling", label: "CICLISMO", emoji: "🚴" },
  { value: "Boxing", label: "BOXEO", emoji: "🥊" },
  { value: "Golf", label: "GOLF", emoji: "⛳" },
  { value: "Baseball", label: "BÉISBOL", emoji: "⚾" },
  { value: "Gymnastics", label: "GIMNASIA", emoji: "🤸" },
  { value: "Karate", label: "KARATE", emoji: "🥋" },
  { value: "Weightlifting", label: "HALTEROFILIA", emoji: "🏋️" },
  { value: "Fencing", label: "ESGRIMA", emoji: "🤺" },
  { value: "Archery", label: "TIRO CON ARCO", emoji: "🏹" },
  { value: "Skating", label: "PATINAJE", emoji: "⛸️" },
  { value: "Triathlon", label: "TRIATLÓN", emoji: "🏊" },
  { value: "Chess", label: "AJEDREZ", emoji: "♟️" },
];

const PROFILE_TYPES = [
  {
    value: "atleta",
    title: "JUGADOR /\nDEPORTISTA",
    roles: "",
    subtitle: "¿Quieres impulsar tu carrera y mostrar tus habilidades a las personas adecuadas?",
    buttonLabel: "SOY UN JUGADOR",
    icon: "🏃",
    sportMode: "single",
  },
  {
    value: "scout",
    title: "PROFESIONAL",
    roles: "Personal Técnico · Árbitro · Salud · Agente de Jugadores · Medios de Comunicación · Asesor de Colocación Deportiva Universitaria",
    subtitle: "Crea tu red fácilmente.",
    buttonLabel: "SOY UN PROFESIONAL",
    icon: "📋",
    sportMode: "multi",
  },
  {
    value: "club",
    title: "COLECTIVO /\nENTIDAD",
    roles: "Club · Federación · Asociación · Universidad · Academia · Estudios Deportivos · Equipo",
    subtitle: "Encuentra los mejores talentos del mañana y lleva a tu colectivo/entidad a nuevos horizontes.",
    buttonLabel: "REPRESENTO A UN CLUB",
    icon: "🏆",
    sportMode: "multi",
  },
];

const STEPS = [
  { num: 1, label: "CREDENCIALES Y DEPORTE" },
  { num: 2, label: "INFORMACIÓN PERSONAL" },
  { num: 3, label: "TÉRMINOS Y CONDICIONES" },
];

const COUNTRIES = countryList().getData();

// ─── T&C Text ─────────────────────────────────────────────────────────────────

const TC_ES = `TÉRMINOS Y CONDICIONES GENERALES (TCG) – BKME SPORTS
Versión 1.0 | Abril 2026 | Operado por: BKME Sports GmbH (i.G.) | Hamburgo, Alemania

1. ÁMBITO DE APLICACIÓN
BKME es un ecosistema de Diplomacia Deportiva para conectar atletas, clubes e instituciones. BKME actúa exclusivamente como intermediario tecnológico y no garantiza contratos profesionales ni resultados deportivos.

2. REGISTRO Y CAPACIDAD LEGAL
El uso requiere cuenta con datos veraces. Menores 16-18 años necesitan autorización de tutores. Menores de 16 años requieren consentimiento verificado de padres/tutores.

3. CÓDIGO DE CONDUCTA — TRES STRIKES
Se prohíbe lenguaje despectivo, acoso o bullying. Sistema progresivo: Strike 1 (advertencia), Strike 2 (suspensión), Strike 3 (expulsión). Fraude de identidad o conducta delictiva conlleva Strike 3 inmediato.

4. DERECHOS DE CONTENIDO
Al publicar (fotos, vídeos, métricas), el usuario concede a BKME licencia no exclusiva, transferible y gratuita para operar y promover el ecosistema durante la vigencia del contrato.

5. MARKETPLACE DE VISIBILIDAD
El acceso de terceros a métricas del atleta requiere activación voluntaria del "Modo Scouting". Los datos se procesan de forma agregada y anonimizada conforme al RGPD.

6. PROTOCOLO DE BIENESTAR
En colaboración con UKE, TUHH y Uni Leipzig, BKME puede contactar al usuario o tutores si se detectan indicadores graves de riesgo mental. En casos de abuso, BKME colaborará con autoridades competentes.

7. LIMITACIÓN DE RESPONSABILIDAD
Conforme al § 307 BGB, la responsabilidad por negligencia leve se limita a obligaciones contractuales esenciales. BKME no responde por lesiones físicas ni daños psicológicos derivados de la competición.

8. INTEGRIDAD Y VERIFICACIÓN
Clubes certificados confirman la vinculación del atleta. Falsear datos de rendimiento o identidad más de tres veces conlleva expulsión inmediata.

9. DISPOSICIONES FINALES
Se aplica el derecho alemán. Jurisdicción: Hamburgo, Alemania. BKME no participa en procedimientos de arbitraje de consumo (Art. 14 ODR-VO).`;

const TC_EN = `GENERAL TERMS AND CONDITIONS (GT&C) – BKME SPORTS
Version 1.0 | April 2026 | Operated by: BKME Sports GmbH (i.G.) | Hamburg, Germany

1. SCOPE
BKME is a Sports Diplomacy ecosystem connecting athletes, clubs and institutions. BKME acts exclusively as a technological intermediary and does not guarantee professional contracts or sporting results.

2. REGISTRATION AND LEGAL CAPACITY
Use requires an account with truthful data. Users 16-18 need guardian authorization. Under-16s require verified parental consent.

3. CODE OF CONDUCT — THREE STRIKES
Derogatory language, harassment or performance bullying is prohibited. Progressive system: Strike 1 (warning), Strike 2 (suspension), Strike 3 (expulsion). Identity fraud or criminal conduct triggers immediate Strike 3.

4. CONTENT RIGHTS
By publishing (photos, videos, metrics), the user grants BKME a non-exclusive, transferable, royalty-free license to operate and promote the ecosystem for the contract duration.

5. VISIBILITY MARKETPLACE
Third-party access to athlete metrics requires voluntary activation of "Scouting Mode". Data is processed aggregated and anonymized under GDPR.

6. WELL-BEING PROTOCOL
In collaboration with UKE, TUHH and Uni Leipzig, BKME may contact the user or guardians if severe mental health risk indicators are detected.

7. LIMITATION OF LIABILITY
Per § 307 BGB, liability for slight negligence is limited to essential contractual obligations. BKME is not liable for physical injuries or psychological damages from competition.

8. INTEGRITY AND VERIFICATION
Certified clubs confirm athlete affiliation. Falsifying performance or identity data more than three times results in immediate expulsion.

9. FINAL PROVISIONS
German law applies exclusively. Jurisdiction: Hamburg, Germany. BKME does not participate in consumer arbitration (Art. 14 ODR-VO). In case of discrepancies between German and English versions, the German version shall prevail.`;

const TC_DE = `ALLGEMEINE GESCHÄFTSBEDINGUNGEN (AGB) – BKME SPORTS
Version 1.0 | April 2026 | Betreiber: BKME Sports GmbH (i.G.) | Hamburg, Deutschland

1. GELTUNGSBEREICH
BKME ist ein Sportdiplomatie-Ökosystem zur Vernetzung von Athleten, Vereinen und Institutionen. BKME agiert ausschließlich als technischer Vermittler und garantiert weder Profiverträge noch sportliche Ergebnisse.

2. REGISTRIERUNG UND RECHTSFÄHIGKEIT
Nutzung setzt ein Konto mit wahrheitsgemäßen Daten voraus. Nutzer 16-18 Jahre benötigen Erziehungsberechtigten-Zustimmung. Unter-16-Jährige benötigen verifizierte Elterngenehmigung.

3. VERHALTENSKODEX — THREE STRIKES
Abfällige Sprache, Belästigung oder leistungsbezogenes Mobbing ist untersagt. Progressives System: Strike 1 (Verwarnung), Strike 2 (Suspendierung), Strike 3 (Ausschluss). Identitätsbetrug oder Straftaten → sofortiger Strike 3.

4. INHALTERECHTE
Durch Veröffentlichung gewährt der Nutzer BKME eine nicht-exklusive, übertragbare, lizenzgebührenfreie Lizenz für die Vertragsdauer.

5. VISIBILITY MARKETPLACE
Dritter-Zugang zu Athleten-Metriken erfordert freiwillige Aktivierung des „Scouting-Modus". Daten werden aggregiert und anonymisiert gemäß DSGVO verarbeitet.

6. WOHLBEFINDEN-PROTOKOLL
In Zusammenarbeit mit UKE, TUHH und Uni Leipzig kann BKME Nutzer oder Erziehungsberechtigte bei schweren psychischen Risiken kontaktieren.

7. HAFTUNGSBESCHRÄNKUNG
Gemäß § 307 BGB ist die Haftung bei leichter Fahrlässigkeit auf wesentliche Vertragspflichten beschränkt.

8. INTEGRITÄT UND VERIFIZIERUNG
Zertifizierte Vereine bestätigen die Athleten-Zugehörigkeit. Mehr als dreimalige Datenfälschung → sofortiger Ausschluss.

9. SCHLUSSBESTIMMUNGEN
Deutsches Recht gilt ausschließlich. Gerichtsstand: Hamburg, Deutschland.`;

// ─── Main Component ───────────────────────────────────────────────────────────

function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    profileType: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
    gender: "",
    birthDate: "",
    country: "",
    sport: "",
    sports: [],
    company: "",
    registrationType: "self",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedProfile = PROFILE_TYPES.find(p => p.value === form.profileType);
  const isMultiSport = selectedProfile?.sportMode === "multi";

  // ── Sport handlers ──
  const toggleSport = (val) => {
    if (!isMultiSport) {
      setForm(prev => ({ ...prev, sport: val }));
    } else {
      setForm(prev => {
        const already = prev.sports.includes(val);
        if (already) return { ...prev, sports: prev.sports.filter(s => s !== val) };
        if (prev.sports.length >= 5) return prev;
        return { ...prev, sports: [...prev.sports, val] };
      });
    }
  };

  const isSportSelected = (val) =>
    isMultiSport ? form.sports.includes(val) : form.sport === val;

  // ── Navigation ──
  const showMsg = (text, type = "error") => { setMsg(text); setMsgType(type); };
  const clearMsg = () => setMsg("");

  const goNext = () => {
    clearMsg();
    if (step === 1) {
      if (!form.email || !form.password || !form.confirmPassword) {
        return showMsg("Por favor completa todos los campos de credenciales.");
      }
      if (form.password.length < 6) {
        return showMsg("La contraseña debe tener al menos 6 caracteres.");
      }
      if (form.password !== form.confirmPassword) {
        return showMsg("Las contraseñas no coinciden.");
      }
    }
    setStep(s => s + 1);
  };

  const goBack = () => {
    clearMsg();
    if (step === 1) {
      setStep(0);
    } else {
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!form.termsAccepted) {
      return showMsg("Debes aceptar los Términos y Condiciones para continuar.");
    }
    setLoading(true);
    clearMsg();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          profileType: form.profileType,
          name: form.name,
          lastName: form.lastName,
          gender: form.gender,
          birthDate: form.birthDate,
          country: form.country,
          sport: form.sport,
          sports: form.sports,
          company: form.company,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("¡Registro exitoso! Redirigiendo al inicio de sesión...", "success");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        showMsg(data.error || "Error en el registro.");
      }
    } catch {
      showMsg("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 0: Profile type selection ──
  if (step === 0) {
    return (
      <div className={styles.selectionPage}>
        <div className={styles.selectionHeader}>
          <h1>
            NUESTROS DIFERENTES<br />
            <span>USUARIOS</span>
          </h1>
          <p>Elige tu perfil para comenzar tu registro en BKME Sports</p>
        </div>
        <div className={styles.cardsRow}>
          {PROFILE_TYPES.map(pt => (
            <div key={pt.value} className={styles.typeCard}>
              <div className={styles.cardIcon}>{pt.icon}</div>
              <div className={styles.cardTitle}>{pt.title}</div>
              {pt.roles && <div className={styles.cardRoles}>{pt.roles}</div>}
              <div className={styles.cardSubtitle}>{pt.subtitle}</div>
              <button
                className={styles.cardBtn}
                onClick={() => {
                  setForm(prev => ({ ...prev, profileType: pt.value }));
                  setStep(1);
                }}
              >
                {pt.buttonLabel}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.loginLink}>
          ¿Ya tienes una cuenta?
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
        </div>
      </div>
    );
  }

  // ── Steps 1-3: Split panel ──
  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftBrand}>
          BKME <span>Sports</span>
        </div>
        <div className={styles.leftSubtitle}>Creación de cuenta</div>
        {selectedProfile && (
          <div className={styles.leftProfileBadge}>
            {selectedProfile.icon}&nbsp;{selectedProfile.title.replace("\n", " / ")}
          </div>
        )}
        <div className={styles.stepsWrapper}>
          {STEPS.map((s, idx) => (
            <div key={s.num}>
              <div className={styles.stepItem}>
                <div className={`${styles.stepDot} ${step === s.num ? styles.active : step > s.num ? styles.done : ""}`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <div className={`${styles.stepLabel} ${step === s.num ? styles.active : step > s.num ? styles.done : ""}`}>
                  PASO {s.num}<br />{s.label}
                </div>
              </div>
              {idx < STEPS.length - 1 && <div className={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.rightPanel}>
        <div className={styles.rightInner}>

          {/* ── STEP 1: Credentials + Sport ── */}
          {step === 1 && (
            <>
              <div className={styles.stepTitle}>CREACIÓN DE UNA CUENTA: {selectedProfile?.title.replace("\n", " / ").toUpperCase()}</div>
              <div className={styles.stepDesc}>Completa tus credenciales de acceso y elige tu deporte.</div>

              <div className={styles.stepTitle} style={{ fontSize: "0.85rem", marginBottom: "0.8rem" }}>CREDENCIALES DE INICIO DE SESIÓN</div>
              <div className={styles.credRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Correo Electrónico *</label>
                  <input
                    className={styles.fieldInput}
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Contraseña *</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      className={styles.fieldInput}
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      required
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Confirmar Contraseña *</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      className={styles.fieldInput}
                      type={showPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={form.confirmPassword}
                      onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.sportSectionTitle}>
                {isMultiSport ? "ELIGE TU DEPORTE" : "ELIGE TU DEPORTE"}
              </div>
              <div className={styles.sportHint}>
                {isMultiSport
                  ? `Puedes seleccionar hasta 5 deportes (${form.sports.length}/5 seleccionados)`
                  : "Selecciona el deporte que practicas"}
              </div>
              <div className={styles.sportsGrid}>
                {SPORTS_GRID.map(sp => (
                  <div
                    key={sp.value}
                    className={`${styles.sportCard} ${isSportSelected(sp.value) ? styles.selected : ""}`}
                    onClick={() => toggleSport(sp.value)}
                  >
                    <span className={styles.sportEmoji}>{sp.emoji}</span>
                    <span className={styles.sportName}>{sp.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── STEP 2: Personal Info ── */}
          {step === 2 && (
            <>
              <div className={styles.stepTitle}>INFORMACIÓN PERSONAL</div>
              <div className={styles.stepDesc}>Completa tu información para crear tu perfil.</div>

              <div className={styles.genderRow}>
                <button
                  type="button"
                  className={`${styles.genderBtn} ${form.gender === "femenino" ? styles.selected : ""}`}
                  onClick={() => setForm(p => ({ ...p, gender: "femenino" }))}
                >
                  FEMENINO
                </button>
                <button
                  type="button"
                  className={`${styles.genderBtn} ${form.gender === "masculino" ? styles.selected : ""}`}
                  onClick={() => setForm(p => ({ ...p, gender: "masculino" }))}
                >
                  MASCULINO
                </button>
              </div>

              <div className={styles.personalGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nombre *</label>
                  <input
                    className={styles.fieldInput}
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Apellido *</label>
                  <input
                    className={styles.fieldInput}
                    type="text"
                    placeholder="Tu apellido"
                    value={form.lastName}
                    onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Fecha de Nacimiento *</label>
                  <input
                    className={styles.fieldInput}
                    type="date"
                    value={form.birthDate}
                    onChange={e => setForm(p => ({ ...p, birthDate: e.target.value }))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>País</label>
                  <select
                    className={styles.fieldInput}
                    value={form.country}
                    onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  >
                    <option value="">Selecciona un país</option>
                    {COUNTRIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {(form.profileType === "scout" || form.profileType === "club") && (
                  <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                    <label className={styles.fieldLabel}>
                      {form.profileType === "club" ? "Nombre de la Entidad" : "Empresa / Organización"}
                    </label>
                    <input
                      className={styles.fieldInput}
                      type="text"
                      placeholder={form.profileType === "club" ? "Nombre del club, federación, etc." : "Tu empresa u organización"}
                      value={form.company}
                      onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              {form.profileType === "atleta" && (
                <>
                  <div className={styles.stepTitle} style={{ fontSize: "0.82rem", marginBottom: "0.6rem" }}>
                    ELIGE TU TIPO DE PERFIL
                  </div>
                  <div className={styles.registerTypeRow}>
                    <button
                      type="button"
                      className={`${styles.registerTypeBtn} ${form.registrationType === "child" ? styles.selected : ""}`}
                      onClick={() => setForm(p => ({ ...p, registrationType: "child" }))}
                    >
                      ESTOY REGISTRANDO<br />A MI HIJO/A
                    </button>
                    <button
                      type="button"
                      className={`${styles.registerTypeBtn} ${form.registrationType === "self" ? styles.selected : ""}`}
                      onClick={() => setForm(p => ({ ...p, registrationType: "self" }))}
                    >
                      ME ESTOY<br />REGISTRANDO
                    </button>
                  </div>
                  <p className={styles.registerTypeNote}>
                    Al seleccionar "Me registro", confirmo que soy mayor de 16 años.
                  </p>
                </>
              )}
            </>
          )}

          {/* ── STEP 3: Terms & Conditions ── */}
          {step === 3 && (
            <>
              <div className={styles.stepTitle}>TÉRMINOS Y CONDICIONES</div>
              <div className={styles.stepDesc}>
                Lee y acepta los Términos y Condiciones de BKME Sports para completar tu registro.
              </div>

              <div className={styles.tcContainer}>
                <div className={styles.tcLang}>🇪🇸 ESPAÑOL</div>
                <div className={styles.tcText}>{TC_ES}</div>
                <div className={styles.tcLang}>🇬🇧 ENGLISH</div>
                <div className={styles.tcText}>{TC_EN}</div>
                <div className={styles.tcLang}>🇩🇪 DEUTSCH</div>
                <div className={styles.tcText}>{TC_DE}</div>
              </div>

              <div className={styles.tcCheckRow}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={form.termsAccepted}
                  onChange={e => setForm(p => ({ ...p, termsAccepted: e.target.checked }))}
                />
                <label htmlFor="terms" className={styles.tcCheckLabel}>
                  He leído y acepto los Términos y Condiciones Generales de BKME Sports.
                  Declaro que la información proporcionada es veraz y que tengo capacidad
                  legal para registrarme.
                </label>
              </div>
            </>
          )}

          {msg && (
            <div className={msgType === "success" ? styles.msgSuccess : styles.msgError}>
              {msg}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className={styles.navRow}>
          <button className={styles.prevBtn} onClick={goBack}>
            ‹ {step === 1 ? "CANCELAR" : "PASO ANTERIOR"}
          </button>
          {step < 3 ? (
            <button className={styles.nextBtn} onClick={goNext}>
              SIGUIENTE PASO ›
            </button>
          ) : (
            <button className={styles.nextBtn} onClick={handleSubmit} disabled={loading || !form.termsAccepted}>
              {loading ? "REGISTRANDO..." : "COMPLETAR REGISTRO ›"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
