import { useEffect, useState } from "react";
import { getApprenants, getFilieres, updateApprenant, addPaiement } from "../services/db";
import jsPDF from "jspdf";

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

  const getApprenantById = (id) => apprenants.find(a => a.id === Number(id));
  const getFiliereById = (id) => filieres.find(f => f.id === Number(id));

  const genererFacture = (apprenant, paiementData) => {
    const doc = new jsPDF();
    const filiere = getFiliereById(apprenant.filiereId);
    const total = filiere?.somme || 0;
    const dejaPaye = (apprenant.paiementEffectue || 0) + paiementData.montant;
    const restant = Math.max(total - dejaPaye, 0);

    doc.setFontSize(16);
    doc.text("FACTURE DE PAIEMENT", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nom de l'apprenant : ${apprenant.nom}`, 20, 40);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 20, 50);

    if (categoriePaiement === "frais formation") {
      doc.text(`Filière : ${filiere?.nom || "N/A"}`, 20, 60);
      doc.text(`Type : Frais de formation`, 20, 70);
      doc.text(`Mode de paiement : ${modePaiement}`, 20, 80);

      if (modePaiement === "tranche") {
        const tranche = total / 3;
        const trancheNumber = Math.ceil(dejaPaye / tranche);
        doc.text(`Tranches payées : ${trancheNumber} / 3`, 20, 90);
      }

      doc.text(`Total dû : ${total}$`, 20, 100);
      doc.text(`Montant payé cette fois : ${paiementData.montant}$`, 20, 110);
      doc.text(`Total payé : ${dejaPaye}$`, 20, 120);
      doc.text(`Reste à payer : ${restant}$`, 20, 130);

    } else {
      doc.text(`Type : ${nomFrais}`, 20, 60);
      doc.text(`Montant payé : ${paiementData.montant}$`, 20, 70);
    }

    doc.text("Merci pour votre paiement !", 20, 150);
    doc.save(`facture_${apprenant.nom}_${Date.now()}.pdf`);
  };

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

      // Notifications pour tranches
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
    }

    // Générer facture détaillée
    genererFacture(apprenant, paiementData);

    // Reset champs
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
          {apprenants.map((a) => <option key={a.id} value={a.id}>{a.nom}</option>)}
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
                  {filieres.map((f) => <option key={f.id} value={f.id}>{f.nom} ({f.somme}$)</option>)}
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
            Enregistrer Paiement & Facture
          </button>
        </>
      )}
    </div>
  );
}
