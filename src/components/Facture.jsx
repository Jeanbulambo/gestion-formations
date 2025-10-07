import { genererFacture } from "../services/facture";

export default function Facture({ apprenant, paiement, filiere }) {
  return (
    <button
      className="btn btn-success"
      onClick={() => genererFacture(apprenant, paiement, filiere)}
    >
      Télécharger Facture
    </button>
  );
}
