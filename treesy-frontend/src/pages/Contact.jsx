import { useState } from "react";
import '../styles/styles.css';

//KOntakt funktion som håndterer form input og submission
export default function Kontakt() {
  const [form, setForm] = useState({ navn: "", email: "", besked: "" }); //usestate til at holde styr på form input værdier som navn, email og besked
  const [success, setSuccess] = useState(false); //usestate til at vise en succes besked når form er indsendt

  //constant handleChange funktioner som opdaterer form state når brugeren skriver i input felterne. Den bruger event.target.name for at identificere hvilket felt der opdateres og event.target.value for at få den nye værdi.
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  //handleSubmit funktion som håndterer form submission. 
  const handleSubmit = (e) => { //e er event objektet fra form submission
    e.preventDefault();
    if (!form.navn || !form.email || !form.besked) return; //Hvis nogen af felterne er tomme, gør ikke noget
   
    setSuccess(true); //Sæt success state til true for at vise succes beskeden
    setForm({ navn: "", email: "", besked: "" }); //nulstil form felterne efter submission. I en rigtig app ville du også sende dataen til en backend server
  };

  //return komponent som indeholder javascript JSX som beskriver hvordan kontakt siden skal se ud. Den inkluderer en hero sektion med en baggrundsbillede og titel, en formular sektion hvor brugeren kan indtaste deres navn, email og besked, og en kontakt info sektion med andre måder at kontakte virksomheden på. Der er også en CTA sektion i bunden for at opfordre brugeren til at se pakker eller læse mere om virksomheden.
  return (
    <div className="ts-page">

      {/* HERO */}
      <section
        className="ts-hero"
        style={{
          backgroundImage:
            "url('https://www.treesy.dk/marketing/business-scale.webp')",
          minHeight: "60vh",
        }}
      >
        <div className="ts-hero-content">
          <h1>Kontakt os</h1>
          <p className="ts-hero-sub">Vi står klar til at hjælpe dig</p>
        </div>
      </section>

      {/* FORMULAR */}
      <section className="ts-section">
        <div className="ts-container">
          <div className="contact-intro-text">
            <p>
              Har du spørgsmål, brug for rådgivning eller ønsker du at høre
              mere om vores abonnementspakker?
            </p>
            <p>Vi glæder os til at høre fra dig!</p>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit}>
              <label className="form-label" htmlFor="navn">Dit navn</label>
              <input
                type="text"
                id="navn"
                name="navn"
                value={form.navn}
                onChange={handleChange}
                placeholder="Fx. Lars Nielsen"
              />

              <label className="form-label" htmlFor="email">E-mailadresse</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="din@email.dk"
              />

              <label className="form-label" htmlFor="besked">Besked</label>
              <textarea
                id="besked"
                name="besked"
                value={form.besked}
                onChange={handleChange}
                placeholder="Skriv din besked her..."
              />

              <input type="submit" value="Send besked" />
            </form>

            {success && (
              <div className="form-success visible">
                ✓ Tak! Vi vender tilbage hurtigst muligt.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KONTAKT INFO */}
      <section className="ts-section ts-section-gray">
        <div className="ts-container">
          <h2 className="ts-section-title contact-info-title" style={{ marginBottom: "3rem" }}>
            Andre måder at kontakte os på
          </h2>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">📧</div>
              <h3>Email</h3>
              <p>
                <a href="mailto:charlie@treesy.dk">charlie@treesy.dk</a>
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">📞</div>
              <h3>Telefon</h3>
              <p>+45 50 73 79 84</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ts-cta">
        <h2>Klar til at gøre en forskel?</h2>
        <p>Start din klimarejse i dag og vælg den pakke der passer til dig.</p>
        <div className="ts-cta-btns">
          <a href="/#pakker" className="ts-btn-white">Se pakker</a>
          <a href="/om-treesy" className="ts-btn-outline">Læs mere om os</a>
        </div>
      </section>

    </div>
  );
}