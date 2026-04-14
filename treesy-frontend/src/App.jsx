import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Checkout from "./pages/Checkout.jsx";
import Home from "./pages/Home.jsx"
import OmTreesy from "./pages/OmTreesy.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import Metoder from "./pages/Metoder.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Contact from "./pages/Contact.jsx";
import ErhvervsPage from "./pages/ErhvervsPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import CancelPage from "./pages/CancelPage.jsx";
import ProtectedRoute from "./components/Protectedroute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboardpage";

function App() {
    
    return (
        <>
            <Navbar />
            <ScrollToTop /> {/* Sørger for at scrolle til toppen ved navigation */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout/:planId" element={<Checkout />} />
                <Route path="/om-treesy" element={<OmTreesy />} />
                <Route path="/disclaimer" element={<Disclaimer/>} />
                <Route path="/metoder" element={<Metoder />} />
                <Route path="/erhverv" element={<ErhvervsPage />} />
                <Route path="/kontakt" element={<Contact />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<CancelPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={ <ProtectedRoute>
                <DashboardPage />
                </ProtectedRoute>} />
                </Routes>
                <Footer />

    </>
    );
}

export default App
