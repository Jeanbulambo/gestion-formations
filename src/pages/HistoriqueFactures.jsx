import { useEffect, useState } from "react";
import { getApprenants, getFilieres, getPaiements } from "../services/db";
import { genererFacture } from "../services/facture";

export default function HistoriqueFactures() {
  const [paiements, setPaiements] = useState([]);
  const [apprenants, setApprenants] = useState([]);
  const [filieres, setFilieres] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setPaiements(await getPaiements());
    setApprenants(await getApprenants());
    setFilieres(await getFilieres());
  };

  const getApprenantById = (id) => apprenants.find((a) => a.id === id);
  const getFiliereById = (id) => filieres.find((f) => f.id === id);

  return (
    <div className="container">
      <h2 className="mb-4">Historique des Factures</h2>

      {paiements.length === 0 ? (
        <p>Aucun paiement enregistré.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Apprenant</th>
              <th>Catégorie</th>
              <th>Filière / Frais</th>
              <th>Montant</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map((p) => {
              const apprenant = getApprenantById(p.apprenantId);
              const filiere = getFiliereById(apprenant?.filiereId);

              return (
                <tr key={p.id}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{apprenant?.nom || "N/A"}</td>
                  <td>{p.type}</td>
                  <td>
                    {p.type === "frais formation"
                      ? filiere?.nom || "N/A"
                      : p.nomFrais}
                  </td>
                  <td>{p.montant} $</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => genererFacture(apprenant, p, filiere)}
                    >
                      Télécharger Facture
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
