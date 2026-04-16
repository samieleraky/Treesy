import { useEffect, useState, useRef } from "react";
import '../styles/styles.css';
import {Link} from "react-router-dom";
import API_BASE_URL from '../config';

// ── Static content (skifter aldrig — hører ikke hjemme i API) ─
const STEPS = [
  { num: "1", title: "Vælg din pakke", desc: "Find den løsning, der matcher dit ambitionsniveau." },
  { num: "2", title: "Vi planter træerne for dig", desc: "Træerne plantes, passes og monitoreres med lokale partnere." },
  { num: "3", title: "Følg dit impact", desc: "Du får et login til vores platform, hvor du kan se præcis hvor dine træer står." },
];

const CALCULATIONS = [
  { icon: "📊", title: "13 tons CO₂", desc: "Gennemsnitlig dansker udleder 13 tons CO₂ / år" },
  { icon: "🌳", title: "100 kg CO₂", desc: "Ét træ lagrer konservativt 100 kg CO₂ over sin levetid" },
  { icon: "🎯", title: "130 træer", desc: "130 træer ≈ 13 tons CO₂ = carbon neutral" },
];

// ── Main component ─────────────────────────────────────────────
export default function Home() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearly, setYearly] = useState(false);
  const pricingRef = useRef(null);

  // Hent prisdata fra backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/plans`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente abonnementer");
        return res.json();
      })
      .then((data) => { console.log("PLANS FROM API:", data); setPlans(data); setLoading(false); })


      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  // Scroll til #pakker ved sideload
  useEffect(() => {
    if (window.location.hash === "#pakker") {
      setTimeout(() => pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, []);

  return (
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
            <Link to="/erhverv#seed-pakker" className="ts-hero-btn">🏢 Køb seed credits (Business)</Link>
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

   {/* ── BINDING ── */}
      <section className="ts-section" style={{ paddingBottom: 0 }}>
        <div className="ts-container">
          <div className="ts-binding-box">
            <strong>12 måneders binding —</strong> Abonnementet løber i 12 måneder og fornyes automatisk,
            medmindre det opsiges inden udløbet af den aktuelle periode. Opsigelse sker via din konto.
          </div>
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
  );
}


// ── PricingCard Komponent ────────────────────────────────────────────────
function PricingCard({ plan, yearly }) {
  const price = yearly ? `${plan.yearlyPrice} kr` : `${plan.monthlyPrice} kr`;
  const detail = yearly ? plan.yearlyDetail : plan.monthlyDetail;
  const label = yearly ? "Vælg årlig" : "Vælg månedlig";
  const period = yearly ? "Årligt" : "Månedligt";

  

  const handleCheckout = async () => { console.log("plan.id:", plan.id);
    try {
        const res = await fetch(`${API_BASE_URL}/api/payments/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                planId: plan.id,                          // ← direkte fra API
                billing: yearly ? "yearly" : "monthly",
                email: "test@test.com"
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend fejl:", errorText);
            throw new Error(`Checkout fejlede: ${res.status}`);
        }

        const data = await res.json();
        window.location.href = data.url;

    } catch (err) {
        console.error(err);
        alert("Noget gik galt ved betaling: " + err.message);
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
          <span className="ts-price-detail">{detail}</span>
          <button className="ts-btn-small" onClick={handleCheckout}>
            {label}
          </button>
        </div>
      </div>
    </div>


  );
}


