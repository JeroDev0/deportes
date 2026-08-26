import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
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
              ['500+', t('landing_proof_athletes')],
              ['25+', t('landing_proof_clubs')],
              ['8', t('landing_proof_countries')],
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
                  <span>[FOTO]</span>
                </div>
                <div>
                  <h3 className={styles.mockName}>{t('landing_profile_name')}</h3>
                  <p className={styles.mockRole}>{t('landing_profile_role')}</p>
                  <p className={styles.mockLocation}>{t('landing_profile_location')}</p>
                </div>
              </div>
              <div className={styles.mockBody}>
                <div className={styles.mockAboutHistory}>
                  <div>
                    <p className={styles.mockLabel}>{t('landing_profile_about_title')}</p>
                    <p className={styles.mockText}>{t('landing_profile_about')}</p>
                  </div>
                  <div className={styles.mockHistoryCol}>
                    <p className={styles.mockLabel}>{t('landing_profile_history')}</p>
                    <p className={styles.mockYear}>2021 — 2024</p>
                    <p className={styles.mockSmall}>Hamburg Youth League</p>
                    <p className={styles.mockYear}>2018 — 2021</p>
                    <p className={styles.mockSmall}>Academia LATAM</p>
                  </div>
                </div>
                <div className={styles.mockStatsBlock}>
                  <p className={styles.mockLabel}>{t('landing_profile_stats')}</p>
                  <div className={styles.mockStatsGrid}>
                    {[
                      ['87', t('landing_profile_matches')],
                      ['24 / 19', t('landing_profile_goals')],
                      ['8.6', t('landing_profile_rating')],
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
                    <span className={styles.mockTag}>Velocidad</span>
                    <span className={styles.mockTag}>Visión</span>
                  </div>
                  <span className={styles.mockView}>{t('landing_profile_view')}<ArrowIcon /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SALUD MENTAL ===== */}
      <section id="wellbeing" className={styles.mental} aria-labelledby="wellbeing-title">
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

      {/* ===== ACTIVACIÓN URBANA ===== */}
      <section id="city" className={styles.city} aria-labelledby="city-title">
        <div className={styles.cityGrid}>
          <div>
            <SectionLabel>{t('landing_city_eyebrow')}</SectionLabel>
            <h2 id="city-title" className={styles.sectionTitle}>{t('landing_city_title')}</h2>
            <p className={styles.sectionBody}>{t('landing_city_body')}</p>
            <div className={styles.memberRow}>
              <span className={styles.memberNumber}>500+</span>
              <p className={styles.memberText}>{t('landing_city_member')}</p>
            </div>
            <div className={styles.cityList}>
              {[t('landing_city_one'), t('landing_city_two'), t('landing_city_three')].map((item, index) => (
                <div key={item} className={styles.cityItem}>
                  <span className={styles.cityIndex}>0{index + 1}</span>{item}
                </div>
              ))}
            </div>
            <button type="button" onClick={goRegister} className={styles.btnOutline}>
              {t('landing_city_cta')}<ArrowIcon />
            </button>
          </div>

          <div className={styles.mapMock}>
            <div className={styles.mapGrid} />
            <span className={`${styles.mapPin} ${styles.pin1}`} />
            <span className={`${styles.mapPin} ${styles.pin2}`} />
            <span className={`${styles.mapPin} ${styles.pin3}`} />
            <span className={`${styles.mapDot} ${styles.dot1}`} />
            <span className={`${styles.mapDot} ${styles.dot2}`} />
            <div className={styles.mapCenterLabel}>Hamburg</div>
            <div className={styles.mapCornerLabel}>Activo en tu zona</div>
          </div>
        </div>
        <p className={styles.mapCaption}>{t('landing_city_graphic_body')}</p>
      </section>

      {/* ===== BENEFICIOS ===== */}
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

      {/* ===== PRECIOS ===== */}
      <section className={styles.pricing} aria-labelledby="pricing-title">
        <div className={styles.pricingIntro}>
          <SectionLabel>{t('landing_pricing_eyebrow')}</SectionLabel>
          <h2 id="pricing-title" className={styles.sectionTitle}>{t('landing_pricing_title')}</h2>
          <p className={styles.sectionBody}>{t('landing_pricing_body')}</p>
        </div>
        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <p className={styles.priceLabel}>{t('landing_pricing_free_label')}</p>
            <h3 className={styles.priceTitle}>{t('landing_pricing_free_title')}</h3>
            <p className={styles.priceBody}>{t('landing_pricing_free_body')}</p>
            <ul className={styles.priceFeatures}>
              {[t('landing_pricing_free_feat1'), t('landing_pricing_free_feat2'), t('landing_pricing_free_feat3')].map((item) => (
                <li key={item}><span className={styles.plus}>+</span>{item}</li>
              ))}
            </ul>
            <button type="button" onClick={goRegister} className={styles.btnOutline}>
              {t('landing_pricing_free_cta')}<ArrowIcon />
            </button>
          </article>

          <article className={`${styles.priceCard} ${styles.priceCardPremium}`}>
            <span className={styles.premiumBadge}>{t('landing_pricing_premium_label')}</span>
            <p className={styles.priceLabel}>BKME SPORTS</p>
            <h3 className={styles.priceTitle}>{t('landing_pricing_premium_title')}</h3>
            <p className={styles.priceBody}>{t('landing_pricing_premium_body')}</p>
            <ul className={styles.priceFeatures}>
              {[t('landing_pricing_premium_feat1'), t('landing_pricing_premium_feat2'), t('landing_pricing_premium_feat3')].map((item) => (
                <li key={item}><span className={styles.plus}>+</span>{item}</li>
              ))}
            </ul>
            <button type="button" onClick={goRegister} className={styles.btnPrimary}>
              {t('landing_pricing_premium_cta')}<ArrowIcon />
            </button>
          </article>
        </div>
        <p className={styles.pricingFootnote}>{t('landing_pricing_footnote')}</p>
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
                <a href="#city">{t('landing_footer_community')}</a>
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
