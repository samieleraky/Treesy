import { useEffect, useState, useRef } from "react";

// ── Static content (skifter aldrig — hører ikke hjemme i API) ─
const STEPS = [
  { num: "1", title: "Vælg din pakke",             desc: "Find den løsning, der matcher dit ambitionsniveau." },
  { num: "2", title: "Vi planter træerne for dig", desc: "Træerne plantes, passes og monitoreres med lokale partnere." },
  { num: "3", title: "Følg dit impact",             desc: "Du får et login til vores platform, hvor du kan se præcis hvor dine træer står." },
];

const CALCULATIONS = [
  { icon: "📊", title: "13 tons CO₂", desc: "Gennemsnitlig dansker udleder 13 tons CO₂ / år" },
  { icon: "🌳", title: "100 kg CO₂",  desc: "Ét træ lagrer konservativt 100 kg CO₂ over sin levetid" },
  { icon: "🎯", title: "130 træer",   desc: "130 træer ≈ 13 tons CO₂ = carbon neutral" },
];

// ── Styles ─────────────────────────────────────────────────────
const CSS = `
  :root {
    --green-dark:  #065f46;
    --green-mid:   #10b981;
    --green-bg:    #f8fafc;
    --text-dark:   #0f172a;
    --text-mid:    #374151;
    --text-muted:  #6b7280;
    --border:      #e5e7eb;
    --white:       #ffffff;
    --radius-lg:   20px;
    --radius-pill: 50px;
    --shadow-md:   0 10px 40px rgba(0,0,0,0.08);
    --shadow-lg:   0 24px 60px rgba(0,0,0,0.14);
    --grad:        linear-gradient(135deg, #10b981, #065f46);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ts-page {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 17px; line-height: 1.7; color: var(--text-dark); background: var(--white);
  }

  /* HERO */
  .ts-hero {
    position: relative; min-height: 92vh;
    display: flex; align-items: center; justify-content: center;
    text-align: center; padding: 80px 20px 60px;
    background-size: cover; background-position: center 35%; overflow: hidden;
  }
  .ts-hero::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.32); }
  .ts-hero-content { position: relative; z-index: 2; max-width: 860px; margin: 0 auto; }
  .ts-hero h1 {
    font-size: clamp(1.8rem, 4.5vw, 3.2rem); font-weight: 800; color: white;
    line-height: 1.15; margin-bottom: 16px; text-shadow: 0 2px 12px rgba(0,0,0,0.55);
  }
  .ts-hero-sub {
    font-size: clamp(1rem, 2.5vw, 1.4rem); color: white; font-weight: 500;
    margin-bottom: 36px; text-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: inline-block; border-bottom: 2px solid var(--green-mid); padding-bottom: 10px;
  }
  .ts-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .ts-hero-btn {
    padding: 14px 26px; border-radius: var(--radius-pill);
    background: rgba(255,255,255,0.15); color: white; font-weight: 600; font-size: 1rem;
    text-decoration: none; border: 1px solid rgba(255,255,255,0.35);
    backdrop-filter: blur(6px); transition: all 0.25s ease;
  }
  .ts-hero-btn:hover { background: rgba(255,255,255,0.28); transform: translateY(-2px); }

  /* SECTIONS */
  .ts-section      { padding: 80px 20px; }
  .ts-section-gray { background: var(--green-bg); }
  .ts-container    { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .ts-container-narrow { max-width: 860px; margin: 0 auto; padding: 0 24px; }
  .ts-section-title {
    font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700;
    color: var(--green-dark); margin-bottom: 1rem;
  }
  .ts-section-sub { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 2.5rem; }

  /* INTRO */
  .ts-intro p { font-size: 1.05rem; color: var(--text-mid); line-height: 1.8; margin-bottom: 1.2rem; }
  .ts-intro strong { color: var(--green-dark); }
  .ts-intro em { font-style: italic; color: var(--green-dark); font-weight: 600; }

  /* STEPS */
  .ts-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; margin-top: 48px; text-align: center; }
  .ts-step-num {
    width: 72px; height: 72px; background: var(--grad); color: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; font-weight: 700; margin: 0 auto 20px;
    box-shadow: 0 8px 24px rgba(16,185,129,0.3);
  }
  .ts-step-title { font-size: 1.2rem; font-weight: 700; color: var(--green-dark); margin-bottom: 8px; }
  .ts-step-desc  { color: var(--text-mid); line-height: 1.7; }

  /* IMAGE SECTION */
  .ts-img-section {
    position: relative; min-height: 420px; display: flex; align-items: center;
    padding: 80px 20px; background-size: cover; background-position: center;
    background-attachment: fixed; color: white;
  }
  .ts-img-section::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
  .ts-img-section .ts-container { position: relative; z-index: 2; text-align: center; }
  .ts-img-section h2 { color: white; font-size: clamp(1.6rem,4vw,2.6rem); margin-bottom: 1rem; font-weight: 700; }
  .ts-img-section p  { font-size: 1.15rem; line-height: 1.7; max-width: 700px; margin: 0 auto; }

  /* CALC CARDS */
  .ts-calc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin: 40px 0; }
  .ts-calc-card {
    background: white; padding: 32px 24px; border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md); text-align: center; transition: transform 0.3s ease;
  }
  .ts-calc-card:hover { transform: translateY(-6px); }
  .ts-calc-icon  { font-size: 2.5rem; margin-bottom: 12px; }
  .ts-calc-title { font-size: 1.2rem; font-weight: 700; color: var(--green-dark); margin-bottom: 8px; }
  .ts-calc-desc  { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }

  /* BINDING */
  .ts-binding-box {
    max-width: 900px; margin: 0 auto 32px; padding: 14px 20px;
    background: var(--green-bg); border: 1px solid var(--border); border-radius: 10px;
    font-size: 0.88rem; color: var(--text-mid); line-height: 1.6; text-align: center;
  }
  .ts-binding-box strong { color: var(--green-dark); }

  /* PRICING TOGGLE */
  .ts-pricing-header { text-align: center; max-width: 700px; margin: 0 auto 48px; }
  .ts-toggle-wrap {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; margin-top: 20px; font-size: 1rem; font-weight: 600;
  }
  .ts-toggle-label { color: var(--text-muted); transition: color 0.2s; }
  .ts-toggle-label.active { color: var(--green-dark); }
  .ts-switch { position: relative; width: 52px; height: 28px; flex-shrink: 0; }
  .ts-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
  .ts-slider {
    position: absolute; inset: 0; background: var(--border);
    border-radius: 50px; cursor: pointer; transition: background 0.3s;
  }
  .ts-slider::before {
    content: ''; position: absolute; width: 22px; height: 22px;
    left: 3px; top: 3px; background: white; border-radius: 50%;
    transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }
  .ts-switch input:checked + .ts-slider { background: var(--green-mid); }
  .ts-switch input:checked + .ts-slider::before { transform: translateX(24px); }
  .ts-save-badge {
    display: inline-block; background: var(--grad); color: white;
    padding: 2px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; margin-left: 6px;
  }

  /* PRICING GRID */
  .ts-pricing-grid   { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; margin-bottom: 22px; }
  .ts-pricing-bottom { display: grid; grid-template-columns: repeat(2,1fr); gap: 22px; }

  .ts-card {
    background: white; border-radius: var(--radius-lg); padding: 28px 22px;
    box-shadow: var(--shadow-md); border: 2px solid transparent;
    display: flex; flex-direction: column; transition: all 0.35s ease;
  }
  .ts-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-lg); border-color: var(--green-mid); }
  .ts-card.featured { border-color: var(--green-mid); box-shadow: 0 14px 50px rgba(16,185,129,0.18); }

  .ts-card-header   { text-align: center; margin-bottom: 20px; }
  .ts-card-icon     { font-size: 2.6rem; margin-bottom: 10px; }
  .ts-card-title    { font-size: 1.15rem; font-weight: 700; color: var(--green-dark); margin-bottom: 4px; }
  .ts-card-subtitle { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }

  .ts-card-features { list-style: none; padding: 0; margin: 0 0 20px; flex-grow: 1; }
  .ts-card-features li {
    position: relative; padding-left: 28px; margin-bottom: 10px;
    font-size: 0.92rem; color: var(--text-mid); line-height: 1.5;
  }
  .ts-card-features li::before {
    content: "✓"; position: absolute; left: 0;
    color: var(--green-mid); font-size: 1.1rem; font-weight: 800;
  }
  .ts-card-pricing {
    background: var(--green-bg); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; margin-top: auto;
  }
  .ts-price-row    { display: flex; flex-direction: column; gap: 4px; }
  .ts-price-label  { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .ts-price-amount { font-size: 1.3rem; font-weight: 700; color: var(--green-dark); }
  .ts-price-detail { font-size: 0.82rem; color: #9ca3af; margin-top: 2px; }
  .ts-btn-small {
    display: block; width: 100%; padding: 11px 16px; margin-top: 10px;
    border-radius: var(--radius-pill); background: var(--grad); color: white;
    font-weight: 700; font-size: 0.88rem; text-align: center; text-decoration: none;
    border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    transition: all 0.25s ease;
  }
  .ts-btn-small:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,185,129,0.4); }

  .ts-disclaimer {
    text-align: center; font-size: 0.88rem; color: var(--text-muted);
    margin: 32px auto 0; padding-top: 20px; border-top: 1px solid var(--border);
    max-width: 800px; line-height: 1.6;
  }
  .ts-disclaimer strong { color: var(--green-dark); }

  /* LOADING / ERROR */
  .ts-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 260px; font-size: 1rem; color: var(--text-muted); gap: 12px;
  }
  .ts-spinner {
    width: 28px; height: 28px; border: 3px solid var(--border);
    border-top-color: var(--green-mid); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ts-error { text-align: center; padding: 40px 20px; color: #dc2626; font-size: 1rem; }

  /* CTA */
  .ts-cta {
    padding: 90px 20px;
    background: linear-gradient(135deg, #065f46 0%, #14532d 100%);
    color: white; text-align: center;
  }
  .ts-cta h2 { color: white; font-size: clamp(1.6rem,3.5vw,2.4rem); margin-bottom: 1rem; }
  .ts-cta p  { font-size: 1.1rem; opacity: 0.92; max-width: 680px; margin: 0 auto 2.5rem; line-height: 1.7; }
  .ts-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .ts-btn-white {
    padding: 15px 38px; background: white; color: var(--green-dark);
    border-radius: var(--radius-pill); font-weight: 700; font-size: 1rem;
    text-decoration: none; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    transition: all 0.3s ease; border: none; cursor: pointer;
  }
  .ts-btn-white:hover { transform: translateY(-3px); }
  .ts-btn-outline {
    padding: 15px 38px; background: transparent; color: white;
    border-radius: var(--radius-pill); font-weight: 700; font-size: 1rem;
    text-decoration: none; border: 2px solid rgba(255,255,255,0.6); transition: all 0.3s ease;
  }
  .ts-btn-outline:hover { background: white; color: var(--green-dark); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .ts-pricing-grid   { grid-template-columns: repeat(2,1fr); }
    .ts-pricing-bottom { grid-template-columns: 1fr; }
    .ts-steps          { grid-template-columns: 1fr; gap: 28px; }
    .ts-calc-grid      { grid-template-columns: 1fr; gap: 16px; }
  }
  @media (max-width: 600px) {
    .ts-pricing-grid { grid-template-columns: 1fr; }
    .ts-section      { padding: 56px 16px; }
    .ts-container    { padding: 0 16px; }
    .ts-img-section  { background-attachment: scroll; }
    .ts-cta-btns     { flex-direction: column; align-items: stretch; }
    .ts-btn-white, .ts-btn-outline { text-align: center; }
  }
`;

// ── Main component ─────────────────────────────────────────────
export default function Home() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [yearly, setYearly]   = useState(false);
  const pricingRef = useRef(null);

  // Hent prisdata fra backend
  useEffect(() => {
    fetch("http://localhost:5106/api/plans")
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente abonnementer");
        return res.json();
      })
      .then((data) => { setPlans(data); setLoading(false); })
      .catch((err)  => { setError(err.message); setLoading(false); });
  }, []);

  // Scroll til #pakker ved sideload
  useEffect(() => {
    if (window.location.hash === "#pakker") {
      setTimeout(() => pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="ts-page">

        {/* ── HERO ── */}
        <section
          className="ts-hero"
          style={{ backgroundImage: "url('https://www.treesy.dk/wp-content/uploads/2026/03/Pakker-hero-scaled.webp')" }}
        >
          <div className="ts-hero-content">
            <h1>Gør det nemt, billigt og gennemskueligt</h1>
            <span className="ts-hero-sub">at blive carbon positiv gennem træplantning i Tanzania</span>
            <div className="ts-hero-btns">
              <a href="#pakker" className="ts-hero-btn">🌱 Køb abonnement (Privat)</a>
              <a href="/business/#seed-pakker" className="ts-hero-btn">🏢 Køb seed credits (Business)</a>
            </div>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="ts-section">
          <div className="ts-container-narrow ts-intro">
            <h2 className="ts-section-title">Hvorfor skal jeg tage handling?</h2>
            <p>Uanset hvor meget vi sparer, har alle moderne mennesker et negativt aftryk på klima og biodiversitet gennem den strøm vi bruger, den mad vi spiser og den transport vi benytter.</p>
            <p><strong>Den gennemsnitlige dansker udleder ca. 13 tons CO₂ om året.</strong></p>
            <p>Ifølge CONCITO mener 88 % af danskerne, at klimaforandringer er et alvorligt problem. Men for mange føles klimahandling stadig uoverskueligt, dyrt, abstrakt og utroværdigt.</p>
            <p><strong>Hos Treesy har vi gjort det anderledes.</strong></p>
            <p>Vi har skabt en nem, billig og gennemskuelig måde at tage personlig klimahandling – ved at plante træer i Tanzania sammen med lokale partnere.</p>
            <p><em>Vi behøver ikke vente på politikerne.</em></p>
          </div>
        </section>

        {/* ── STEPS ── */}
        <section className="ts-section ts-section-gray">
          <div className="ts-container">
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
              <h2 className="ts-section-title">Sådan virker det – 3 enkle trin</h2>
              <p className="ts-section-sub">En enkel proces, der giver dig kontrol og gennemsigtighed</p>
            </div>
            <div className="ts-steps">
              {STEPS.map((s) => (
                <div key={s.num}>
                  <div className="ts-step-num">{s.num}</div>
                  <h3 className="ts-step-title">{s.title}</h3>
                  <p className="ts-step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMAGE SECTION ── */}
        <section
          className="ts-img-section"
          style={{ backgroundImage: "url('https://www.treesy.dk/wp-content/uploads/2026/03/Pakker-b-section-1.webp')" }}
        >
          <div className="ts-container">
            <h2>Gennemskuelig træplantning</h2>
            <p>Hvert enkelt træ er individuelt geotagget. Du kan se hvor dine træer står, og følge dem over tid.</p>
          </div>
        </section>

        {/* ── BEREGNINGER ── */}
        <section className="ts-section">
          <div className="ts-container">
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
              <h2 className="ts-section-title">Hvordan regner vi?</h2>
              <p className="ts-section-sub">Vi arbejder med konservative og gennemskuelige antagelser.</p>
            </div>
            <div className="ts-calc-grid">
              {CALCULATIONS.map((c) => (
                <div key={c.title} className="ts-calc-card">
                  <div className="ts-calc-icon">{c.icon}</div>
                  <div className="ts-calc-title">{c.title}</div>
                  <div className="ts-calc-desc">{c.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", maxWidth: 760, margin: "0 auto", color: "var(--text-mid)", fontSize: "1.05rem", lineHeight: 1.8 }}>
              Derfor svarer 130 træer om året til at bringe et gennemsnitligt dansk klimaaftryk i balance.
              Vil du give mere end du tager? Så kan du blive carbon positiv ved at plante flere træer.
            </p>
          </div>
        </section>

        {/* ── BINDING ── */}
        <section className="ts-section" style={{ paddingBottom: 0 }}>
          <div className="ts-container">
            <div className="ts-binding-box">
              <strong>12 måneders binding —</strong> Abonnementet løber i 12 måneder og fornyes automatisk,
              medmindre det opsiges inden udløbet af den aktuelle periode. Opsigelse sker via din konto.
            </div>
          </div>
        </section>

        {/* ── PRISPLANER ── */}
        <section className="ts-section" id="pakker" ref={pricingRef}>
          <div className="ts-container">

            <div className="ts-pricing-header">
              <h2 className="ts-section-title">Vælg din pakke</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>
                Find den løsning der passer til dine ambitioner
              </p>
              <div className="ts-toggle-wrap">
                <span className={`ts-toggle-label${!yearly ? " active" : ""}`}>Månedlig</span>
                <label className="ts-switch">
                  <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)} />
                  <span className="ts-slider" />
                </label>
                <span className={`ts-toggle-label${yearly ? " active" : ""}`}>
                  Årlig <span className="ts-save-badge">spar op til 20%</span>
                </span>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="ts-loading">
                <div className="ts-spinner" />
                <span>Henter pakker...</span>
              </div>
            )}

            {/* Fejl */}
            {error && (
              <div className="ts-error">
                ⚠️ {error} — tjek at din backend kører på port 5106.
              </div>
            )}

            {/* Prisplaner fra API */}
            {!loading && !error && (
              <>
                <div className="ts-pricing-grid">
                  {plans.slice(0, 3).map((plan) => (
                    <PricingCard key={plan.id} plan={plan} yearly={yearly} />
                  ))}
                </div>

                <div className="ts-pricing-bottom">
                  {plans[3] && <PricingCard plan={plans[3]} yearly={yearly} />}

                  {/* Custom løsning — statisk, hører ikke hjemme i API */}
                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-card-icon">🎯</div>
                      <h3 className="ts-card-title">Custom løsning</h3>
                      <p className="ts-card-subtitle">Skræddersyet løsning</p>
                    </div>
                    <ul className="ts-card-features">
                      <li>Vælg selv antal træer</li>
                      <li>Pris baseret på pakker</li>
                      <li>Skalerbar løsning</li>
                    </ul>
                    <div className="ts-card-pricing">
                      <div className="ts-price-row">
                        <span className="ts-price-label">Pris</span>
                        <span className="ts-price-amount">Kontakt os</span>
                        <span className="ts-price-detail">Vi finder den rette løsning</span>
                        <a href="/kontakt" className="ts-btn-small">Kontakt os for pris</a>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="ts-disclaimer">
                  <strong>*</strong> Den estimerede CO₂-kompensation er baseret på et årligt CO₂-fodaftryk
                  på <strong>13 tons</strong>, som er det gennemsnitlige for en dansk borger.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ts-cta">
          <div className="ts-container-narrow">
            <h2>Klar til at tage handling?</h2>
            <p>
              For at være klimaansvarlig kræver det ikke at man er perfekt.
              Men det kræver at man tager handling. Vælg din pakke og plant dig
              på den rette side af historien i dag.
            </p>
            <div className="ts-cta-btns">
              <a href="#pakker" className="ts-btn-white">Plant træer</a>
              <a href="/kontakt" className="ts-btn-outline">Kontakt os</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

// ── PricingCard ────────────────────────────────────────────────
// Forventer dette format fra GET /api/plans:
// {
//   id:            number
//   name:          string        — "Active Planter"
//   subtitle:      string        — "130 træer / år"
//   icon:          string        — "🌱"
//   featured:      boolean
//   features:      string[]      — liste af bullet-punkter
//   monthlyPrice:  string        — "160 kr"
//   monthlyDetail: string        — "14,80 kr / træ"
//   monthlyHref:   string        — "/checkout/?add-to-cart=1010"
//   yearlyPrice:   string        — "1.600 kr"
//   yearlyDetail:  string        — "12,31 kr / træ"
//   yearlyHref:    string        — "/checkout/?add-to-cart=1011"
// }
function PricingCard({ plan, yearly }) {
  const price = yearly
    ? `${plan.yearlyPrice} kr`
    : `${plan.monthlyPrice} kr`;

    const detail = yearly
    ? plan.yearlyDetail
    : plan.monthlyDetail;

  const label = yearly ? "Vælg årlig" : "Vælg månedlig";
  const period = yearly ? "Årligt" : "Månedligt";

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5106/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planId: plan.id,
          billing: yearly ? "yearly" : "monthly",
          email: "test@test.com" // 🔥 skift senere til rigtig bruger
        })
      });

      if (!res.ok) throw new Error("Checkout fejlede");

      const data = await res.json();

      // redirect til Stripe
      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      alert("Noget gik galt ved betaling");
    }
  };

  return (
    <div className={`ts-card${plan.featured ? " featured" : ""}`}>
      <div className="ts-card-header">
        <div className="ts-card-icon">{plan.icon}</div>
        <h3 className="ts-card-title">{plan.name}</h3>
        <p className="ts-card-subtitle">{plan.subtitle}</p>
      </div>

      <ul className="ts-card-features">
        {plan.features?.map((f) => <li key={f}>{f}</li>)}
      </ul>

      <div className="ts-card-pricing">
        <div className="ts-price-row">
          <span className="ts-price-label">{period}</span>
          <span className="ts-price-amount">{price}</span>

          {/* Simpel detail tekst */}
           <span className="ts-price-detail">
            {detail}
          </span>

          <button className="ts-btn-small" onClick={handleCheckout}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}