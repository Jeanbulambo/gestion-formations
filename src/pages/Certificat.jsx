import { useEffect, useState } from "react";
import { getApprenants, getFilieres } from "../services/db";
import { generateCertificat } from "../services/certificat";

export default function Certificat() {
  const [apprenants, setApprenants] = useState([]);
  const [filieres, setFilieres] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => { setApprenants(await getApprenants()); setFilieres(await getFilieres()); };
  const getFiliereById = id => filieres.find(f => f.id === id);

  const handleCertificat = (apprenant) => {
    const filiere = getFiliereById(apprenant.filiereId);
    if (!filiere) return alert("Filière introuvable !");
    if ((apprenant.paiementEffectue || 0) < (filiere.somme || 0)) return alert("❌ Paiement total non effectué !");
    generateCertificat(apprenant, filiere);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Impression des Certificats</h2>
      {apprenants.length === 0 ? <p>Aucun apprenant trouvé.</p> :
        <table className="table table-bordered">
          <thead><tr><th>Nom</th><th>Filière</th><th>Paiement</th><th>Action</th></tr></thead>
          <tbody>
            {apprenants.map(a => {
              const filiere = getFiliereById(a.filiereId);
              const total = filiere?.somme || 0;
              return <tr key={a.id}>
                <td>{a.nom}</td>
                <td>{filiere?.nom || "N/A"}</td>
                <td>{a.paiementEffectue >= total ? <span className="badge bg-success">Payé</span> : <span className="badge bg-warning">{a.paiementEffectue} / {total}$</span>}</td>
                <td><button className="btn btn-primary btn-sm" onClick={() => handleCertificat(a)}>Générer Certificat</button></td>
              </tr>;
            })}
          </tbody>
        </table>
      }
    </div>
  );
}
