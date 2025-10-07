import { openDB } from "idb";

export const initDB = async () => {
  return await openDB("formationDB", 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("apprenants")) {
        db.createObjectStore("apprenants", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("filieres")) {
        db.createObjectStore("filieres", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("certificats")) {
        db.createObjectStore("certificats", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// === FILIERES ===
export const addFiliere = async (filiere) => {
  const db = await initDB();

  const somme = filiere.somme || 0;
  const paiement = filiere.paiement || "unique";

  let tranches = [];
  if (paiement === "tranche" && somme > 0) {
    const montant = Math.floor(somme / 3);
    tranches = [
      { numero: 1, montant },
      { numero: 2, montant },
      { numero: 3, montant: somme - montant * 2 }, // pour ajuster si pas divisible
    ];
  }

  const data = { ...filiere, somme, paiement, tranches };
  await db.add("filieres", data);
};

export const getFilieres = async () => {
  const db = await initDB();
  return await db.getAll("filieres");
};

export const deleteFiliere = async (id) => {
  const db = await initDB();
  await db.delete("filieres", id);
};

// ✅ update avec tranches si besoin
export const updateFiliere = async (id, updatedFiliere) => {
  const db = await initDB();
  const oldFiliere = await db.get("filieres", id);
  if (!oldFiliere) return;

  const somme = updatedFiliere.somme ?? oldFiliere.somme ?? 0;
  const paiement = updatedFiliere.paiement ?? oldFiliere.paiement ?? "unique";

  let tranches = oldFiliere.tranches || [];
  if (paiement === "tranche" && somme > 0) {
    const montant = Math.floor(somme / 3);
    tranches = [
      { numero: 1, montant },
      { numero: 2, montant },
      { numero: 3, montant: somme - montant * 2 },
    ];
  }

  const newFiliere = {
    ...oldFiliere,
    ...updatedFiliere,
    somme,
    paiement,
    tranches,
  };

  await db.put("filieres", newFiliere);
};

// === APPRENANTS ===
export const addApprenant = async (apprenant) => {
  const db = await initDB();
  await db.add("apprenants", apprenant);
};

export const getApprenants = async () => {
  const db = await initDB();
  return await db.getAll("apprenants");
};

export const deleteApprenant = async (id) => {
  const db = await initDB();
  await db.delete("apprenants", id);
};

export const updateApprenant = async (id, updatedApprenant) => {
  const db = await initDB();
  const oldApprenant = await db.get("apprenants", id);
  if (!oldApprenant) return;

  const newApprenant = { ...oldApprenant, ...updatedApprenant };
  await db.put("apprenants", newApprenant);
};
// === Paiements ===
export const addPaiement = async (paiement) => {
  const db = await initDB();

  // Vérifie si l'object store "paiements" existe, sinon le crée (optionnel)
  if (!db.objectStoreNames.contains("paiements")) {
    const version = db.version + 1;
    db.close();
    await openDB("formationDB", version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("paiements")) {
          db.createObjectStore("paiements", { keyPath: "id", autoIncrement: true });
        }
      },
    });
  }

  await db.add("paiements", paiement);
};

export const getPaiements = async () => {
  const db = await initDB();
  return await db.getAll("paiements");
};

// ✅ Récupérer uniquement les apprenants qui ont payé
export const getApprenantsEnOrdre = async () => {
  const db = await initDB();
  const apprenants = await db.getAll("apprenants");
  const paiements = await db.getAll("paiements");

  // On considère qu'un apprenant est "en ordre"
  // si au moins un paiement existe avec son id
  const apprenantsPayes = apprenants.filter((a) =>
    paiements.some((p) => p.apprenantId === a.id)
  );

  return apprenantsPayes;
};

