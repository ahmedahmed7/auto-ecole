import { useState } from 'react';
import { useVehicules } from '../hooks/useVehicules';

const emptyForm = {
  immatriculation: '',
  type: '',
  categorie: '',
  nb_klm: '',
  feuille_de_route: '',
  date_visite_technique: '',
  date_assurance: '',
  date_mise_en_circulation: '',
};

export default function VehiculesPage() {
  const { vehicules, loading, error, create, remove } = useVehicules();
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await create({
        ...form,
        nb_klm: Number(form.nb_klm),
      }).unwrap();
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="page">
      <h2>Véhicules</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Ajouter un véhicule</h3>
        <div className="form-row">
          <div className="field">
            <label>Immatriculation</label>
            <input required value={form.immatriculation} onChange={set('immatriculation')} placeholder="AB-123-CD" />
          </div>
          <div className="field">
            <label>Type</label>
            <input required value={form.type} onChange={set('type')} placeholder="Voiture" />
          </div>
          <div className="field">
            <label>Catégorie</label>
            <input required value={form.categorie} onChange={set('categorie')} placeholder="B" />
          </div>
          <div className="field">
            <label>Kilométrage</label>
            <input type="number" min={0} value={form.nb_klm} onChange={set('nb_klm')} placeholder="0" />
          </div>
          <div className="field">
            <label>Feuille de route</label>
            <input type="date" required value={form.feuille_de_route} onChange={set('feuille_de_route')} />
          </div>
          <div className="field">
            <label>Contrôle technique</label>
            <input type="date" required value={form.date_visite_technique} onChange={set('date_visite_technique')} />
          </div>
          <div className="field">
            <label>Assurance</label>
            <input type="date" required value={form.date_assurance} onChange={set('date_assurance')} />
          </div>
          <div className="field">
            <label>Mise en circulation</label>
            <input type="date" required value={form.date_mise_en_circulation} onChange={set('date_mise_en_circulation')} />
          </div>
        </div>
        {formError && <p className="error">{formError}</p>}
        <button type="submit">Ajouter</button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Km</th>
              <th>Feuille</th>
              <th>CT</th>
              <th>Assurance</th>
              <th>Mise en circ.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicules.map((v) => (
              <tr key={v.id}>
                <td data-label="Immatriculation">{v.immatriculation}</td>
                <td data-label="Type">{v.type}</td>
                <td data-label="Catégorie">{v.categorie}</td>
                <td data-label="Km">{Number(v.nb_klm).toLocaleString('fr-FR')}</td>
                <td data-label="Feuille">{v.feuille_de_route ? new Date(`${v.feuille_de_route}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td data-label="CT">{v.date_visite_technique ? new Date(`${v.date_visite_technique}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td data-label="Assurance">{v.date_assurance ? new Date(`${v.date_assurance}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td data-label="Mise en circ.">{v.date_mise_en_circulation ? new Date(`${v.date_mise_en_circulation}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td>
                  <button type="button" className="btn-danger" onClick={() => remove(v.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!loading && vehicules.length === 0 && (
              <tr><td colSpan={9} className="empty">Aucun véhicule enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
