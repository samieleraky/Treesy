import React from 'react';
import '../styles/LegalPages.css'; // Vi samler al CSS i én fil

const Disclaimer = () => {
  return (
    
    <>
      {/* HERO */}
      <header className="disclaimer-hero">
        <h1>Disclaimer & FAQ</h1>
        <p>Gennemsigtighed, ansvar og ærlige svar – også når det er komplekst.</p>
      </header>

      {/* DISCLAIMER SECTION */}
      <section className="disclaimer-section">
        <h2>Disclaimer</h2>

        <h3>Vigtig information om Treesy</h3>
        <p>
          Hos Treesy ønsker vi at gøre det nemt, billigt og gennemskueligt at tage 
          personlig klimahandling gennem træplantning.
        </p>

        <p>
          Træer er levende organismer. Derfor kan ingen træplantningsprojekter give 100 % garanti 
          for overlevelse i al evighed.<br />
          Treesy forpligter sig dog til at:
        </p>

        <ul>
          <li>gøre alt, hvad der er praktisk, kontraktligt og lokalt muligt</li>
          <li>arbejde langsigtet og ansvarligt</li>
          <li>genplante, hvor det er nødvendigt</li>
        </ul>

        <p>Samtidig ønsker vi at være helt åbne om:</p>

        <ul>
          <li>hvad vores løsning kan</li>
          <li>hvad den ikke kan</li>
          <li>hvilke antagelser vi arbejder med</li>
          <li>og hvilke risici der naturligt findes i naturbaserede løsninger</li>
        </ul>

        <p>
          Denne side er skrevet for at give dig fuld gennemsigtighed, 
          også hvis du er kritisk eller skeptisk.
        </p>

        <h3>Disclaimer (ansvarsfraskrivelse)</h3>
        <p>
          <strong>Træplantning er et supplement – ikke en erstatning</strong><br />
          Treesy opfordrer ikke til øget forbrug.<br />
          Den mest effektive klimahandling er altid at reducere udledninger, hvor det er muligt.
        </p>

        <p>Træplantning gennem Treesy skal ses som:</p>
        <ul>
          <li>et supplement til reduktion</li>
          <li>en måde at tage ansvar for uundgåelige udledninger</li>
          <li>en langsigtet investering i klima, natur og lokalsamfund</li>
        </ul>

        <h3>Om begrebet "Carbon Neutral"</h3>
        <p>
          Når vi kalder vores mindste pakke Carbon Neutral, bygger det på 
          konservative gennemsnitsantagelser:
        </p>

        <ul>
          <li>
            Den gennemsnitlige dansker udleder ca. 13 tons CO₂e om året<br />
            (kilde: CONCITO – forbrugsbaserede udledninger)
          </li>
          <li>Ét træ vurderes konservativt til at lagre minimum 100 kg CO₂e over sin levetid</li>
          <li>130 træer × 100 kg CO₂e ≈ 13 tons CO₂e</li>
        </ul>

        <p>
          Derfor svarer 130 træer om året til at bringe et gennemsnitligt dansk klimaaftryk i balance.<br />
          Dette er et estimat – ikke en garanti.
        </p>

        <h3>Er man klimaneutral fra dag ét?</h3>
        <p>
          Nej.<br />
          Et træ optager ikke 100 kg CO₂ den dag, det plantes.
        </p>

        <ul>
          <li>I de første år er optaget begrænset</li>
          <li>Det stiger i takt med træets vækst</li>
          <li>De største mængder CO₂ lagres, når træet er modent</li>
        </ul>

        <p>
          Et gammelt ordsprog siger:<br />
          "Det bedste tidspunkt at plante et træ var for 20 år siden.<br />
          Det næstbedste tidspunkt er i dag."
        </p>

        <h3>Konservative beregninger</h3>
        <p>
          Vi har bevidst valgt en forsigtig tilgang.<br />
          Vi vil hellere plante to træer for meget end ét for lidt.
        </p>

        <h3>CO₂, CO₂e og carbon – kort forklaret</h3>
        <ul>
          <li>Carbon (kulstof) er et grundstof og byggestenen i træers biomasse</li>
          <li>CO₂ (kuldioxid) er den gas, træer optager gennem fotosyntese</li>
          <li>CO₂e (CO₂-ækvivalenter) bruges til at samle alle drivhusgasser i én fælles måleenhed</li>
        </ul>

        <h3>Ingen formel CO₂-certificering</h3>
        <p>
          Treesy benytter ikke dyre tredjeparts-certificeringer (fx VCS eller Gold Standard). 
          Vi har bevidst fravalgt tredjeparts-certificeringer, da disse vil hæve prisen per træ betydeligt. 
          I stedet fører vi streng egenkontrol ved fysiske besøg flere gange årligt, 
          samt løbende dokumentation via geo-tagging af hvert enkelt træ.
          Du er ligeledes velkommen til at besøge planteområdet og se de træer, 
          som du har doneret, med egne øjne.
        </p>

        <h3>Force majeure</h3>
        <p>
          Treesy kan ikke holdes ansvarlig for hændelser uden for vores rimelige kontrol herunder 
          (men ikke begrænset til):
        </p>
        <ul>
          <li>naturkatastrofer (brand, oversvømmelse, jordskred, storme)</li>
          <li>sygdomsudbrud i skovområde</li>
          <li>politisk uro eller ændret lovgivning</li>
          <li>ulovlig skovrydning udført af tredjepart</li>
          <li>ekstreme klimatiske forhold</li>
        </ul>
        <p>
          I sådanne tilfælde vil Treesy — i det omfang det er muligt — arbejde for genplantning 
          og genopretning, men kan ikke garantere fuldstændig erstatning i alle scenarier.
        </p>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <h2>FAQ – Ofte stillede (og kritiske) spørgsmål</h2>

        <div className="faq-card">
          <h3>Hvordan sikrer I, at træerne bliver stående på lang sigt?</h3>
          <p>Vi arbejder med flere lag af sikring:</p>

          <p><strong>1. Kontrakter</strong><br />
          I aftalerne med vores lokale plantepartner er det fastlagt, at:</p>
          <ul>
            <li>træerne ikke må fældes</li>
            <li>de monitoreres mindst 4 gange årligt i 3 år</li>
            <li>døde træer skal erstattes ved genplantning</li>
          </ul>

          <p><strong>2. Lokale incitamenter</strong></p>
          <ul>
            <li>1/3 af træerne er frugttræer, som giver mad og indkomst</li>
            <li>
              lokalsamfundet uddannes i fordelene og mulighederne ved træer i lokalområdet, 
              heriblandt forøget biodiversitet, sikring mod naturkatastrofer, såsom jordskred, tsunamier mm.
            </li>
            <li>sundere jord og vandbinding gavner deres eget landbrug</li>
          </ul>

          <p><strong>3. Forest Fund</strong><br />
          Sociale og økonomiske projekter i lokalsamfundet udløses efter 10, 20 og 30 år – 
          kun hvis træerne stadig står.</p>
        </div>

        <div className="faq-card">
          <h3>Hvad hvis træerne dør?</h3>
          <p>Ikke alle træer overlever – og det er indregnet.</p>
          <ul>
            <li>Træerne monitoreres løbende</li>
            <li>Svage eller døde træer genplantes</li>
            <li>Overlevelse er en del af partnerens ansvar</li>
          </ul>
        </div>

        <div className="faq-card">
          <h3>Hvorfor planter I i Tanzania?</h3>
          <ul>
            <li>Træer vokser hurtigere i tropisk klima</li>
            <li>CO₂-optaget pr. træ er højt</li>
            <li>Træplantning er mere omkostningseffektiv</li>
          </ul>
          <p>Derudover:</p>
          <ul>
            <li>har Treesy medejer og team i Tanzania</li>
            <li>vi er selv fysisk til stede ved plantning og monitorering</li>
            <li>Alle er velkomne til at besøge planteområderne fysisk.</li>
          </ul>
        </div>

        <div className="faq-card">
          <h3>Kan jeg se mine træer?</h3>
          <p>Ja.</p>
          <p>Alle træer:</p>
          <ul>
            <li>bliver individuelt geo-tagget</li>
            <li>vises på et offentligt kort</li>
            <li>kan spores til planteområde og plantningsperiode</li>
          </ul>
        </div>

        <div className="faq-card">
          <h3>Kan de samme træer sælges til flere kunder?</h3>
          <p>Nej.</p>
          <p><strong>Ét træ. Én donor. Fuld gennemsigtighed.</strong></p>
          <p>Vi undgår dobbeltregnskab ved:</p>
          <ul>
            <li>individuel geo-tagging</li>
            <li>offentliggørelse af planteområder og donorer</li>
            <li>(fx "Donor X – 20.000 træer – januar 2026")</li>
          </ul>
          <p>Et træ kan ikke allokeres til flere kunder.</p>
        </div>

        <div className="faq-card">
          <h3>Er det greenwashing?</h3>
          <p>Greenwashing opstår, når:</p>
          <ul>
            <li>man lover mere end man kan holde</li>
            <li>tallene er uklare</li>
            <li>dokumentationen mangler</li>
          </ul>
          <p>Vi modarbejder greenwashing ved:</p>
          <ul>
            <li>konservative beregninger</li>
            <li>tydelige disclaimers</li>
            <li>åben adgang til data</li>
            <li>fysisk tilstedeværelse</li>
          </ul>
        </div>

        <div className="faq-card">
          <h3>Kan jeg beregne mit CO₂-aftryk mere præcist?</h3>
          <p>Ja.</p>
          <p>Hvis du udleder mere end gennemsnittet, kan du:</p>
          <ul>
            <li>bruge en ekstern CO₂-beregner</li>
            <li>vælge en større Treesy-pakke</li>
            <li>eller kontakte os for en custom løsning</li>
          </ul>
        </div>

        <div className="faq-card">
          <h3>Kan virksomheder bruge Treesy?</h3>
          <p>Ja.</p>
          <p>
            Vi tilbyder løsninger til virksomheder, familier og fællesskaber.<br />
            Kontakt os for mere information.
          </p>
        </div>

        <div className="faq-card">
          <h3>Hvad hvis jeg stadig er skeptisk?</h3>
          <p>Det forstår vi.</p>
          <p>Derfor:</p>
          <ul>
            <li>lover vi mindre end mange andre</li>
            <li>viser hellere end vi fortæller</li>
            <li>svarer åbent på kritiske spørgsmål</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Disclaimer;