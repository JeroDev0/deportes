import { useState } from "react";
import { useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import API_URL from "../../config/api";
import styles from "./Register.module.css";
import { SPORTS_GRID, PROFILE_TYPES, STEPS, COUNTRIES, TC_TEXTS } from "./RegisterData";

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── T&C Text ─────────────────────────────────────────────────────────────────

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
              <p className={styles.cardSubtitle}>{pt.subtitle}</p>
              <button className={styles.cardBtn} onClick={() => {
                  setForm(prev => ({ ...prev, profileType: pt.value }));
                  setStep(1);
              }}>
                {pt.buttonLabel}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.loginLinkBottom}>
          <span>¿Ya tienes una cuenta? </span>
          <button onClick={() => navigate("/login")}>Inicia sesión</button>
        </div>
      </div>
    );
  }

  // ── Steps 1-3: Split panel ──
  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftBrand}>BKME <span>Sports</span></div>
        <div className={styles.stepsWrapper}>
          {STEPS.map((s, idx) => (
            <div key={idx} className={styles.stepItem}>
              <div className={`${styles.stepDot} ${step >= s.num ? styles.active : ""}`}>{s.num}</div>
              <div className={styles.stepLabel}>{s.label}</div>
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
                <div className={styles.tcText}>{TC_TEXTS.es}</div>
                <div className={styles.tcLang}>🇬🇧 ENGLISH</div>
                <div className={styles.tcText}>{TC_TEXTS.en}</div>
                <div className={styles.tcLang}>🇩🇪 DEUTSCH</div>
                <div className={styles.tcText}>{TC_TEXTS.de}</div>
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
