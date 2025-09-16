import { useEffect, useState } from "react";
import { addApprenant, getApprenants, getFilieres, updateApprenant, deleteApprenant } from "../services/db";

export default function Apprenant() {
  const [apprenants, setApprenants] = useState([]);
  const [filieres, setFilieres] = useState([]);

  // Champs du formulaire
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [dateEnregistrement, setDateEnregistrement] = useState("");
  const [periode, setPeriode] = useState("");
  const [horaire, setHoraire] = useState("jour");
  const [filiereId, setFiliereId] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setApprenants(await getApprenants());
    setFilieres(await getFilieres());
  };

  const getFiliereById = (id) => filieres.find((f) => f.id === id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !filiereId) return alert("Nom et filière requis");

    const filiere = getFiliereById(Number(filiereId));
    await addApprenant({
      nom,
      telephone,
      adresse,
      dateEnregistrement,
      periode,
      horaire,
      filiereId: Number(filiereId),
      paiementEffectue: 0, // rien payé au départ
      totalAPayer: filiere?.somme || 0
    });

    // reset form
    setNom(""); setTelephone(""); setAdresse(""); setDateEnregistrement(""); 
    setPeriode(""); setHoraire("jour"); setFiliereId("");

    fetchData();
  };

  const handleDelete = async (id) => { await deleteApprenant(id); fetchData(); };
  const handleEdit = (apprenant) => { setEditId(apprenant.id); setEditData({ ...apprenant }); };
  const handleUpdate = async (id) => { 
    if (!editData.nom || !editData.filiereId) return;
    await updateApprenant(id, editData);
    setEditId(null); setEditData({});
    fetchData();
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestion des Apprenants</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3"><label>Nom</label><input type="text" className="form-control" value={nom} onChange={e => setNom(e.target.value)} /></div>
        <div className="mb-3"><label>Filière</label>
          <select className="form-control" value={filiereId} onChange={e => setFiliereId(e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {filieres.map(f => <option key={f.id} value={f.id}>{f.nom} ({f.somme}$)</option>)}
          </select>
        </div>
        <div className="mb-3"><label>Téléphone</label><input type="text" className="form-control" value={telephone} onChange={e => setTelephone(e.target.value)} /></div>
        <div className="mb-3"><label>Adresse</label><input type="text" className="form-control" value={adresse} onChange={e => setAdresse(e.target.value)} /></div>
        <div className="mb-3"><label>Date d’enregistrement</label><input type="date" className="form-control" value={dateEnregistrement} onChange={e => setDateEnregistrement(e.target.value)} /></div>
        <div className="mb-3"><label>Période (mois)</label><input type="number" className="form-control" value={periode} onChange={e => setPeriode(e.target.value)} /></div>
        <div className="mb-3"><label>Horaire</label>
          <select className="form-control" value={horaire} onChange={e => setHoraire(e.target.value)}><option value="jour">Jour</option><option value="soir">Soir</option></select>
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>

      <h4>Liste des Apprenants</h4>
      {apprenants.length === 0 ? <p>Aucun apprenant enregistré.</p> :
        <table className="table table-bordered">
          <thead><tr><th>Nom</th><th>Filière</th><th>Action</th></tr></thead>
          <tbody>
            {apprenants.map(a => {
              const filiere = getFiliereById(a.filiereId);
              return <tr key={a.id}>
                <td>{a.nom}</td>
                <td>{filiere?.nom || "N/A"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(a)}>Éditer</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Supprimer</button>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      }
    </div>
  );
}
