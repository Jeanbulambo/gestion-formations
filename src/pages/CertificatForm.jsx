import React, { useState } from "react";
import { generateCertificat } from "../services/certificat";

export default function CertificatForm() {
  const [nom, setNom] = useState("");
  const [filiere, setFiliere] = useState("");
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleGenerate = () => {
    generateCertificat(
      { nom },
      filiere,
      { debut, fin },
      photo
    );
  };

  return (
    <div className="container mt-4">
      <h2>Générer un certificat</h2>

      <input
        type="text"
        placeholder="Nom de l'apprenant"
        className="form-control my-2"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />

      <input
        type="text"
        placeholder="Filière"
        className="form-control my-2"
        value={filiere}
        onChange={(e) => setFiliere(e.target.value)}
      />

      <div className="row my-2">
        <div className="col">
          <label>Date début</label>
          <input
            type="date"
            className="form-control"
            value={debut}
            onChange={(e) => setDebut(e.target.value)}
          />
        </div>
        <div className="col">
          <label>Date fin</label>
          <input
            type="date"
            className="form-control"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
          />
        </div>
      </div>

      <label className="my-2">Photo de l'apprenant</label>
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <button className="btn btn-primary mt-3" onClick={handleGenerate}>
        Générer le certificat
      </button>
    </div>
  );
}
