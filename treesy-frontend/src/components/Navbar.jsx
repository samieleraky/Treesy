import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ forceScrolled = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = forceScrolled || scrolled;

  return (
    <nav className={`ts-navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="ts-navbar-container">

        <Link to="/" className="ts-logo">
          <img
            src={isScrolled ? "/B-transparent-bg.png" : "/B2-transparent-bg.png"}
            alt="Treesy logo"
          />
        </Link>

        <div className="ts-nav-links">
          <Link to="/">Forside</Link>
          <Link to="/metoder">Metoder</Link>
          <Link to="/om-treesy">Om Treesy</Link>
          <Link to="/disclaimer">Disclaimer & FAQ</Link>
          <Link to="/erhverv">Erhverv</Link>
          <Link to="/kontakt">Kontakt</Link>
        </div>

        <div className="ts-burger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
      </div>

      {menuOpen && (
        <div className="ts-mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Forside</Link>
          <Link to="/metoder" onClick={() => setMenuOpen(false)}>Metoder</Link>
          <Link to="/om-treesy" onClick={() => setMenuOpen(false)}>Om Treesy</Link>
          <Link to="/disclaimer" onClick={() => setMenuOpen(false)}>Disclaimer & FAQ</Link>
          <Link to="/erhverv" onClick={() => setMenuOpen(false)}>Erhverv</Link>
          <Link to="/kontakt" onClick={() => setMenuOpen(false)}>Kontakt</Link>
        </div>
      )}
    </nav>
  );
}