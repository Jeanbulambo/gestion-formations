import { jsPDF } from "jspdf";
import { logoData, signatureData } from "../assets/imagesBase64";

/**
 * Génère un certificat PDF fidèle au modèle fourni
 * @param {Object} apprenant - { nom: string, filiere: string }
 * @param {string} periode - période exacte de la formation
 * @param {File|null} photoFile - photo de l'apprenant
 */
export const genererCertificatExact = async (apprenant, periode, photoFile = null) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  // === Cadres décoratifs ===
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(2);
  doc.rect(5, 5, 287, 200, "S");

  doc.setLineWidth(0.5);
  doc.rect(10, 10, 277, 190, "S");

  // === Logo ===
  doc.addImage(logoData, "JPEG", 15, 15, 40, 25);

  // === Titre principal ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0, 51, 102);
  doc.text("CERTIFICAT DE FORMATION", 148, 50, { align: "center" });

  // === Texte officiel ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);

  const texte = [
    "Le Centre de Formation Walikale to World",
    "atteste que :"
  ];
  texte.forEach((line, i) => {
    doc.text(line, 148, 70 + i * 8, { align: "center" });
  });

  // === Nom de l'apprenant ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(apprenant.nom.toUpperCase(), 148, 95, { align: "center" });

  // === Filière et période ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(
    `a suivi avec succès la formation en ${apprenant.filiere}`,
    148,
    110,
    { align: "center" }
  );
  doc.text(`Période : ${periode}`, 148, 120, { align: "center" });

  // === Photo ===
  if (photoFile) {
    const photoBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(photoFile);
    });
    doc.addImage(photoBase64, "JPEG", 230, 30, 40, 50);
  }

  // === Signature ===
  doc.addImage(signatureData, "PNG", 200, 150, 50, 25);
  doc.setFontSize(12);
  doc.text("Le Directeur", 225, 180, { align: "center" });

  // === Pied de page ===
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Papeterie Walikale to World", 20, 190);
  doc.text("Email : walikaletoworld.rt@gmail.com", 20, 195);

  // === Sauvegarde ===
  doc.save(`certificat_${apprenant.nom}.pdf`);
};
