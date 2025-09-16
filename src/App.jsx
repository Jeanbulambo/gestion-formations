import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Filiere from "./pages/Filiere";
import Apprenant from "./pages/Apprenant";
import Certificat from "./pages/Certificat";
import Paiement from "./pages/Paiement";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filieres" element={<Filiere />} />
          <Route path="/apprenants" element={<Apprenant />} />
          <Route path="/certificats" element={<Certificat />} />
          <Route path="/paiements" element={<Paiement />} />
        </Routes>
      </div>
    </Router>
  );
}
