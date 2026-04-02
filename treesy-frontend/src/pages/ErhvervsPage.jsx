import React from 'react';
import '../styles/styles.css';


const handleSeedCheckout = async (planId) => {
  try {
    const res = await fetch("http://localhost:5106/api/payments/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId,
        billing: "onetime",
        email: ""  // eller indfang e-mail hvis du vil
      })
    });

    if (!res.ok) throw new Error(`Checkout fejlede: ${res.status}`);
    const data = await res.json();
    window.location.href = data.url;
  } catch (err) {
    console.error(err);
    alert("Noget gik galt ved betaling: " + err.message);
  }
};

const ErhvervsPage = () => {
  return (
    <div className="ts-page">
      {/* Hero Section */}
      <section 
        className="ts-hero" 
        style={{ 
          backgroundImage: "url('https://www-static.treesy.dk/wp-content/uploads/2026/03/Treesy_1.4-1-1.webp')" 
        }}
      >
        <div className="ts-hero-content">
          <h1>Gør klimahandling til en del af jeres forretning</h1>
          <p className="ts-hero-sub">Nemt, billigt og gennemskueligt</p>
        </div>
      </section>

{/* Erhverv Intro med Challenges */}
<section className="ts-section ts-section-gray">
        <div className="ts-container-narrow">
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#374151', marginBottom: '1.5rem' }}>
        Plant træer med jeres kunder, medarbejdere eller produkter, og skab dokumenterbar impact for både klima, biodiversitet og lokalsamfund.
      </p>
      <ul className="button-list no-bullets">
        <li><a href="/kontakt" className="btn">Book et møde</a></li>
        <li><a href="#seed-pakker" className="btn">Se priser</a></li>
      </ul>
    </div>
  </div>
</section>



      {/* Image Section 1 */}
      <section 
        className="ts-img-section" 
        style={{ 
          backgroundImage: "url('https://www.treesy.dk/wp-content/uploads/2026/03/Erhverv-hero-b-section-1.webp')" 
        }}
      >
        <div className="ts-container">
          <h2>Konkrete handlinger, ikke abstrakte mål</h2>
        </div>
      </section>

      {/* Climate Action Section */}
      <section className="ts-section ts-section-gray">
        <div className="ts-container-narrow">
          <p className="ts-intro" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Klimahandling er ikke længere kun et værdistatement, det er en konkurrencefordel.
          </p>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Globalt er forbrugere villige til at betale <strong style={{ color: '#065f46' }}>9,7 %</strong> over gennemsnitsprisen for bæredygtigt producerede varer.
          </p>
          
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Kilde:{' '}
            <a 
              href="https://www.pwc.com/gx/en/issues/c-suite-insights/voice-of-the-consumer-survey/2024.html" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#10b981', textDecoration: 'underline' }}
            >
              PwC Voice of the Consumer Survey 2024
            </a>
          </p>
        </div>
      </section>

      {/* Why Businesses Choose Treesy */}
      <section className="ts-section">
        <div className="ts-container">
          <h2 className="ts-section-title" style={{ textAlign: 'center' }}>
            Hvorfor virksomheder vælger Treesy
          </h2>
          
          <div style={{ 
            background: 'white', 
            padding: '50px', 
            borderRadius: '24px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)' 
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Virksomheder vælger Treesy fordi vi tilbyder:
            </p>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                'Konkrete handlinger – ikke abstrakte klimamål',
                'Fuld transparens – hvert træ er geotagget',
                'Skalerbarhed – jo flere træer, jo billigere pr. træ',
                'Social impact – lokal beskæftigelse og biodiversitet',
                'Lav administrativ byrde – vi klarer det praktiske'
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <span style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>✓</span>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#374151' }}>{item}</p>
                </div>
              ))}
            </div>
            
            <div style={{ 
              background: '#f0fdf4', 
              padding: '24px', 
              borderRadius: '16px', 
              borderLeft: '4px solid #10b981', 
              marginTop: '2rem' 
            }}>
              <p style={{ margin: 0, color: '#065f46', fontWeight: '600' }}>
                Vi hjælper jer med at omsætte klimaansvar til noget, der er let at forklare, let at kommunikere og let at stå inde for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section 2 */}
      <section 
        className="ts-img-section" 
        style={{ 
          backgroundImage: "url('https://www.treesy.dk/wp-content/uploads/2026/03/Erhverv-b-section-2.webp')" 
        }}
      >
        <div className="ts-container">
          <h2>Fuld gennemsigtighed</h2>
          <p>Hvert træ er geotagget og kan følges over tid</p>
        </div>
      </section>

      {/* Choose Your Model Section */}
      <section className="ts-section ts-section-gray">
        <div className="ts-container">
          <h2 className="ts-section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            Vælg den model, der passer til jeres virksomhed
          </h2>
          
          {businessModels.map((model, index) => (
            <div key={index} style={{ 
              background: 'white', 
              padding: '50px', 
              borderRadius: '24px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
              marginBottom: '40px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem' }}>{model.icon}</span>
                <h3 style={{ color: '#065f46', fontSize: '1.8rem', margin: 0 }}>{model.title}</h3>
              </div>
              
              <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>{model.description}</p>
              
              {model.bullets && (
                <>
                  <p style={{ fontSize: '1.05rem', marginBottom: '1rem' }}><strong>{model.bulletsLabel}</strong></p>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                    {model.bullets.map((bullet, i) => (
                      <li key={i} style={{ position: 'relative', paddingLeft: '32px', marginBottom: '0.75rem', color: '#374151' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#10b981', fontSize: '1.3rem', fontWeight: '700' }}>✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {model.suitableFor && (
                <p style={{ fontSize: '1.05rem', color: '#4b5563' }}>
                  <strong>{model.suitableForLabel}:</strong> {model.suitableFor}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Image Section 3 */}
      <section 
        className="ts-img-section" 
        style={{ 
          backgroundImage: "url('https://www.treesy.dk/wp-content/uploads/2026/03/Erhverv-b-section-3.webp')" 
        }}
      >
        <div className="ts-container">
          <h2>Skalerbar løsning</h2>
          <p>Jo flere træer, jo lavere pris pr. træ</p>
        </div>
      </section>

      {/* Pricing Structure Section */}
      <section className="ts-section ts-section-gray">
        <div className="ts-container-narrow">
          <h2 className="ts-section-title" style={{ textAlign: 'center' }}>
            Prisstruktur – enkel, transparent og skalerbar
          </h2>
          
          <div style={{ 
            background: 'white', 
            padding: '50px', 
            borderRadius: '24px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)' 
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              Vores prisstruktur følger samme logik som for private:
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {pricingBullets.map((bullet, index) => (
                <li key={index} style={{ position: 'relative', paddingLeft: '32px', marginBottom: '1rem', fontSize: '1.05rem', color: '#374151' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#10b981', fontSize: '1.3rem', fontWeight: '700' }}>✓</span>
                  {bullet}
                </li>
              ))}
            </ul>
            
            <div style={{ 
              background: '#f0fdf4', 
              padding: '24px', 
              borderRadius: '16px', 
              borderLeft: '4px solid #10b981', 
              textAlign: 'center' 
            }}>
              <p style={{ margin: 0, color: '#065f46', fontWeight: '600' }}>
                Vi sammensætter altid en løsning, der matcher jeres behov og budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Pricing Table */}
      <section className="ts-section">
        <div className="ts-container">
          <h2 className="ts-section-title" style={{ textAlign: 'center' }}>Betal måned for måned</h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pay-as-you-grow</p>
          <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#6b7280', marginBottom: '3rem' }}>
            Faktureres månedligt med 12 måneders binding.
          </p>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            padding: '40px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
            marginBottom: '40px' 
          }}>
            <h3 style={{ color: '#065f46', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>📆</span> Månedlig fakturering
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="pricing-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Træer pr. måned</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Pris pr. træ</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPricing.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>{item.trees}</td>
                      <td style={{ padding: '12px' }}><strong>{item.price}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seed Credits Section */}
          <h2 className="ts-section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Betal forud og spar penge</h2>
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', 
            borderRadius: '24px', 
            padding: '40px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
            border: '2px solid #10b981' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.5rem' }}>🌱</span>
              <h3 style={{ color: '#065f46', fontSize: '1.8rem', margin: 0 }}>Seed Credits</h3>
              <span style={{ background: '#10b981', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600' }}>
                Lås en lavere pris
              </span>
            </div>
            
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Forudbetal træer og opnå maksimal besparelse. Ideelt for virksomheder med likviditet og stabil volumen.
            </p>
            
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table className="pricing-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Forudbetalte træer</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Seed Credits Pakker</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Samlet pris</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Pris pr. træ</th>
                  </tr>
                </thead>
                <tbody>
                  {seedCredits.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>{item.trees}</td>
                      <td style={{ padding: '12px' }}><strong>{item.package}</strong></td>
                      <td style={{ padding: '12px' }}><strong>{item.totalPrice}</strong></td>
                      <td style={{ padding: '12px' }}><strong>{item.pricePerTree}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: '0 0 25px 0', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '15px' 
            }}>
              {seedBenefits.map((benefit, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#374151' }}>
                  <span style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: '700' }}>✓</span> {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Seed Credits Product Cards */}
      <div id="seed-pakker" className="seeds-products-wrapper" style={{ marginBottom: '100px' }}>
        <div className="ts-container">
          <h3 className="ts-section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Køb dine Seed Credits Pakker</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px' 
          }}>
            {seedProducts.map((product, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'white', 
                  borderRadius: '20px', 
                  padding: '30px', 
                  textAlign: 'center', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  border: product.popular ? '2px solid #10b981' : 'none',
                  position: product.popular ? 'relative' : 'static'
                }}
              >
                {product.popular && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-12px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    background: '#10b981', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: '50px', 
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    Mest populær
                  </span>
                )}
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{product.icon}</div>
                <h4 style={{ color: '#065f46', fontSize: '1.3rem', marginBottom: '1rem' }}>{product.name}</h4>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#065f46' }}>
                  {product.trees}
                  <small style={{ fontSize: '0.9rem', fontWeight: 'normal', display: 'block' }}>træer</small>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '1rem' }}>{product.price}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>{product.pricePerTree}</div>
                <button
  onClick={() => handleSeedCheckout(product.planId)}
  style={{
    display: 'inline-block',
    background: 'linear-gradient(135deg, #10b981, #065f46)',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  }}
>
  Køb nu
</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="ts-cta">
        <div className="ts-container">
          <h2>Klar til at gøre klimahandling konkret?</h2>
          <p>En kort samtale er ofte nok til at afdække potentialet.</p>
          <div className="ts-cta-btns">
            <a href="/kontakt" className="ts-btn-white">📞 Kontakt os</a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Data arrays for better maintainability
const businessModels = [
  {
    icon: '🌍',
    title: '1. Klimaberegning & kompensation',
    description: 'Vi hjælper jer med at:',
    bullets: [
      'Beregne jeres årlige CO₂e-aftryk (via specialiserede partnere)',
      'Kompensere det gennem træplantning',
      'Eller gå skridtet videre og blive carbon positive'
    ],
    bulletsLabel: 'Vi hjælper jer med at:',
    suitableFor: "SMV'er, konsulentvirksomheder, service- og tech-virksomheder",
    suitableForLabel: 'Velegnet til'
  },
  {
    icon: '👥',
    title: '2. Træer pr. medarbejder',
    description: 'Gør jeres medarbejdere carbon neutrale eller carbon positive.',
    bullets: ['10 medarbejdere × 130 træer = samme volumen som en Carbon Hero-pakke → samme lave pris pr. træ'],
    bulletsLabel: 'Eksempel:',
    suitableFor: 'Employer branding, onboarding-tiltag, fastholdelse og trivsel',
    suitableForLabel: 'Perfekt som'
  },
  {
    icon: '🛒',
    title: '3. Træer pr. solgt produkt eller service',
    description: 'Plant ét eller flere træer for hver webshop-ordre, booking eller solgt ydelse.',
    bullets: ['Live widget på jeres webshop', 'Tæller der viser antal plantede træer i realtid'],
    bulletsLabel: 'Mulighed for:',
    suitableFor: 'Webshops, abonnementsforretninger, brands med bæredygtigt fokus',
    suitableForLabel: 'Særligt relevant for'
  },
  {
    icon: '🎁',
    title: '4. Firmagaver & julegaver',
    description: 'Erstat fysiske gaver med carbon neutralitet det kommende år eller træplantning på vegne af medarbejderen.',
    bullets: ['Ikke samler støv', 'Ikke belaster klimaet', 'Men gør reel forskel'],
    bulletsLabel: 'En gave der:',
    suitableForLabel: '',
    suitableFor: ''
  },
  {
    icon: '✈️',
    title: '5. Rejsebureauer & transport',
    description: 'Gør rejser carbon neutrale eller carbon positive.',
    suitableFor: 'Rejsebureauer, oplevelsesudbydere, konferencer og events',
    suitableForLabel: 'Ideel løsning for'
  }
];

const pricingBullets = [
  'Starter fra kun 7,31 kr. pr. træ',
  'Jo flere træer, jo lavere pris pr. træ',
  'Volumenrabatter gælder på tværs af medarbejdere, produkter og perioder',
  'Ingen skjulte gebyrer'
];

const monthlyPricing = [
  { trees: '1–129', price: '20,00 kr' },
  { trees: '130–259', price: '12,31 kr' },
  { trees: '260–1299', price: '9,62 kr' },
  { trees: '1300–12999', price: '8,38 kr' },
  { trees: '13000+', price: '7,31 kr' }
];

const seedCredits = [
  { trees: '130', package: 'Active Planter', totalPrice: '1.600 kr', pricePerTree: '12,31 kr' },
  { trees: '260', package: 'Committed Planter', totalPrice: '2.500 kr', pricePerTree: '9,62 kr' },
  { trees: '1.300', package: 'Hero Planter', totalPrice: '10.900 kr', pricePerTree: '8,38 kr' },
  { trees: '13.000', package: 'Legend Planter', totalPrice: '95.000 kr', pricePerTree: '7,31 kr' }
];

const seedBenefits = [
  'Lås en lavere pris per træ',
  'Brug træerne i jeres eget tempo',
  'Gyldig i 24 måneder',
  'Mulighed for automatisk opfyldning'
];

const seedProducts = [
  { icon: '🌱', name: 'Active Planter', trees: '130', price: '1.600 kr', pricePerTree: '(12,31 kr/træ)', planId: 'active-planter-seed', popular: false },
  { icon: '🌳', name: 'Committed Planter', trees: '260', price: '2.500 kr', pricePerTree: '(9,62 kr/træ)', planId: 'committed-planter-seed', popular: true },
  { icon: '🌲', name: 'Hero Planter', trees: '1.300', price: '10.900 kr', pricePerTree: '(8,38 kr/træ)', planId: 'hero-planter-seed', popular: false },
  { icon: '🏆', name: 'Legend Planter', trees: '13.000', price: '95.000 kr', pricePerTree: '(7,31 kr/træ)', planId: 'legend-planter-seed', popular: false }
];

export default ErhvervsPage;