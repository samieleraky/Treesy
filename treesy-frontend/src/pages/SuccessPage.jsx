import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // ← tilpas stien hvis nødvendigt
import API_BASE_URL from "../config";



const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes dash {
    from { stroke-dashoffset: 60; }
    to   { stroke-dashoffset: 0; }
  }
  .suc-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0fdf4 0%, #ffffff 50%, #ecfdf5 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 80px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .suc-card {
    background: white;
    border-radius: 28px;
    padding: 60px 48px;
    max-width: 560px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(16,185,129,0.10), 0 4px 16px rgba(0,0,0,0.06);
    text-align: center;
    animation: fadeUp 0.6s ease both;
  }
  .suc-icon-wrap {
    width: 88px;
    height: 88px;
    background: #f0fdf4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  }
  .suc-icon-wrap svg { width: 44px; height: 44px; }
  .suc-check {
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
    animation: dash 0.5s ease 0.6s forwards;
  }
  .suc-title {
    font-size: 2rem;
    font-weight: 800;
    color: #065f46;
    margin: 0 0 12px;
    animation: fadeUp 0.6s ease 0.15s both;
  }
  .suc-sub {
    font-size: 1.05rem;
    color: #4b5563;
    line-height: 1.7;
    margin: 0 0 36px;
    animation: fadeUp 0.6s ease 0.25s both;
  }
  .suc-details {
    background: #f0fdf4;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 36px;
    text-align: left;
    animation: fadeUp 0.6s ease 0.35s both;
  }
  .suc-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 0.95rem;
    color: #374151;
    border-bottom: 1px solid rgba(16,185,129,0.15);
  }
  .suc-detail-row:last-child { border-bottom: none; }
  .suc-detail-label { color: #6b7280; }
  .suc-detail-value { font-weight: 600; color: #065f46; }
  .suc-btns {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeUp 0.6s ease 0.45s both;
  }
  .suc-btn-primary {
    padding: 14px 28px;
    background: linear-gradient(135deg, #10b981, #065f46);
    color: white;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(16,185,129,0.3);
    transition: all 0.25s ease;
  }
  .suc-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(16,185,129,0.4);
  }
  .suc-btn-ghost {
    padding: 14px 28px;
    background: transparent;
    color: #065f46;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    border: 2px solid #10b981;
    transition: all 0.25s ease;
  }
  .suc-btn-ghost:hover { background: #f0fdf4; }
  @media (max-width: 560px) {
    .suc-card { padding: 40px 24px; }
    .suc-title { font-size: 1.6rem; }
    .suc-btns { flex-direction: column; }
    .suc-btn-primary, .suc-btn-ghost { text-align: center; }
  }
`;

const PLAN_LABELS = {
  "active-planter":         "Active Planter — 130 træer/år",
  "committed-planter":      "Committed Planter — 260 træer/år",
  "hero-planter":           "Hero Planter — 1.300 træer/år",
  "legend-planter":         "Legend Planter — 13.000 træer/år",
  "active-planter-seed":    "Active Planter — 130 Seed Credits",
  "committed-planter-seed": "Committed Planter — 260 Seed Credits",
  "hero-planter-seed":      "Hero Planter — 1.300 Seed Credits",
  "legend-planter-seed":    "Legend Planter — 13.000 Seed Credits",
};

const BILLING_LABELS = {
  monthly: "Månedligt abonnement",
  yearly:  "Årligt abonnement",
  onetime: "Engangskøb",
};

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const id = "suc-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;
    fetch(`${API_BASE_URL}/api/payments/verify-session?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => setDetails(data))
      .catch((err) => console.error("Verification failed:", err));
  }, [searchParams]);

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="suc-page">
        <div className="suc-card">
          <div className="suc-icon-wrap">
            <svg viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" fill="#dcfce7" stroke="#10b981" strokeWidth="1.5"/>
              <path
                className="suc-check"
                d="M12 22l7 7 13-14"
                stroke="#065f46"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="suc-title">Betaling gennemført!</h1>
          <p className="suc-sub">
            Tak for din bestilling. Dine træer bliver plantet og du modtager
            en kvittering på mail.
          </p>

          {details && (
            <div className="suc-details">
              {details.email && (
                <div className="suc-detail-row">
                  <span className="suc-detail-label">Email</span>
                  <span className="suc-detail-value">{details.email}</span>
                </div>
              )}
              {details.planId && (
                <div className="suc-detail-row">
                  <span className="suc-detail-label">Pakke</span>
                  <span className="suc-detail-value">
                    {PLAN_LABELS[details.planId] ?? details.planId}
                  </span>
                </div>
              )}
              {details.billing && (
                <div className="suc-detail-row">
                  <span className="suc-detail-label">Fakturering</span>
                  <span className="suc-detail-value">
                    {BILLING_LABELS[details.billing] ?? details.billing}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="suc-btns">
            <Link to="/" className="suc-btn-primary">Tilbage til forsiden</Link>
            <Link to="/kontakt" className="suc-btn-ghost">Kontakt os</Link>
          </div>
        </div>
      </div>
    </>
  );
}