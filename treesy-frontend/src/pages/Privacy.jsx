import React from 'react';
import '../styles/LegalPages.css';

const Privacy = () => {
  return (
    <>
      {/* HERO */}
      <section className="privacy-hero">
        <h1>Privatlivspolitik & Cookies</h1>
        <p className="intro-text">
          Hos Treesy tager vi beskyttelsen af dine personoplysninger alvorligt.
        </p>
      </section>

      <div className="privacy-content">
        <div className="privacy-section">
          <h2>1. Dataansvarlig</h2>
          <div className="contact-box">
            <p><strong>Treesy ApS</strong></p>
            <p>CVR: 46174062</p>
            <p>Adresse: Jernbaneallé 12, 9300 Sæby</p>
            <p>E-mail: charlie@treesy.dk</p>
          </div>
        </div>

        <div className="privacy-section">
          <h2>2. Hvilke oplysninger indsamler vi?</h2>
          <p>Vi indsamler kun oplysninger, der er nødvendige for at levere vores service, herunder:</p>
          <ul>
            <li>navn</li>
            <li>e-mail</li>
            <li>betalingsoplysninger</li>
            <li>abonnementstype</li>
            <li>loginoplysninger</li>
            <li>tekniske data (IP-adresse, browser, enhedstype)</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. Formål med behandlingen</h2>
          <p>Vi bruger dine oplysninger til at:</p>
          <ul>
            <li>administrere dit abonnement</li>
            <li>gennemføre betalinger</li>
            <li>give adgang til platform og kort</li>
            <li>sende relevant information</li>
            <li>forbedre vores service</li>
          </ul>
          <div className="privacy-highlight">
            <p>Treesy sælger aldrig dine personoplysninger videre.</p>
          </div>
        </div>

        <div className="privacy-section">
          <h2>4. Retsgrundlag</h2>
          <p>Behandlingen sker på baggrund af:</p>
          <ul>
            <li>opfyldelse af aftale</li>
            <li>retlig forpligtelse (fx bogføring)</li>
            <li>legitim interesse (drift og forbedring)</li>
            <li>samtykke (nyhedsbrev og cookies)</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>5. Opbevaring</h2>
          <p>
            Personoplysninger opbevares kun så længe, det er nødvendigt for formålet 
            eller i henhold til gældende lovgivning.
          </p>
        </div>

        <div className="privacy-section">
          <h2>6. Dine rettigheder</h2>
          <p>Du har ret til:</p>
          <ul>
            <li>indsigt i dine oplysninger</li>
            <li>rettelse</li>
            <li>sletning</li>
            <li>begrænsning af behandling</li>
            <li>dataportabilitet</li>
            <li>at trække samtykke tilbage</li>
          </ul>
          <p>Henvendelser sendes til <strong>charlie@treesy.dk</strong>.</p>
        </div>

        <div className="privacy-section">
          <h2>7. Cookies</h2>
          <p>Treesy bruger cookies til:</p>
          <ul>
            <li>at få hjemmesiden til at fungere</li>
            <li>statistik og analyse</li>
            <li>forbedring af brugeroplevelsen</li>
          </ul>
          <p>
            Du kan til enhver tid ændre eller trække dit samtykke tilbage via din browser.
          </p>
        </div>

        <div className="privacy-section">
          <h2>8. Tredjeparter</h2>
          <p>Treesy anvender betroede tredjeparter til:</p>
          <ul>
            <li>betaling</li>
            <li>hosting</li>
            <li>analyse</li>
          </ul>
          <p>Disse behandler udelukkende data efter instruks fra Treesy.</p>
        </div>

        <div className="privacy-section">
          <h2>9. Ændringer i privatlivspolitikken</h2>
          <p>Privatlivspolitikken kan opdateres løbende.</p>
          <p>
            Den til enhver tid gældende version vil altid være tilgængelig på hjemmesiden.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;