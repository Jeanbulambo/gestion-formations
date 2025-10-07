import React, { useState, useEffect } from "react";
import { genererCertificatExact } from "./Certificat";
import { getAllApprenants, getFiliereById } from "../services/indexedDB";

export default function CertificatForm() {
  const [apprenants, setApprenants] = useState([]);
  const [selectedApprenantId, setSelectedApprenantId] = useState("");
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [filiere, setFiliere] = useState(null);
  const [periode, setPeriode] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  // Charger uniquement les apprenants qui ont payé
  useEffect(() => {
    const fetchApprenants = async () => {
      const allApprenants = await getAllApprenants();
      const payes = allApprenants.filter((a) => a.aPaye === true); // filtre
      setApprenants(payes);
    };
    fetchApprenants();
  }, []);

  // Charger automatiquement la filière quand un apprenant est choisi
  useEffect(() => {
    const fetchFiliere = async () => {
      if (selectedApprenantId) {
        const apprenant = apprenants.find((a) => a.id === selectedApprenantId);
        setSelectedApprenant(apprenant);
        if (apprenant?.filiereId) {
          const f = await getFiliereById(apprenant.filiereId);
          setFiliere(f);
        }
      }
    };
    fetchFiliere();
  }, [selectedApprenantId, apprenants]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedApprenant || !filiere || !periode) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    genererCertificatExact(selectedApprenant, filiere, periode, photoFile);
  };

  return (
    <div className="card p-4">
      <h3>Génération de Certificat</h3>
      <form onSubmit={handleSubmit}>
        {/* Liste déroulante des apprenants qui ont payé */}
        <div className="mb-3">
          <label className="form-label">Apprenant</label>
          <select
            className="form-select"
            value={selectedApprenantId}
            onChange={(e) => setSelectedApprenantId(e.target.value)}
          >
            <option value="">-- Choisir un apprenant en ordre de paiement --</option>
            {apprenants.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Champ filière auto-rempli */}
        {filiere && (
          <div className="mb-3">
            <label className="form-label">Filière</label>
            <input
              type="text"
              className="form-control"
              value={filiere.nom}
              readOnly
            />
          </div>
        )}

        {/* Période */}
        <div className="mb-3">
          <label className="form-label">Période</label>
          <input
            type="text"
            className="form-control"
            placeholder="ex: Janvier - Juin 2025"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          />
        </div>

        {/* Photo */}
        <div className="mb-3">
          <label className="form-label">Photo de l'apprenant</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Générer Certificat
        </button>
      </form>
    </div>
  );
}
