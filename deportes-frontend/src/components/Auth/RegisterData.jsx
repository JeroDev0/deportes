// RegisterData.js
import countryList from "react-select-country-list";

export const SPORTS_GRID = [
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

export const PROFILE_TYPES = [
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
        roles: "Personal Técnico · Árbitro · Salud...",
        subtitle: "Crea tu red fácilmente.",
        buttonLabel: "SOY UN PROFESIONAL",
        icon: "📋",
        sportMode: "multi",
    },
    {
        value: "club",
        title: "COLECTIVO /\nENTIDAD",
        roles: "Club · Federación · Asociación...",
        subtitle: "Encuentra los mejores talentos del mañana.",
        buttonLabel: "REPRESENTO A UN CLUB",
        icon: "🏆",
        sportMode: "multi",
    },
];

export const STEPS = [
    { num: 1, label: "CREDENCIALES Y DEPORTE" },
    { num: 2, label: "INFORMACIÓN PERSONAL" },
    { num: 3, label: "TÉRMINOS Y CONDICIONES" },
];

export const COUNTRIES = countryList().getData();

export const TC_TEXTS = {
    es: `TÉRMINOS Y CONDICIONES GENERALES (TCG) – BKME SPORTS
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
Se aplica el derecho alemán. Jurisdicción: Hamburgo, Alemania. BKME no participa en procedimientos de arbitraje de consumo (Art. 14 ODR-VO).`,

    en: `GENERAL TERMS AND CONDITIONS (GT&C) – BKME SPORTS
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
German law applies exclusively. Jurisdiction: Hamburg, Germany. BKME does not participate in consumer arbitration (Art. 14 ODR-VO). In case of discrepancies between German and English versions, the German version shall prevail.`,

    de: `ALLGEMEINE GESCHÄFTSBEDINGUNGEN (AGB) – BKME SPORTS
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
Deutsches Recht gilt ausschließlich. Gerichtsstand: Hamburg, Deutschland.`

};