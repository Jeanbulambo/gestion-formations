import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔹 Résoudre __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  { input: "src/assets/logo.jpeg", varName: "logoData" },
  { input: "src/assets/signature.png", varName: "signatureData" },
];

let content = "";

// Convertir chaque fichier en base64 et les regrouper
for (const { input, varName } of files) {
  const filePath = path.resolve(__dirname, input);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier introuvable : ${filePath}`);
    continue;
  }

  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1); // ex: jpeg ou png
  const base64 = `data:image/${ext};base64,${fileData.toString("base64")}`;

  content += `export const ${varName} = "${base64}";\n`;
}

// Sauvegarde dans un fichier unique
const outputFile = path.resolve(__dirname, "src/assets/imagesBase64.js");
fs.writeFileSync(outputFile, content, "utf8");

console.log(`✅ Fichier généré : ${outputFile}`);
