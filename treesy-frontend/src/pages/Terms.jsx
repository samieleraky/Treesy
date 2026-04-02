import React from 'react';
import '../styles/LegalPages.css';

const Terms = () => {
  return (
    <>
      {/* HERO */}
      <section className="legal-hero">
        <h1>Handelsbetingelser</h1>
        <p>Gældende for køb af abonnementer og ydelser hos Treesy ApS</p>
      </section>

      {/* CONTENT WRAPPER */}
      <div className="legal-content">
        {/* Intro */}
        <div className="legal-intro">
          <p>
            <strong>Gældende for Treesy ApS</strong><br />
            CVR: 46174062<br />
            Adresse: Jernbaneallé 12, 9300 Sæby, Danmark<br />
            E-mail: charlie@treesy.dk
          </p>

          <p>
            Disse handelsbetingelser gælder for køb af abonnementer og ydelser hos
            Treesy ApS ("Treesy").
          </p>
        </div>

        {/* 1 */}
        <section className="legal-section">
          <h3>1. Produktets karakter</h3>

          <p>
            Treesy tilbyder abonnementer og engangsløsninger, hvor kunden bidrager
            til træplantning i Tanzania gennem Treesys lokale samarbejdspartnere.
          </p>

          <p>Købet giver adgang til:</p>

          <ul>
            <li>plantning af et aftalt antal træer</li>
            <li>løbende monitorering</li>
            <li>adgang til digital visning af planteområder og geotaggede træer</li>
            <li>dokumentation i form af certifikat og/eller digital platform</li>
          </ul>

          <p>Treesy leverer en service og ikke et fysisk produkt.</p>
        </section>

        {/* 2 */}
        <section className="legal-section">
          <h3>2. Klimapåstande og forventninger</h3>

          <p>Treesys løsninger bygger på:</p>

          <ul>
            <li>gennemsnitlige estimater for danskernes CO₂e-udledning</li>
            <li>konservative antagelser om træers CO₂e-optag over tid</li>
          </ul>

          <p>
            Treesy kan ikke garantere, at en kunde bliver fuldt klima- eller
            CO₂-neutral, da:
          </p>

          <ul>
            <li>individuelle udledninger varierer</li>
            <li>biologiske processer er langsigtede og ikke lineære</li>
          </ul>

          <p>
            Begreber som "Carbon Neutral" og "Carbon Net-Positive" anvendes som
            vejledende betegnelser.
          </p>
        </section>

        {/* 3 */}
        <section className="legal-section">
          <h3>3. Træernes etablering og levetid</h3>

          <ul>
            <li>Træer plantes og passes i samarbejde med lokale partnere i Tanzania</li>
            <li>Træer optager CO₂e gradvist over mange år</li>
            <li>Et træ optager ikke 100 kg CO₂e på plantningsdagen</li>
          </ul>

          <p>
            Hvis træer går tabt pga. sygdom, brand eller ekstremt vejr,
            erstattes de – så vidt muligt – gennem genplantning.
          </p>
        </section>

        {/* 4 */}
        <section className="legal-section">
          <h3>4. Abonnementer og betaling</h3>

          <ul>
            <li>Abonnementer faktureres månedligt eller årligt forud</li>
            <li>Årlig betaling kan give rabat</li>
            <li>Priser er angivet i DKK og inkl. moms</li>
            <li>Abonnementet fortsætter, indtil det opsiges</li>
          </ul>
        </section>

        {/* 5 */}
        <section className="legal-section">
          <h3>5. Bindingsperiode</h3>
          <p>
            12 måneders binding: Abonnementet løber i 12 måneder ad gangen og fornyes automatisk, 
            medmindre det opsiges inden udløbet af den aktuelle periode. Opsigelse kan ske via din konto.
          </p>
        </section>

        {/* 6 */}
        <section className="legal-section">
          <h3>6. Opsigelse</h3>

          <ul>
            <li>Opsigelse: løbende måned + 1 måned</li>
            <li>Sker via login eller e-mail til charlie@treesy.dk</li>
            <li>Gennemførte plantninger refunderes ikke</li>
          </ul>
        </section>

        {/* 7 */}
        <section className="legal-section">
          <h3>7. Fortrydelsesret</h3>

          <p>
            Privatkunder har 14 dages fortrydelsesret jf. forbrugeraftaleloven,
            medmindre plantning er påbegyndt.
          </p>
        </section>

        {/* 8 */}
        <section className="legal-section">
          <h3>8. Force majeure</h3>

          <ul>
            <li>naturkatastrofer</li>
            <li>brand</li>
            <li>krig eller politisk uro</li>
            <li>pandemier</li>
            <li>myndighedsindgreb</li>
          </ul>
        </section>

        {/* 9 */}
        <section className="legal-section">
          <h3>9. Ansvarsbegrænsning</h3>

          <p>
            Treesy er ikke ansvarlig for indirekte tab.
            Ansvar er begrænset til det betalte beløb.
          </p>
        </section>

        {/* 10 */}
        <section className="legal-section">
          <h3>10. Ændringer</h3>

          <p>
            Treesy forbeholder sig retten til at opdatere vilkår og priser.
            Væsentlige ændringer varsles.
          </p>
        </section>

        {/* 11 */}
        <section className="legal-section">
          <h3>11. Lovvalg og værneting</h3>

          <p>Dansk ret. Tvister afgøres ved danske domstole.</p>
        </section>
      </div>
    </>
  );
};

export default Terms;