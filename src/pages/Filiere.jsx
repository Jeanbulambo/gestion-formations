import { useEffect, useState } from "react";
import { addFiliere, getFilieres, deleteFiliere, updateFiliere } from "../services/db";

export default function Filiere() {
  const [filieres, setFilieres] = useState([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [enseignant, setEnseignant] = useState("");
  const [somme, setSomme] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchFilieres();
  }, []);

  const fetchFilieres = async () => {
    const data = await getFilieres();
    setFilieres(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !somme) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    // Mode de paiement par défaut : possibilité de payer en tranches
    await addFiliere({ nom, description, enseignant, somme: Number(somme), paiement: "tranche" });

    setNom("");
    setDescription("");
    setEnseignant("");
    setSomme("");

    fetchFilieres();
  };

  const handleDelete = async (id) => {
    await deleteFiliere(id);
    fetchFilieres();
  };

  const handleEdit = (filiere) => {
    setEditId(filiere.id);
    setEditData({ ...filiere });
  };

  const handleUpdate = async (id) => {
    if (!editData.nom || !editData.somme) {
      alert("Tous les champs obligatoires doivent être remplis !");
      return;
    }
    await updateFiliere(id, editData);
    setEditId(null);
    setEditData({});
    fetchFilieres();
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestion des Filières</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label>Nom de la filière</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Informatique"
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la filière"
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Enseignant</label>
          <input
            type="text"
            className="form-control"
            value={enseignant}
            onChange={(e) => setEnseignant(e.target.value)}
            placeholder="Nom de l’enseignant"
          />
        </div>

        <div className="mb-3">
          <label>Somme à payer ($)</label>
          <input
            type="number"
            className="form-control"
            value={somme}
            onChange={(e) => setSomme(e.target.value)}
            placeholder="Ex: 300"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Ajouter
        </button>
      </form>

      {/* Liste des filières */}
      <h4>Liste des filières</h4>
      {filieres.length === 0 ? (
        <p>Aucune filière enregistrée.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Enseignant</th>
              <th>Somme ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filieres.map((f) => (
              <tr key={f.id}>
                {editId === f.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.nom}
                        onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                      />
                    </td>
                    <td>
                      <textarea
                        className="form-control"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.enseignant}
                        onChange={(e) =>
                          setEditData({ ...editData, enseignant: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.somme}
                        onChange={(e) =>
                          setEditData({ ...editData, somme: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleUpdate(f.id)}
                      >
                        Sauvegarder
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditId(null)}
                      >
                        Annuler
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{f.nom}</td>
                    <td>{f.description}</td>
                    <td>{f.enseignant || "—"}</td>
                    <td>{f.somme} $</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(f)}
                      >
                        Éditer
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(f.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
