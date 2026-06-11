import { useEffect, useState } from "react"; //useState gemmer data i state, useEffect til at hente data når komponenten indlæses
import { Link, useNavigate } from "react-router-dom"; //Link bruges til at navigere mellem sider, useNavigate bruges til at programmatiskt navigere (f.eks. efter logout)
import { useAuth } from "../context/AuthContext"; //useAuth henter login-status og brugerinfo fra AuthContext, som er en global state for autentificering
import Navbar from "../components/Navbar"; //topmenu
import "../styles/Dashboard.css";
import API_BASE_URL from '../config'; //importerer API_Base_URL fra config.js for at bruge i fetch kald
import TreeMap from "../components/TreeMap.jsx"; //importerer TreeMap komponenten som viser en kort med træer baseret på data hentet fra backend. Den bruger react-leaflet og leaflet bibliotekerne til at vise et interaktivt kort med markører for hvert træ.

//funktion komponent fmt bruges til at formatere tal med tusind-separatorer for bedre læsbarhed i dashboardet. Dette bruges i dashboardet for at vise tal som antal træer og kg CO₂ på en mere læsbar måde.
function fmt(n) {
  return Number(n).toLocaleString("da-DK"); //returnerer det formaterede tal som en string, feks 12345 som bliver til 12,345 i dansk format. 
}

//ChartInstance gemmer den aktuelle chart.js graf og forhindrer flere grafer over på hinanden
let chartInstance = null;

//DashboardPage komponent er hovedkomponenten for brugerens dashboard
export default function DashboardPage() {
  const { user, logout } = useAuth(); //henter user token og logout funktion fra AuthContext for at kunne vise brugerdata og håndtere logout
  const navigate = useNavigate(); //useNavigate bruges til at navigere brugern til en anden side efter logout
  const [data, setData] = useState(null); //gemmer dashboard data hentet fra backend
  const [loading, setLoading] = useState(true); //Loader mens data hentes
  const [error, setError] = useState(null); //gemmer fejlbeskeder
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); //Viser en bekræftelsesdialog ved opsigelse. Den er sat til false som standard, og bliver true når brugeren klikker på "Annuller abonnement" knappen, for at vise en bekræftelsesdialog. Hvis brugeren bekræfter, kaldes handleCancelSubscription funktionen for at annullere abonnementet. Hvis brugeren fortryder, sættes showCancelConfirm tilbage til false for at skjule dialogen igen.
  const [cancelling, setCancelling] = useState(false); //setCancelling holder styr på om opsigelsen er i gang for at kunne disable knappen. 
  const [cancelDone, setCancelDone] = useState(false); //cancelDone bruges til at vise en besked efter abonnementet er annulleret. Den er sat til false som standard, og bliver true når opsigelsen er gennemført. Når cancelDone er true, vises en besked i UI der bekræfter at abonnementet er annulleret og giver information om hvor længe brugeren stadig har adgang.
  const [trees, setTrees] = useState([]); //gemmer trædata hentet fra backend for at vise på kortet. Det starter som en tom array, og bliver opdateret med data hentet fra backend i useEffect hooken. TreeMap komponenten bruger denne state til at vise markører på kortet for hvert træ.

  //BRUGES TIL AT HENTE DASHBOARD DATA FRA BACKEND NÅR KOMPONENT INDLÆESES. 
  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/dashboard`, { //fetch kald til backend endpoint for at hente dashboard data, inklusive brugerens træer, abonnement, og statistik. Det inkluderer Authorization header med Bearer token for at autentificere requesten.
      headers: { Authorization: `Bearer ${user.token}` },//backend forventer at token er sendt i Authorization header i format
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente dashboard"); //hvis response ikke er ok, kast en fejl som bliver fanget i catch blokken
        return res.json(); //returner response data i json siden frontend og backend kommunikerer med json data
      })
      .then((d) => { setData(d); setLoading(false); }) //hvis data hentes succesfuldt, gem det i state og stop loaderen
      .catch((err) => { setError(err.message); setLoading(false); }); //hvis der opstår en fejl under fetch, gem fejlbeskeden i state og stop loaderen
  }, [user]); //useEffect afhænger af user, så det kører igen hvis user ændres (f.eks. ved login/logout)
  
  //HENTER TRÆER FRA BACKEND FOR AT VISE PÅ KORTET 
  useEffect(() => {
    if (!user?.token) return; //hvis bruger ikke er logget eller token ikke er tilgængelig, gør ikke noget
    fetch(`${API_BASE_URL}/api/trees`, {
      headers: { Authorization: `Bearer ${user.token}` }, //inkluder Authorization header med Bearer token for at autentificere requesten, så backend ved hvilken brugers træer der skal hentes
    })
      .then((res) => res.json()) //hent response data som json
      .then((d) => setTrees(d)) //gem det hentede trædata i state så det kan bruges til at vise markører på kortet i TreeMap komponenten
      .catch(() => setTrees([])); //hvis der opstår en fejl under fetch (f.eks. netværksfejl eller ugyldigt token), sæt trædata til en tom array for at undgå at vise forkerte data på kortet
  }, [user]);

//useEffect til at lave CO2 chart med chart.js
  useEffect(() => {
    if (!data?.co2Timeline?.length) return; //hvis data ikke findes, eller CO2 timeline er tom så stopper den bare

    //DRAW FUNKTION SOM TEGNER GRAFEN
    const draw = () => {
      const canvas = document.getElementById("db-co2-chart"); // finder <canvas id="db-co2-chart">. hvis ikke den findes --> stop
      if (!canvas || !window.Chart) return; 

      if (chartInstance) { chartInstance.destroy(); chartInstance = null; } //Hvis der allerede er et chart, bliver det fjernet 

      //Data til grafen
      const labels = data.co2Timeline.map((p) => p.month);
      const values = data.co2Timeline.map((p) => p.co2);

      const ctx = canvas.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, 0, 200); //gradient baggrund. Laver en fade effekt under linjen
      grad.addColorStop(0, "rgba(16,185,129,0.2)");
      grad.addColorStop(1, "rgba(16,185,129,0)");

      //Opretter chart.js chart. Altså bygger selve grafen
      chartInstance = new window.Chart(ctx, {
        type: "line", //linjediagram
        data: {
          labels,
          datasets: [{ //dataset altså selve linjen
            data: values,
            borderColor: "#065f46",
            backgroundColor: grad,
            borderWidth: 2.5,
            pointBackgroundColor: "#065f46",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#065f46",
              titleColor: "rgba(255,255,255,0.7)",
              bodyColor: "#fff",
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (c) => ` ${fmt(c.parsed.y)} kg CO₂`,
              },
            },
          },
          scales: {
            y: { //y akse
              beginAtZero: true,
              grid: { color: "rgba(0,0,0,0.04)" },
              ticks: {
                color: "#9ca3af",
                font: { size: 11 },
                callback: (v) => fmt(v) + " kg", //formater tak
              },
            },
            x: { // x akse
              grid: { display: false },
              ticks: { color: "#9ca3af", font: { size: 11 } },
            },
          },
        },
      });
    };

    //hvis min Chart objekt allerede findes i den globale vindue (window) er true så kaldes funktionen Draw
    if (window.Chart) {
      draw();
      return () => { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } };
    }

    //Finder en eksisterende <script>-element med IDet "chartjs-cdn". dette element referer til Chart.js biblioteket
    const existing = document.getElementById("chartjs-cdn");
    if (existing) { //hvis det allerede eksisterer på siden, tilføjer en event listener til scriptets load-event
      existing.addEventListener("load", draw);
      return () => { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } }; //Tjekker om chartInstance eksisterer. Hvis ja, kaldes destroy() for at fjerne diagrammet. Chartinstance sætters til null
    }

    //Hvis det ikke findes, så loader Chart.js fra CDN
    const script = document.createElement("script");
    script.id = "chartjs-cdn";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = draw; //Når den er loaded så tegnes den
    document.head.appendChild(script);

    return () => { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } };
  }, [data]);

  //Funktion komponent til at logge ud og sendt tilbage til forsiden
  function handleLogout() {
    logout();
    navigate("/");
  }

  //asynkron funktion som sender POST request til backend
  async function handleCancelSubscription() {
    setCancelling(true); //Hvis annullering er true
    try { //Sender POSt request til backend
      const res = await fetch(`${API_BASE_URL}/api/subscription/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` }, //sendes med JWT token i header
      });
      const json = await res.json(); //hvis server fejler så throw error
      if (!res.ok) throw new Error(json.message || "Noget gik galt");

      //hvis annullering er en succes, opdaterer UI og viser cancel done
      setCancelDone(true);
      setShowCancelConfirm(false);
      setData(prev => ({ //opdaterer state lokalt. Den ændrer UI med det samme uden at skulle refetche API
        ...prev,
        subscription: { ...prev.subscription, status: "cancelled" }
      }));
    } catch (err) {
      alert("Fejl: " + err.message); //error handling
    } finally {
      setCancelling(false);
    }
  }

  //Loading af dashboard 
  if (loading) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="db-page">
          <div className="db-loading">
            <div className="db-spinner" />
            Henter dit dashboard...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="db-page">
          <div className="db-loading">⚠️ {error}</div>
        </div>
      </>
    );
  }

  //DESTRUCTURING AF DATA. JEG tager værdier ud af et objekt (data) og gemmer dem i variabler på en kortere og mere overskuelig måde
  //viser et andet UI hvis brugeren ikke har en subscription
  const { customer, subscription, stats, co2Timeline, transactions } = data;

  if (!subscription) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="db-page">
          <div className="db-wrap">
            <div className="db-no-sub">
              <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
              <h3>Hej, {customer.name}</h3>
              <p>Du har ikke et aktivt abonnement endnu. Vælg en pakke og kom i gang.</p>
              <Link to="/#pakker">Se pakker</Link>
            </div>
            <button className="db-logout" onClick={handleLogout}>Log ud</button>
          </div>
        </div>
      </>
    );
  }

  //Hvis følgende hvis bruger har en subscription
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="db-page">
        <div className="db-wrap">

          <div className="db-hero">
            <div className="db-hero-top">
              <div>
                <h1 className="db-hero-name">Hej, {customer.name} 👋</h1>
                <p className="db-hero-meta">
                  Medlem siden <strong>{customer.memberSince}</strong>
                  &nbsp;·&nbsp; {customer.monthsActive} måneder aktiv
                </p>
              </div>
              <span className="db-badge">🌳 {subscription.planName}</span>
            </div>
            <div className="db-hero-divider" />
            <div className="db-hero-stats">
              <div>
                <div className="db-hs-label">Træer plantet i år</div>
                <div className="db-hs-val">
                  {fmt(stats.treesPerYear)}
                  <span className="db-hs-unit">træer</span>
                </div>
              </div>
              <div>
                <div className="db-hs-label">CO₂ absorberet</div>
                <div className="db-hs-val">
                  {fmt(stats.co2Kg)}
                  <span className="db-hs-unit">kg</span>
                </div>
              </div>
              <div>
                <div className="db-hs-label">Skovområde</div>
                <div className="db-hs-val">
                  {stats.footballPitches}
                  <span className="db-hs-unit">fodboldbaner</span>
                </div>
              </div>
            </div>
            <div className="db-season-note">
              🌿 Dine træer plantes i to omgange om året — omkring regnsæsonerne i Tanzania.
            </div>
          </div>

          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat-icon">🌱</div>
              <div className="db-stat-label">Træer plantet i alt</div>
              <div className="db-stat-val">{fmt(stats.totalTreesPlanted)}</div>
            </div>
            <div className="db-stat">
              <div className="db-stat-icon">💨</div>
              <div className="db-stat-label">CO₂ bidraget i år</div>
              <div className="db-stat-val">
                {fmt(stats.co2Kg)}
                <span className="db-stat-unit">kg</span>
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat-icon">🌍</div>
              <div className="db-stat-label">Skovområde</div>
              <div className="db-stat-val">
                {stats.footballPitches}
                <span className="db-stat-unit">baner</span>
              </div>
            </div>
          </div>

          {/* 🌳 TRÆER MAP*/}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">Dine træer 🌳</h3>
            </div>
            <TreeMap trees={trees} />
          </div>

          <div className="db-sub-info">
            <span>
              <strong>{subscription.planName}</strong> — {subscription.billing === "yearly" ? "Årlig" : "Månedlig"} · Status: {subscription.status}  
            </span>
            <span style={{ color: "#6b7280", fontSize: "0.82rem" }}>
              Næste betaling: {subscription.currentPeriodEnd}
            </span>
          </div>

{/*CO2 BIDRAG OVER TID */}
          {co2Timeline?.length > 0 && (
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">CO₂ bidrag over tid</h3>
                <div className="db-legend">
                  <span>
                    <span className="db-legend-dot" style={{ background: "#065f46" }} />
                    CO₂ (kg)
                  </span>
                </div>
              </div>
              <div style={{ position: "relative", height: 200 }}>
                <canvas id="db-co2-chart" />
              </div>
            </div>
          )}

{/*SENESTE TRANSAKTIONER*/}
          {transactions?.length > 0 && (
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">Seneste transaktioner</h3>
              </div>
              {transactions.map((tx, i) => (
                <div className="db-tx-row" key={i}>
                  <div>
                    <div className="db-tx-name">{tx.description}</div>
                    <div className="db-tx-date">
                      {new Date(tx.date).toLocaleDateString("da-DK", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="db-tx-right">
                    <span className="db-tx-amount">{fmt(tx.amount)} kr</span>
                    <span className={`db-pill ${tx.status === "active" || tx.status === "paid" ? "db-pill-green" : "db-pill-gray"}`}>
                      {tx.status === "active" ? "Aktiv" : tx.status === "paid" ? "Betalt" : tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

{/*ABONNEMENT STATUS*/}
          {subscription?.status === "active" && (
            <div className="db-card" style={{ borderTop: "2px solid #fee2e2" }}>
              <div className="db-card-header">
                <h3 className="db-card-title" style={{ color: "#991b1b" }}>
                  Annuller abonnement
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: 16 }}>
                Hvis du annullerer, beholder du adgang frem til{" "}
                <strong>{subscription.currentPeriodEnd}</strong>. Ingen fremtidige
                betalinger vil blive trukket.
              </p>
              {cancelDone ? (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #86efac",
                  borderRadius: 12, padding: 16, color: "#065f46", fontWeight: 600
                }}>
                  ✅ Dit abonnement er annulleret. Du har adgang til{" "}
                  {subscription.currentPeriodEnd}. Du har fået en bekræftelse på mail.
                </div>
              ) : !showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  style={{
                    background: "transparent", border: "1px solid #ef4444",
                    color: "#ef4444", padding: "10px 20px", borderRadius: 8,
                    cursor: "pointer", fontWeight: 600, fontSize: "0.9rem"
                  }}
                >
                  Annuller abonnement
                </button>
              ) : (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fca5a5",
                  borderRadius: 12, padding: 20
                }}>
                  <p style={{ fontWeight: 600, color: "#991b1b", marginBottom: 12 }}>
                    Er du sikker? Dit abonnement stopper efter{" "}
                    {subscription.currentPeriodEnd}.
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      style={{
                        flex: 1, background: "#ef4444", color: "white",
                        border: "none", padding: "10px 0", borderRadius: 8,
                        cursor: cancelling ? "not-allowed" : "pointer",
                        fontWeight: 600, opacity: cancelling ? 0.7 : 1
                      }}
                    >
                      {cancelling ? "Annullerer..." : "Ja, annuller"}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      style={{
                        flex: 1, background: "#e5e7eb", color: "#374151",
                        border: "none", padding: "10px 0", borderRadius: 8,
                        cursor: "pointer", fontWeight: 600
                      }}
                    >
                      Fortryd
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button className="db-logout" onClick={handleLogout}>Log ud</button>
        </div>
      </div>
    </>
  );
}