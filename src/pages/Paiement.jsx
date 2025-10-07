import { useEffect, useState } from "react";
import { getApprenants, getFilieres, updateApprenant, addPaiement } from "../services/db";
import { genererFacture } from "../services/facture";

export default function Paiement() {
  const [apprenants, setApprenants] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedApprenantId, setSelectedApprenantId] = useState("");
  const [categoriePaiement, setCategoriePaiement] = useState("frais formation");
  const [modePaiement, setModePaiement] = useState("unique");
  const [nomFrais, setNomFrais] = useState("");
  const [montant, setMontant] = useState(0);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setApprenants(await getApprenants());
    setFilieres(await getFilieres());
  };

  const getApprenantById = (id) => apprenants.find((a) => a.id === Number(id));
  const getFiliereById = (id) => filieres.find((f) => f.id === Number(id));

  const handlePaiement = async () => {
    if (!selectedApprenantId || !montant || (categoriePaiement === "autres frais" && !nomFrais)) {
      return alert("Veuillez remplir tous les champs requis !");
    }

    const apprenant = getApprenantById(selectedApprenantId);
    let paiementData = {};

    if (categoriePaiement === "frais formation") {
      const filiere = getFiliereById(apprenant.filiereId);
      if (!filiere) return alert("Filière introuvable !");

      const total = filiere.somme || 0;
      const nouveauPaiement = (apprenant.paiementEffectue || 0) + Number(montant);

      // Gestion des tranches
      if (modePaiement === "tranche") {
        const tranche = total / 3;
        const trancheAvant = Math.floor((apprenant.paiementEffectue || 0) / tranche);
        const trancheApres = Math.floor(nouveauPaiement / tranche);
        if (trancheApres > trancheAvant) {
          alert(`✅ Tranche ${trancheApres} déposée. Total payé: ${nouveauPaiement}$`);
        }
      }

      await updateApprenant(apprenant.id, { paiementEffectue: nouveauPaiement });

      paiementData = {
        apprenantId: apprenant.id,
        type: "frais formation",
        modePaiement,
        montant: Number(montant),
        date: new Date().toISOString(),
      };
      await addPaiement(paiementData);

      alert(`Paiement enregistré : ${nouveauPaiement} / ${total}$`);

      genererFacture(apprenant, paiementData, filiere);

    } else if (categoriePaiement === "autres frais") {
      paiementData = {
        apprenantId: apprenant.id,
        type: "autres frais",
        nomFrais,
        montant: Number(montant),
        date: new Date().toISOString(),
      };
      await addPaiement(paiementData);
      alert(`Paiement '${nomFrais}' enregistré : ${montant}$`);

      genererFacture(apprenant, paiementData, null);
    }

    // Reset
    setMontant(0);
    setNomFrais("");
    setModePaiement("unique");
    setCategoriePaiement("frais formation");
    fetchData();
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestion des Paiements</h2>

      <div className="mb-3">
        <label>Apprenant</label>
        <select className="form-control" value={selectedApprenantId} onChange={(e) => setSelectedApprenantId(e.target.value)}>
          <option value="">-- Sélectionner un apprenant --</option>
          {apprenants.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
        </select>
      </div>

      {selectedApprenantId && (
        <>
          <div className="mb-3">
            <label>Catégorie de paiement</label>
            <select className="form-control" value={categoriePaiement} onChange={(e) => setCategoriePaiement(e.target.value)}>
              <option value="frais formation">Frais formation</option>
              <option value="autres frais">Autres frais</option>
            </select>
          </div>

          {categoriePaiement === "frais formation" && (
            <>
              <div className="mb-3">
                <label>Filière</label>
                <select className="form-control" value={getApprenantById(selectedApprenantId).filiereId} disabled>
                  {filieres.map(f => <option key={f.id} value={f.id}>{f.nom} ({f.somme}$)</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label>Mode de paiement</label>
                <select className="form-control" value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
                  <option value="unique">Paiement unique</option>
                  <option value="tranche">3 tranches</option>
                </select>
              </div>
            </>
          )}

          {categoriePaiement === "autres frais" && (
            <div className="mb-3">
              <label>Nom du frais</label>
              <input type="text" className="form-control" value={nomFrais} onChange={(e) => setNomFrais(e.target.value)} />
            </div>
          )}

          <div className="mb-3">
            <label>Montant</label>
            <input type="number" className="form-control" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Ex: 100" />
          </div>

          <button className="btn btn-primary" onClick={handlePaiement}>
            Enregistrer Paiement & Générer Facture
          </button>
        </>
      )}
    </div>
  );
}
