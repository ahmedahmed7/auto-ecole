import { useState } from 'react';
import { useVehicules } from '../hooks/useVehicules';

export default function VehiculesPage() {
  const { vehicules, loading, error, create, remove } = useVehicules();
  const [form, setForm] = useState({
    car_number: '',
    type: 'voiture',
    model: '',
    klm: '',
    insurance_validity: '',
    road_paper: '',
    date_of_circulation: '',
  });
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await create({
        ...form,
        klm: Number(form.klm),
        insurance_validity:   form.insurance_validity   ? new Date(form.insurance_validity).toISOString()   : '',
        road_paper:           form.road_paper           ? new Date(form.road_paper).toISOString()           : '',
        date_of_circulation:  form.date_of_circulation  ? new Date(form.date_of_circulation).toISOString()  : '',
      }).unwrap();
      setForm({ car_number: '', type: 'voiture', model: '', klm: '', insurance_validity: '', road_paper: '', date_of_circulation: '' });
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de l\'ajout');
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

  return (
    <div className="page">
      <h2>Véhicules</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Ajouter un véhicule</h3>
        <div className="form-row">
          <div className="field">
            <label>Immatriculation</label>
            <input required value={form.car_number} onChange={set('car_number')} placeholder="AB-123-CD" />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={set('type')}>
              <option value="voiture">Voiture</option>
              <option value="moto">Moto</option>
            </select>
          </div>
          <div className="field">
            <label>Modèle</label>
            <input required value={form.model} onChange={set('model')} placeholder="Renault Clio" />
          </div>
          <div className="field">
            <label>Kilométrage</label>
            <input type="number" min={0} value={form.klm} onChange={set('klm')} placeholder="0" />
          </div>
          <div className="field">
            <label>Assurance valide jusqu'au</label>
            <input type="date" value={form.insurance_validity} onChange={set('insurance_validity')} />
          </div>
          <div className="field">
            <label>Contrôle technique</label>
            <input type="date" value={form.road_paper} onChange={set('road_paper')} />
          </div>
          <div className="field">
            <label>1ère mise en circulation</label>
            <input type="date" value={form.date_of_circulation} onChange={set('date_of_circulation')} />
          </div>
        </div>
        {formError && <p className="error">{formError}</p>}
        <button type="submit">Ajouter</button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error   && <p className="error">{error}</p>}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Type</th>
              <th>Modèle</th>
              <th>Km</th>
              <th>Assurance</th>
              <th>CT</th>
              <th>Mise en circ.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicules.map((v) => (
              <tr key={v.ID}>
                <td data-label="Immatriculation">{v.CarNumber}</td>
                <td data-label="Type"><span className={`badge badge-${v.Type}`}>{v.Type}</span></td>
                <td data-label="Modèle">{v.Model}</td>
                <td data-label="Km">{v.Klm.toLocaleString()}</td>
                <td data-label="Assurance">{fmtDate(v.InsuranceValidity)}</td>
                <td data-label="CT">{fmtDate(v.RoadPaper)}</td>
                <td data-label="Mise en circ.">{fmtDate(v.DateOfCirculation)}</td>
                <td>
                  <button className="btn-danger" onClick={() => remove(v.ID)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!loading && vehicules.length === 0 && (
              <tr><td colSpan={8} className="empty">Aucun véhicule enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
