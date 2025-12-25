import { Route, Routes } from "react-router-dom";
import Checkout from "./pages/Checkout.jsx";
import Home from "./pages/Home.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"

function App() {
    
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout/:planId" element={<Checkout />} />
            </Routes>
            <Footer />

    </>
    );
}

export default App
