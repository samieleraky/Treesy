import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // ← tilpas stien hvis nødvendigt

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
  .can-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #fafafa 0%, #ffffff 50%, #f8fafc 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 80px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .can-card {
    background: white;
    border-radius: 28px;
    padding: 60px 48px;
    max-width: 560px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
    text-align: center;
    animation: fadeUp 0.6s ease both;
  }
  .can-icon-wrap {
    width: 88px;
    height: 88px;
    background: #f8fafc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    border: 2px solid #e5e7eb;
    animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  }
  .can-icon-wrap svg { width: 40px; height: 40px; }
  .can-title {
    font-size: 2rem;
    font-weight: 800;
    color: #111827;
    margin: 0 0 12px;
    animation: fadeUp 0.6s ease 0.15s both;
  }
  .can-sub {
    font-size: 1.05rem;
    color: #4b5563;
    line-height: 1.7;
    margin: 0 0 8px;
    animation: fadeUp 0.6s ease 0.25s both;
  }
  .can-hint {
    font-size: 0.9rem;
    color: #9ca3af;
    margin: 0 0 36px;
    animation: fadeUp 0.6s ease 0.3s both;
  }
  .can-btns {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeUp 0.6s ease 0.4s both;
  }
  .can-btn-primary {
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
  .can-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(16,185,129,0.4);
  }
  .can-btn-ghost {
    padding: 14px 28px;
    background: transparent;
    color: #374151;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    border: 2px solid #e5e7eb;
    transition: all 0.25s ease;
  }
  .can-btn-ghost:hover {
    border-color: #10b981;
    color: #065f46;
  }
  @media (max-width: 560px) {
    .can-card { padding: 40px 24px; }
    .can-title { font-size: 1.6rem; }
    .can-btns { flex-direction: column; }
    .can-btn-primary, .can-btn-ghost { text-align: center; }
  }
`;

export default function CancelPage() {
  useEffect(() => {
    const id = "can-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="can-page">
        <div className="can-card">
          <div className="can-icon-wrap">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#d1d5db" strokeWidth="1.5" fill="#f9fafb"/>
              <path
                d="M13 13l14 14M27 13L13 27"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="can-title">Betaling annulleret</h1>
          <p className="can-sub">
            Din betaling blev ikke gennemført — der er ikke trukket noget beløb.
          </p>
          <p className="can-hint">
            Oplevede du et problem? Kontakt os gerne.
          </p>

          <div className="can-btns">
            <Link to="/#pakker" className="can-btn-primary">Prøv igen</Link>
            <Link to="/kontakt" className="can-btn-ghost">Kontakt os</Link>
          </div>
        </div>
      </div>
    </>
  );
}