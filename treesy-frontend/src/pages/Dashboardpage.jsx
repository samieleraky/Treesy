import { useEffect, useState } from "react"; //javaScript import-sætning, der importerer useEffect og useState hooks fra React-biblioteket. Disse hooks bruges til at håndtere sideeffekter og komponentens tilstand i funktionelle komponenter.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css"; // Sørg for at have passende styles for dashboardet

function fmt(n) {
  return Number(n).toLocaleString("da-DK");
}

let chartInstance = null;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hent dashboard-data ved indlæsning af siden. setData indeholder info om kunden, abonnement og gemmer stats
  //når komponent starter henter den data fra backend, og sender token med i header for at autentificere. Hvis det lykkes, gemmes data i state og loading sættes til false. Hvis der er en fejl, gemmes fejlbesked i state og loading sættes til false.
  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:5106/api/dashboard", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente dashboard");
        return res.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [user]);

  //javascript. dette useeffect håndterer oprettelsen af et CO2-chart ved hjælp af Chart.js biblioteket.
  //Når data ændres, forsøger det at finde et canvas-element med id "db-co2-chart". Hvis det findes og Chart.js er tilgængeligt, opretter det et line chart med CO2-dataen. 
  // Hvis der allerede er et chart, ødelægges det først for at undgå overlap. Hvis Chart.js ikke er indlæst, tilføjes et script-tag til dokumentet for at indlæse det fra CDN, og når det er indlæst, tegnes chartet. Når komponenten unmountes eller data ændres, ødelægges chartet for at rydde op.
  useEffect(() => {
    if (!data?.co2Timeline?.length) return;

    const draw = () => {
      const canvas = document.getElementById("db-co2-chart");
      if (!canvas || !window.Chart) return;

      if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

      const labels = data.co2Timeline.map((p) => p.month);
      const values = data.co2Timeline.map((p) => p.co2);

      const ctx = canvas.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, "rgba(16,185,129,0.2)");
      grad.addColorStop(1, "rgba(16,185,129,0)");

      chartInstance = new window.Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
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
            y: {
              beginAtZero: true,
              grid: { color: "rgba(0,0,0,0.04)" },
              ticks: {
                color: "#9ca3af",
                font: { size: 11 },
                callback: (v) => fmt(v) + " kg",
              },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#9ca3af", font: { size: 11 } },
            },
          },
        },
      });
    };


    if (window.Chart) {
      draw();
      return () => { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } };
    }

    const existing = document.getElementById("chartjs-cdn");
    if (existing) {
      existing.addEventListener("load", draw);
      return () => { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } };
    }

    const script = document.createElement("script");
    script.id = "chartjs-cdn";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = draw;
    document.head.appendChild(script);

    return () => { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } };
  }, [data]);

  function handleLogout() {
    logout();
    navigate("/");
  }
//jsx er html lignende syntaks der bruges i React til at beskrive UI-komponenter. I dette tilfælde returnerer funktionen forskellige JSX-strukturer baseret på applikationens tilstand (loading, error, eller visning af dashboard-data). Hver struktur inkluderer en Navbar og forskellige divs med klasser og indhold, der viser brugerens information, abonnement, stats, og transaktioner. Der er også en logout-knap, der kalder handleLogout-funktionen ved klik.
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

          <div className="db-sub-info">
            <span>
              <strong>{subscription.planName}</strong> — {subscription.billing === "yearly" ? "Årlig" : "Månedlig"} · Status: {subscription.status}
            </span>
            <span style={{ color: "#6b7280", fontSize: "0.82rem" }}>
              Næste betaling: {subscription.currentPeriodEnd}
            </span>
          </div>

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

          <button className="db-logout" onClick={handleLogout}>Log ud</button>
        </div>
      </div>
    </>
  );
}