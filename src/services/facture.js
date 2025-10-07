import { jsPDF } from "jspdf";
import { logoData, signatureData } from "../assets/imagesBase64"; // logo + signature en base64

// Convertisseur montant → texte simple
const formatMontant = (montant) => `${montant} dollars US`;

// Fonction utilitaire pour ajouter une ligne label/valeur
const addLine = (doc, label, value, x = 14, y) => {
  doc.text(`${label} : ${value}`, x, y);
};

export const genererFacture = (apprenant, paiement, filiere) => {
  const doc = new jsPDF();

  // === Logo (haut droit) ===
  doc.addImage(logoData, "JPEG", 150, 10, 45, 25);

  // === En-tête entreprise ===
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Walikale to World", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  addLine(doc, "Adresse", "DRC, Nord Kivu, Walikale", 14, 25);
  addLine(doc, "N° RCCM", "CD/GOM/RCCM/24-A-01041", 14, 30);
  addLine(doc, "Id.NAT", "01-G4701-N66253Q", 14, 35);
  addLine(doc, "N° Impôt", "01-G4701-N66", 14, 40);
  addLine(doc, "Phone", "+243 812 681 339", 14, 45);
  addLine(doc, "Email", "walikaletoworld.rt@gmail.com", 14, 50);

  // === Titre ===
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE DE VENTE", 105, 65, { align: "center" });

  // === Infos facture ===
  const factureNum =
    "F-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Date.now().toString().slice(-4);

  doc.setFontSize(10);
  addLine(doc, "Facture N°", factureNum, 14, 80);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, 160, 80);

  // === Infos apprenant ===
  doc.setFontSize(11);
  addLine(doc, "Apprenant", apprenant.nom, 14, 95);
  addLine(doc, "Téléphone", apprenant.telephone || "—", 14, 101);
  addLine(doc, "Adresse", apprenant.adresse || "—", 14, 107);

  // === Catégorie et mode ===
  addLine(doc, "Catégorie", paiement.type, 14, 117);
  if (paiement.type === "frais formation") {
    addLine(doc, "Filière", filiere?.nom || "N/A", 14, 123);
    addLine(doc, "Mode de paiement", paiement.modePaiement, 14, 129);
  } else {
    addLine(doc, "Nom du frais", paiement.nomFrais, 14, 123);
  }

  // === Section détails ===
  let y = 145;
  doc.setFontSize(12);
  doc.text("Détails du paiement", 14, y);
  doc.line(14, y + 2, 190, y + 2);

  y += 12;
  if (paiement.type === "frais formation") {
    const total = filiere?.somme || 0;
    const dejaPaye = apprenant.paiementEffectue || 0;
    const restant = Math.max(total - dejaPaye - paiement.montant, 0);

    addLine(doc, "Total dû", `${total} $`, 14, y); y += 7;
    addLine(doc, "Montant payé cette fois", `${paiement.montant} $`, 14, y); y += 7;
    addLine(doc, "Total déjà payé", `${dejaPaye + paiement.montant} $`, 14, y); y += 7;
    addLine(doc, "Reste à payer", `${restant} $`, 14, y); y += 7;
  } else {
    addLine(doc, "Montant payé", `${paiement.montant} $`, 14, y); y += 7;
  }

  // === Totaux ===
  y += 10;
  addLine(doc, "Sous-total", `${paiement.montant} $`, 140, y); y += 7;
  addLine(doc, "Total", `${paiement.montant} $`, 140, y); y += 7;
  doc.text(`Montant en lettres : ${formatMontant(paiement.montant)}`, 14, y + 10);

  // === Pied de page ===
  const pageHeight = doc.internal.pageSize.height;
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Merci pour votre confiance !", 14, pageHeight - 25);
  doc.text("Papeterie Walikale to World", 14, pageHeight - 20);
  doc.text("Email : walikaletoworld.rt@gmail.com", 14, pageHeight - 15);

  // === Signature ===
  doc.text("Signature pour autorisation :", 150, pageHeight - 42);
  doc.addImage(signatureData, "PNG", 150, pageHeight - 40, 50, 25);

  // ✅ Sauvegarde
  doc.save(`facture_${apprenant.nom}_${factureNum}.pdf`);
};
