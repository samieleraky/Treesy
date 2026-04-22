import React from "react";
import '../styles/styles.css';

export default function Metoder() {
  return (
    <div className="ts-page">

      {/* HERO */}
      <section
        className="ts-hero"
        style={{
          backgroundImage:
            "url('https://www.treesy.dk/wp-content/uploads/2026/03/Metoder-hero.webp')",
        }}
      >
        <div className="ts-hero-content">
          <h1>Metoder med dokumenteret effekt</h1>
          <p className="ts-hero-sub">
            Vi planter ikke træer som symbolik, men som langsigtet, målbar klimahandling med fokus på biodiversitet og lokale samfund
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="ts-section ts-section-gray">
        <div className="ts-container">
          <div className="ts-container-narrow" style={{ textAlign: "center" }}>
            <h2 className="ts-section-title">
              Fra frø til skov – processen trin for trin
            </h2>
          </div>

          <div className="ts-steps">

            <div>
              <div className="ts-step-num">1</div>
              <h3 className="ts-step-title">
                Frø opfostres i lokale nurseries
              </h3>
              <p className="ts-step-desc">
                Alle træer starter deres liv i lokale planteskoler i Tanzania.
              </p>
            </div>

            <div>
              <div className="ts-step-num">2</div>
              <h3 className="ts-step-title">
                Udplantning i dedikerede områder
              </h3>
              <p className="ts-step-desc">
                Træerne plantes i nøje udvalgte områder med fokus på jord og lokalsamfund.
              </p>
            </div>

            <div>
              <div className="ts-step-num">3</div>
              <h3 className="ts-step-title">
                Pleje, monitorering og genplantning
              </h3>
              <p className="ts-step-desc">
                Træerne bliver monitoreret og genplantet hvis nødvendigt.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section
        className="ts-img-section"
        style={{
          backgroundImage:
            "url('https://www.treesy.dk/wp-content/uploads/2026/03/Metoder-b-section-1-1.webp')",
        }}
      >
        <div className="ts-container">
          <h2>Varierede skovsystemer</h2>
          <p>
            Vi planter ikke monokulturer, men skaber levende, modstandsdygtige skove med plads til biodiversitet.
          </p>
        </div>
      </section>

      {/* TREE DISTRIBUTION */}
      <section className="ts-section ts-section-gray">
        <div className="ts-container">
          <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
            <h2 className="ts-section-title">
              Tre hovedgrupper af træer – balance frem for plantager
            </h2>
            <p className="ts-section-sub">
              For at sikre både klimaeffekt, biodiversitet og lokal værdi planter vi træerne i følgende fordeling:
            </p>
          </div>

          <div className="ts-calc-grid">

            <div className="ts-calc-card">
              <div className="ts-calc-icon">🌳</div>
              <h3 className="ts-calc-title">1/3 canopy trees</h3>
              <p className="ts-calc-desc">
                Opbygger biomasse, lagrer CO₂ og skaber stabilitet i skoven.
              </p>
            </div>

            <div className="ts-calc-card">
              <div className="ts-calc-icon">🌿</div>
              <h3 className="ts-calc-title">1/3 biodiversitet</h3>
              <p className="ts-calc-desc">
                Understøtter økosystemer og styrker biodiversiteten.
              </p>
            </div>

            <div className="ts-calc-card">
              <div className="ts-calc-icon">🍊</div>
              <h3 className="ts-calc-title">1/3 frugttræer</h3>
              <p className="ts-calc-desc">
                Skaber lokal økonomisk værdi og incitament til beskyttelse.
              </p>
            </div>

          </div>
        </div>
      </section>

{/* VIDEO */}
<section className="ts-section">
  <div className="ts-container">
   
    <div className="ts-video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/m4P17KAVl1Y"
        title="Treesy metode video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</section>
      

      {/* SPECIES */}
    <section className="ts-section ts-section-gray">
        <div className="ts-container">
          <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <h2
        className="ts-section-title"
        style={{ marginBottom: "1rem", textAlign: "center" }}
      >
        De træarter vi planter
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: "1.1rem",
          color: "#4b5563",
          marginBottom: "3rem",
        }}
      >
        Treesy planter en bred vifte af træarter for at understøtte både klima, biodiversitet og lokale behov.
      </p>

      <div className="species-list">
        <div className="species-item">Acrocupus fluxinfollious <span className="species-type">N</span></div>
        <div className="species-item">Albizia gummifera <span className="species-type">N</span></div>
        <div className="species-item">Cassia spectabilis <span className="species-type">N</span></div>
        <div className="species-item">Cupressus lusitanica <span className="species-type">E</span></div>
        <div className="species-item">Ficus sycomorus <span className="species-type">N</span></div>
        <div className="species-item">Ficus sur <span className="species-type">N</span></div>
        <div className="species-item">Grevillea robusta <span className="species-type">E</span></div>
        <div className="species-item">Leucaena leucocephala <span className="species-type">N</span></div>
        <div className="species-item">Markhamia lutea <span className="species-type">N</span></div>
        <div className="species-item">Newtonia buchananii <span className="species-type">N</span></div>
        <div className="species-item">Persea americana (avocado) <span className="species-type">E</span></div>
        <div className="species-item">Rauvolfia caffra <span className="species-type">N</span></div>
        <div className="species-item">Syzygium guineense <span className="species-type">N</span></div>
        <div className="species-item">Tabernaemontana stapfiana <span className="species-type">N</span></div>
        <div className="species-item">Bridelia micrantha <span className="species-type">N</span></div>
        <div className="species-item">Cordia africana <span className="species-type">N</span></div>
        <div className="species-item">Croton megalocarpus <span className="species-type">E</span></div>
        <div className="species-item">Entada gigas <span className="species-type">N</span></div>
        <div className="species-item">Podocarpus usambarensis <span className="species-type">N</span></div>
        <div className="species-item">Syzygium cumini <span className="species-type">N</span></div>
        <div className="species-item">Prunus africana <span className="species-type">N</span></div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          <strong>N</strong> = hjemmehørende / native &nbsp;|&nbsp;{" "}
          <strong>E</strong> = ikke-hjemmehørende, men ikke-invasiv
        </p>

        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.9rem",
            color: "#9ca3af",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Artslisten opdateres løbende i takt med nye plantninger.
        </p>
      </div>

    </div>
  </div>
</section>
      {/* GEO TAGGING */}
      <section
        className="ts-img-section"
        style={{
          backgroundImage:
            "url('https://www.treesy.dk/wp-content/uploads/2026/03/Metoder-b-section-2.webp')",
        }}
      >
        <div className="ts-container">
          <h2>Hvert træ er individuelt registreret</h2>
          <p>
            Alle træer er geo-tagget med GPS og kan følges over tid.
          </p>
        </div>
      </section>

      {/* WHY TANZANIA */}
       <section className="ts-section">
        <div className="ts-container ts-container-narrow">
          <h2 className="ts-section-title" style={{ textAlign: "center" }}>
        Hvorfor planter vi i Tanzania?</h2>

    <div className="values-grid">

      <div className="value-card">
        <div className="value-icon">🌍</div>
        <h3 className="value-title">Hurtigere vækst og højere potentiale</h3>

        <div className="value-description">
          <p><strong>Træer i tropisk klima:</strong></p>

          <ul className="ts-list">
            <li>Vokser hurtigere</li>
            <li>Opbygger ofte mere biomasse</li>
            <li>Kan derfor optage mere CO₂ over tid</li>
          </ul>
        </div>
      </div>

      <div className="value-card">
        <div className="value-icon">💰</div>
        <h3 className="value-title">Mere impact per krone</h3>

        <div className="value-description">
          <p>Træplantning er billigere pr. træ end i Europa, hvilket betyder:</p>

          <ul className="ts-list">
            <li>Flere træer</li>
            <li>Større samlet impact</li>
            <li>Bedre udnyttelse af din klimahandling</li>
          </ul>
        </div>
      </div>

      <div className="value-card">
        <div className="value-icon">🛖</div>
        <h3 className="value-title">Social impact</h3>

        <div className="value-description">
          <p>Vi styrker økonomien og levevilkårene i det globale syd:</p>

         <ul className="ts-list">
            <li>Skaber lokale arbejdspladser</li>
            <li>Giver adgang til frugt og forbedret jord</li>
            <li>Styrker lokalsamfund økonomisk og miljømæssigt</li>
          </ul>
        </div>
      </div>

      <div className="value-card">
        <div className="value-icon">🤝</div>
        <h3 className="value-title">Lokal tilstedeværelse og ansvar</h3>

        <div className="value-description">
          <p>En af Treesys medejere bor i Tanzania. Det betyder, at vi:</p>

          <ul className="ts-list">
            <li>Selv er på jorden</li>
            <li>Deltager i plantning og monitorering</li>
            <li>Har direkte dialog med vores partnere</li>
          </ul>

          <p style={{ marginTop: "14px", fontWeight: 600, color: "#065f46" }}>
            I stedet prioriterer vi gennemsigtighed, dokumentation og fysisk tilstedeværelse.
          </p>
        </div>
      </div>

    </div>
  </div>
      </section>

      {/* CO2 */}
      <section className="ts-section">
        <div className="ts-container ts-container-narrow">
          <h2 className="ts-section-title" style={{ textAlign: "center" }}>
            Hvad er carbon, CO₂ og CO₂e?
          </h2>

          <div className="ts-intro">
            <p><strong>Carbon (kulstof):</strong> Et grundstof, som er byggestenen i alt levende materiale – herunder træer.</p>
            <p><strong>CO₂ (kuldioxid):</strong> En gas, der opstår, når carbon bindes med ilt. Det er CO₂, træer optager gennem fotosyntese.</p>
            <p><strong>CO₂e (CO₂-ækvivalenter):</strong> En måleenhed, der samler alle drivhusgasser (fx metan og lattergas) i én fælles størrelse.</p>
          </div>
        </div>
      </section>

      {/* CALC */}
      <section className="ts-section"> </section>
     <section className="ts-section">
        <div className="ts-container ts-container-narrow">
          <h2 className="ts-section-title" style={{ textAlign: "center" }}>
        Hvordan regner vi? (konservativ tilgang)</h2>
          
          <div className="how-we-calc-card">
            <h3 className="calc-card-heading">Vores beregninger</h3>
            <p className="calc-intro">Vores estimater er baseret på:</p>
            
            <ul className="calc-list">
              <li>
                <span className="check-icon">✓</span>
                Forbrugsbaserede gennemsnitstal fra CONCITO (ca. 13 tons CO₂e pr. dansker pr. år)
              </li>
              <li>
                <span className="check-icon">✓</span>
                Konservative antagelser om træers CO₂-optag
              </li>
            </ul>
            
            <div className="calc-highlight">
              <p className="highlight-text">
                Vi anvender et forsigtigt gennemsnit på <strong>100 kg CO₂ pr. træ</strong> over dets levetid.
              </p>
            </div>
            
            <p className="calc-note">
              Mange træarter – særligt i tropisk klima – forventes at optage mere. 
              Vi har bevidst valgt at regne konservativt, fordi vi hellere vil plante 
              to træer for meget end ét for lidt.
            </p>
          </div>
        </div>
    </section>


      {/* CTA */}
      <section className="ts-cta">
        <div className="ts-container-narrow">
          <h2>Klar til at plante træer?</h2>
          <p>
            Vælg en pakke og bliv en del af vores mission om at skabe levende skove.
          </p>

          <div className="ts-cta-btns">
            <a href="/#pakker" className="ts-btn-white">
              Plant træer
            </a>
            <a href="/kontakt" className="ts-btn-outline">
              Kontakt os
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}