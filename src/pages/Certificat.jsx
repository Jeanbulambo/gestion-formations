import React, { useState, useEffect } from "react";
import { genererCertificatExact } from "../utils/genererCertificatExact";
import { getApprenantsEnOrdre } from "../services/db"; // 👈 utilise la nouvelle fonction

export default function Certificat() {
  const [apprenants, setApprenants] = useState([]);
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [periode, setPeriode] = useState("");
  const [photo, setPhoto] = useState(null);

  // ✅ Charger seulement les apprenants en ordre
  useEffect(() => {
    const fetchApprenants = async () => {
      const payes = await getApprenantsEnOrdre();
      setApprenants(payes);
    };
    fetchApprenants();
  }, []);

  const handleSelect = (id) => {
    const apprenant = apprenants.find((a) => a.id === parseInt(id));
    setSelectedApprenant(apprenant);
  };

  const handleGenerate = () => {
    if (!selectedApprenant || !periode) {
      alert("Veuillez choisir un apprenant et entrer une période !");
      return;
    }
    genererCertificatExact(selectedApprenant, periode, photo);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", fontFamily: "Arial" }}>
      <h2>Générer un certificat</h2>

      <div>
        <label>Apprenant :</label>
        <select
          onChange={(e) => handleSelect(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="">-- Sélectionner un apprenant --</option>
          {apprenants.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nom}
            </option>
          ))}
        </select>
      </div>

      {selectedApprenant && (
        <div style={{ marginBottom: "10px" }}>
          <label>Filière :</label>
          <input
            type="text"
            value={selectedApprenant.filiere}
            disabled
            style={{ width: "100%" }}
          />
        </div>
      )}

      <div>
        <label>Période :</label>
        <input
          type="text"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          placeholder="ex: Janvier - Mars 2025"
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>

      <div>
        <label>Photo de l'apprenant :</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          style={{ marginBottom: "10px" }}
        />
      </div>

      <button onClick={handleGenerate} style={{ padding: "10px 20px" }}>
        Générer le certificat
      </button>
    </div>
  );
}
