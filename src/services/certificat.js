import jsPDF from "jspdf";
import logo from "../assets/logo.jpeg"; // mets ton logo dans src/assets/logo.png

export const generateCertificat = (apprenant, filiere) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  // === Couleurs principales ===
  const bleu = "#00AEEF";
  const grisClair = "#F3F3F3";

  // === Fond bleu arrondi en bas ===
  doc.setFillColor(0, 174, 239);
  doc.rect(0, 190, 297, 40, "F"); // bandeau bas

  // === Cercle / ellipse gris clair en arrière-plan ===
  doc.setFillColor(243, 243, 243);
  doc.ellipse(148, 105, 130, 85, "F");

  // === Logo ===
  doc.addImage(logo, "", 250, 15, 35, 35);

  // === Titre CERTIFICAT ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(0, 0, 0);
  doc.text("CERTIFICAT", 148, 45, { align: "center" });

  // === Texte officiel ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  let y = 70;

  doc.text(
    "Le Centre de formation Walikale to World atteste par la présente que :",
    30,
    y
  );
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text(`${apprenant.nom}`, 30, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.text(
    "a participé(e) avec succès à la formation Informatique Bureautique constituée par les modules suivants :",
    30,
    y
  );
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text("Ms Windows, Word, Excel et Internet", 30, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.text(
    "durant une période de trois (3) mois allant de .............. à ..............",
    30,
    y
  );
  y += 15;

  doc.text(
    "En foi de quoi le présent certificat lui est délivré pour toute fin utile.",
    30,
    y
  );
  y += 30;

  // === Date et lieu ===
  const date = new Date().toLocaleDateString();
  doc.text(`Fait à Walikale, le ${date}`, 148, y, { align: "center" });

  // === Signatures ===
  doc.setFontSize(12);
  doc.text("Président du jury", 80, 185, { align: "center" });
  doc.text("Directeur du Centre", 220, 185, { align: "center" });

  // === Cadre photo ===
  doc.setDrawColor(0);
  doc.setFillColor(0, 174, 239);
  doc.rect(250, 80, 35, 45); // cadre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("PHOTO", 268, 105, { align: "center" });

  // === Export PDF ===
  doc.save(`certificat_${apprenant.nom}.pdf`);
};
