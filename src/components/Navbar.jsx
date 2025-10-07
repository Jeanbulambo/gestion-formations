import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Formation</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/filieres">Filières</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/apprenants">Apprenants</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/certificats">Certificats</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/paiements">Paiement</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/historiquefactures">Historique de facture</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
