import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-gray-700">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT – Social Media Icons */}
        <div className="flex gap-5 text-xl">
          <a
            href="https://www.facebook.com/people/Treesy/61584051885059/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70"
          >
            <FaFacebook />
          </a>

          <a
            href="https://www.instagram.com/treesy.dk/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.linkedin.com/company/treesy-dk/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* RIGHT – Legal Links */}
        <nav className="flex gap-6 text-sm">
          <Link to="/terms" className="hover:underline">
            Handelsbetingelser
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privatlivspolitik
          </Link>
        </nav>

      </div>
    </footer>
  );
}