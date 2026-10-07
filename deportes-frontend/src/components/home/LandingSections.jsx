import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import API_URL from '../../config/api';
import styles from './LandingSections.module.css';

function ArrowIcon({ direction = 'right' }) {
  return direction === 'down' ? (
    <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 7.5 10 13l6-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M10.5 4.5 16 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

function LandingSections() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/public/featured-athlete`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => setFeatured(data))
      .catch(() => setFeatured(null));
  }, []);

  const featuredAge = featured?.birthDate
    ? Math.floor((Date.now() - new Date(featured.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;
  const featuredAbout = featured?.shortDescription || featured?.about || '';

  const goRegister = () => navigate('/register');

  const faqItems = [
    { q: t('landing_faq_q1'), a: t('landing_faq_a1') },
    { q: t('landing_faq_q2'), a: t('landing_faq_a2') },
    { q: t('landing_faq_q3'), a: t('landing_faq_a3') },
    { q: t('landing_faq_q4'), a: t('landing_faq_a4') },
  ];

  return (
    <>
      {/* ===== SOCIAL PROOF ===== */}
      <section className={styles.proof} aria-label="Prueba social">
        <div className={styles.proofInner}>
          <div className={styles.proofIntro}>
            <SectionLabel>{t('landing_proof_eyebrow')}</SectionLabel>
            <p className={styles.proofBody}>{t('landing_proof_body')}</p>
          </div>
          <div className={styles.proofStats}>
            {[
              ['80+', t('landing_proof_athletes')],
              ['3', t('landing_proof_clubs')],
              ['3', t('landing_proof_countries')],
            ].map(([number, label]) => (
              <div key={label} className={styles.proofStat}>
                <p className={styles.proofNumber}>{number}</p>
                <p className={styles.proofLabel}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PERFIL DEPORTIVO ===== */}
      <section id="profile" className={styles.profileSection} aria-labelledby="profile-title">
        <div className={styles.profileGrid}>
          <div>
            <SectionLabel>{t('landing_profile_eyebrow')}</SectionLabel>
            <h2 id="profile-title" className={styles.sectionTitle}>{t('landing_profile_title')}</h2>
            <p className={styles.sectionBody}>{t('landing_profile_body')}</p>
            <div className={styles.ctaRow}>
              <button type="button" onClick={goRegister} className={styles.btnPrimary}>
                {t('landing_profile_primary')}<ArrowIcon />
              </button>
            </div>
          </div>

          <div className={styles.mockFrame}>
            <div className={styles.mockCard}>
              <div className={styles.mockHeader}>
                <span className={styles.mockKicker}>{t('landing_profile_label')}</span>
                <span className={styles.mockVerified}><span className={styles.dot} />Verificado</span>
              </div>
              <div className={styles.mockBanner}>
                <div className={styles.mockAvatar}>
                  <img
                    src={featured?.photo || '/assets/avatar-male.svg'}
                    alt={featured ? `${featured.name} ${featured.lastName || ''}`.trim() : ''}
                    className={styles.mockAvatarImg}
                  />
                </div>
                <div>
                  <h3 className={styles.mockName}>{featured ? `${featured.name} ${featured.lastName || ''}`.trim() : '…'}</h3>
                  <p className={styles.mockRole}>{[featured?.sport, featured?.level].filter(Boolean).join(' · ')}</p>
                  <p className={styles.mockLocation}>{[featured?.city, featured?.country].filter(Boolean).join(', ')}</p>
                </div>
              </div>
              <div className={styles.mockBody}>
                <div className={styles.mockAboutHistory}>
                  <div>
                    <p className={styles.mockLabel}>{t('landing_profile_about_title')}</p>
                    <p className={styles.mockText}>{featuredAbout}</p>
                  </div>
                  <div className={styles.mockHistoryCol}>
                    <p className={styles.mockLabel}>{t('landing_profile_history')}</p>
                    {(featured?.experience || []).map((exp, i) => (
                      <div key={i}>
                        <p className={styles.mockYear}>{[exp.startYear, exp.endYear].filter(Boolean).join(' — ')}</p>
                        <p className={styles.mockSmall}>{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.mockStatsBlock}>
                  <p className={styles.mockLabel}>{t('landing_profile_stats')}</p>
                  <div className={styles.mockStatsGrid}>
                    {[
                      [featuredAge ?? '—', t('landing_profile_age')],
                      [featured?.level || '—', t('landing_profile_level')],
                      [featured?.city || '—', t('landing_profile_city')],
                    ].map(([value, label]) => (
                      <div key={label} className={styles.mockStat}>
                        <p className={styles.mockStatValue}>{value}</p>
                        <p className={styles.mockStatLabel}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.mockFooter}>
                  <div className={styles.mockTags}>
                    {(featured?.skills || []).map((skill) => (
                      <span key={skill} className={styles.mockTag}>{skill}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => featured && navigate(`/profile/${featured._id}`)}
                    className={styles.mockView}
                    disabled={!featured}
                  >
                    {t('landing_profile_view')}<ArrowIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFICIOS / RESUMEN DE LOS 3 PILARES ===== */}
      <section className={styles.benefits} aria-labelledby="benefits-title">
        <div className={styles.benefitsIntro}>
          <SectionLabel>{t('landing_benefits_eyebrow')}</SectionLabel>
          <h2 id="benefits-title" className={styles.sectionTitle}>{t('landing_benefits_title')}</h2>
          <p className={styles.sectionBody}>{t('landing_benefits_body')}</p>
        </div>
        <div className={styles.benefitsGrid}>
          {[
            [t('landing_benefits_one_title'), t('landing_benefits_one_body'), '01'],
            [t('landing_benefits_two_title'), t('landing_benefits_two_body'), '02'],
            [t('landing_benefits_three_title'), t('landing_benefits_three_body'), '03'],
          ].map(([title, body, number]) => (
            <div key={number} className={styles.benefitCard}>
              <p className={styles.benefitNumber}>{number}</p>
              <h3 className={styles.benefitTitle}>{title}</h3>
              <p className={styles.benefitBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== MÓDULO 1 · DIPLOMACIA DEPORTIVA ===== */}
      <section id="diplomacy" className={styles.city} aria-labelledby="diplomacy-title">
        <div className={styles.cityGrid}>
          <div>
            <SectionLabel>{t('landing_module1_eyebrow')}</SectionLabel>
            <h2 id="diplomacy-title" className={styles.sectionTitle}>{t('landing_module1_title')}</h2>
            <p className={styles.sectionBody}>{t('landing_module1_body')}</p>
            <div className={styles.stepsList}>
              {[
                [t('landing_module1_one_title'), t('landing_module1_one_body'), '01'],
                [t('landing_module1_two_title'), t('landing_module1_two_body'), '02'],
                [t('landing_module1_three_title'), t('landing_module1_three_body'), '03'],
              ].map(([title, body, number]) => (
                <div key={number} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{number}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{title}</h3>
                    <p className={styles.stepBody}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mapMock}>
            <div className={styles.mapGrid} />
            <svg className={styles.mapBridge} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="20" y1="32" x2="72" y2="55" />
            </svg>
            <span className={`${styles.mapPin} ${styles.pin1}`} />
            <span className={`${styles.mapPin} ${styles.pin3}`} />
            <span className={`${styles.mapDot} ${styles.dot1}`} />
            <span className={`${styles.mapDot} ${styles.dot2}`} />
            <div className={styles.mapHubLabel1}>Hamburgo</div>
            <div className={styles.mapHubLabel2}>LATAM</div>
            <div className={styles.mapCornerLabel}>Red BKME activa</div>
          </div>
        </div>
      </section>

      {/* ===== MÓDULO 2 · FORMACIÓN 360 ===== */}
      <section id="formation" className={styles.mental} aria-labelledby="formation-title">
        <div className={styles.mentalGrid}>
          <div>
            <SectionLabel>{t('landing_module2_eyebrow')}</SectionLabel>
            <h2 id="formation-title" className={styles.sectionTitle}>{t('landing_module2_title')}</h2>
            <p className={styles.sectionBody}>{t('landing_module2_body')}</p>
            <div className={styles.stepsList}>
              {[
                [t('landing_module2_one_title'), t('landing_module2_one_body'), '01'],
                [t('landing_module2_two_title'), t('landing_module2_two_body'), '02'],
                [t('landing_module2_three_title'), t('landing_module2_three_body'), '03'],
              ].map(([title, body, number]) => (
                <div key={number} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{number}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{title}</h3>
                    <p className={styles.stepBody}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mentalMock}>
            <div className={styles.mentalMockHeader}>
              <span className={styles.mockKicker}>BKME / FORMACIÓN 360</span>
              <span className={styles.mentalToday}>TEMPORADA</span>
            </div>
            <div className={styles.radarWrap}>
              <svg className={styles.radarChart} viewBox="-20 -8 240 196" aria-hidden="true">
                <polygon className={styles.radarGridOuter} points="100,30 166.6,78.4 141.2,156.6 58.8,156.6 33.4,78.4" />
                <polygon className={styles.radarGridMid} points="100,53.3 144.4,85.6 127.4,137.8 72.6,137.8 55.6,85.6" />
                <polygon className={styles.radarGridInner} points="100,76.7 122.2,92.8 113.7,118.9 86.3,118.9 77.8,92.8" />
                <line className={styles.radarAxis} x1="100" y1="100" x2="100" y2="30" />
                <line className={styles.radarAxis} x1="100" y1="100" x2="166.6" y2="78.4" />
                <line className={styles.radarAxis} x1="100" y1="100" x2="141.2" y2="156.6" />
                <line className={styles.radarAxis} x1="100" y1="100" x2="58.8" y2="156.6" />
                <line className={styles.radarAxis} x1="100" y1="100" x2="33.4" y2="78.4" />
                <polygon className={styles.radarData} points="100,40.5 146.6,84.9 124.7,134 63,151 66.7,89.2" />
                <text className={styles.radarLabel} x="100" y="12" textAnchor="middle">Técnica</text>
                <text className={styles.radarLabel} x="181" y="76" textAnchor="middle">Físico</text>
                <text className={styles.radarLabel} x="148" y="180" textAnchor="middle">Táctico</text>
                <text className={styles.radarLabel} x="52" y="180" textAnchor="middle">Mental</text>
                <text className={styles.radarLabel} x="19" y="76" textAnchor="middle">Educación</text>
              </svg>
              <p className={styles.mockLabel}>{t('landing_module2_graphic_label')}</p>
              <p className={styles.mentalMockBody}>{t('landing_module2_graphic_body')}</p>
            </div>
            <div className={styles.mentalStatsGrid}>
              {[['+', 'Historial'], ['+', 'Métricas'], ['+', 'Objetivos']].map(([value, label]) => (
                <div key={label}>
                  <p className={styles.mockStatValue}>{value}</p>
                  <p className={styles.mockStatLabel}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MÓDULO 3 · BIENESTAR DEL ATLETA ===== */}
      <section id="wellbeing" className={styles.city} aria-labelledby="wellbeing-title">
        <div className={styles.mentalGrid}>
          <div>
            <SectionLabel>{t('landing_mental_eyebrow')}</SectionLabel>
            <h2 id="wellbeing-title" className={styles.sectionTitle}>{t('landing_mental_title')}</h2>
            <p className={styles.sectionBody}>{t('landing_mental_body')}</p>
            <div className={styles.ruleBox}>
              <p className={styles.ruleLabel}>{t('landing_mental_rule_label')}</p>
              <p className={styles.ruleText}>{t('landing_mental_rule')}</p>
            </div>
            <div className={styles.stepsList}>
              {[
                [t('landing_mental_one_title'), t('landing_mental_one_body'), '01'],
                [t('landing_mental_two_title'), t('landing_mental_two_body'), '02'],
                [t('landing_mental_three_title'), t('landing_mental_three_body'), '03'],
              ].map(([title, body, number]) => (
                <div key={number} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{number}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{title}</h3>
                    <p className={styles.stepBody}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mentalMock}>
            <div className={styles.mentalMockHeader}>
              <span className={styles.mockKicker}>BKME / WELLBEING</span>
              <span className={styles.mentalToday}>HOY</span>
            </div>
            <div className={styles.mentalRing}>
              <div className={styles.ringOuter}>
                <div className={styles.ringInner}>
                  <div className={styles.ringCore} />
                </div>
              </div>
              <p className={styles.mockLabel}>{t('landing_mental_graphic_label')}</p>
              <p className={styles.mentalMockBody}>{t('landing_mental_graphic_body')}</p>
            </div>
            <div className={styles.mentalStatsGrid}>
              {[['92%', 'Energía'], ['7', 'Racha'], ['OK', 'Check-in']].map(([value, label]) => (
                <div key={label}>
                  <p className={styles.mockStatValue}>{value}</p>
                  <p className={styles.mockStatLabel}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className={styles.testimonial} aria-labelledby="testimonial-title">
        <SectionLabel>{t('landing_testimonial_eyebrow')}</SectionLabel>
        <div className={styles.testimonialGrid}>
          <div>
            <h2 id="testimonial-title" className={styles.testimonialQuote}>&ldquo;{t('landing_testimonial_quote')}&rdquo;</h2>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar} />
              <div>
                <p className={styles.testimonialName}>{t('landing_testimonial_name')}</p>
                <p className={styles.testimonialRole}>{t('landing_testimonial_role')}</p>
              </div>
            </div>
          </div>
          <blockquote className={styles.testimonialSecondary}>
            <p>&ldquo;{t('landing_testimonial_secondary_quote')}&rdquo;</p>
            <footer>{t('landing_testimonial_secondary_name')} · {t('landing_testimonial_secondary_role')}</footer>
          </blockquote>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.faqGrid}>
          <div>
            <SectionLabel>{t('landing_faq_eyebrow')}</SectionLabel>
            <h2 id="faq-title" className={styles.sectionTitle}>{t('landing_faq_title')}</h2>
          </div>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <div key={item.q} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={styles.faqQuestion}
                  aria-expanded={openFaq === index}
                >
                  <span>{item.q}</span>
                  <span className={`${styles.faqToggle} ${openFaq === index ? styles.faqToggleOpen : ''}`}>+</span>
                </button>
                {openFaq === index && <p className={styles.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className={styles.finalCta} aria-labelledby="final-title">
        <div className={styles.finalInner}>
          <SectionLabel>{t('landing_final_eyebrow')}</SectionLabel>
          <h2 id="final-title" className={styles.finalTitle}>{t('landing_final_title')}</h2>
          <p className={styles.finalBody}>{t('landing_final_body')}</p>
          <button type="button" onClick={goRegister} className={styles.btnPrimary}>
            {t('landing_final_cta')}<ArrowIcon />
          </button>
          <p className={styles.finalNote}>{t('landing_final_note')}</p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>BKME <span>Sports</span></div>
              <p className={styles.footerDescription}>{t('landing_footer_description')}</p>
              <div className={styles.footerSocial}>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
                <a href="https://ibkme.com/" target="_blank" rel="noreferrer" aria-label="Sitio oficial">↗</a>
              </div>
            </div>
            <div>
              <p className={styles.footerColTitle}>{t('landing_footer_explore')}</p>
              <div className={styles.footerLinks}>
                <a href="#profile">{t('landing_footer_profile')}</a>
                <a href="#diplomacy">{t('landing_footer_community')}</a>
                <a href="#faq">FAQ</a>
              </div>
            </div>
            <div>
              <p className={styles.footerColTitle}>{t('landing_footer_resources')}</p>
              <div className={styles.footerLinks}>
                <a href="https://ibkme.com/" target="_blank" rel="noreferrer">ibkme.com</a>
                <a href="https://ibkme.com/" target="_blank" rel="noreferrer">{t('landing_footer_privacy')}</a>
                <a href="https://ibkme.com/" target="_blank" rel="noreferrer">{t('landing_footer_terms')}</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBacked}>
            <span>{t('landing_footer_backed')}</span>
            <span>{t('landing_footer_endorsed')}</span>
          </div>
          <div className={styles.footerRights}>{t('landing_footer_rights')}</div>
        </div>
      </footer>
    </>
  );
}

export default LandingSections;
