import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Filiere from "./pages/Filiere";
import Apprenant from "./pages/Apprenant";
import Certificat from "./pages/Certificat";   // ✅ composant export default
import Paiement from "./pages/Paiement";
import HistoriqueFactures from "./pages/HistoriqueFactures";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filieres" element={<Filiere />} />
          <Route path="/apprenants" element={<Apprenant />} />
          <Route path="/certificats" element={<Certificat />} />   {/* ✅ pas de { genererCertificatExact } ici */}
          <Route path="/paiements" element={<Paiement />} />
          <Route path="/historiquefactures" element={<HistoriqueFactures />} />
        </Routes>
      </div>
    </Router>
  );
}
