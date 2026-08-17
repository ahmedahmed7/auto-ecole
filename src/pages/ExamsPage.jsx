import { useState } from 'react';
import { useExams } from '../hooks/useExams';
import { useStudents } from '../hooks/useStudents';
import { useVehicules } from '../hooks/useVehicules';

const emptyForm = {
  candidat_id: '',
  nature: '',
  categorie: '',
  date_examen: '',
  centre: '',
  convocation: '',
  numero_liste: '',
  etat: 'en_attente',
  vehicule_id: '',
};

const etatOptions = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'reussi', label: 'Réussi' },
  { value: 'echoue', label: 'Échoué' },
  { value: 'reporte', label: 'Reporté' },
  { value: 'absent', label: 'Absent' },
];

const formatEtat = (etat) =>
  etatOptions.find((option) => option.value === etat)?.label ??
  etat.replaceAll('_', ' ');

export default function ExamsPage() {
  const { exams, loading, error, record, refresh } = useExams();
  const { students } = useStudents();
  const { vehicules } = useVehicules();

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await record({
        ...form,
        vehicule_id: form.vehicule_id,
      }).unwrap();
      await refresh().unwrap();
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de l\'enregistrement de l\'examen');
    }
  };

  const studentName = (id) => {
    const s = students.find((item) => item.id === id);
    return s ? `${s.prenom} ${s.nom}` : id;
  };

  const vehicleLabel = (id) => vehicules.find((v) => v.id === id)?.immatriculation ?? id;

  return (
    <div className="page">
      <h2>Examens</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Enregistrer un examen</h3>
        <div className="form-row">
          <div className="field">
            <label>Candidat</label>
            <select required value={form.candidat_id} onChange={set('candidat_id')}>
              <option value="">Sélectionner un candidat…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.prenom} {s.nom}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Nature</label>
            <input required value={form.nature} onChange={set('nature')} />
          </div>
          <div className="field">
            <label>Catégorie</label>
            <input required value={form.categorie} onChange={set('categorie')} />
          </div>
          <div className="field">
            <label>Date d'examen</label>
            <input type="date" required value={form.date_examen} onChange={set('date_examen')} />
          </div>
          <div className="field">
            <label>Centre</label>
            <input required value={form.centre} onChange={set('centre')} />
          </div>
          <div className="field">
            <label>Convocation</label>
            <input required value={form.convocation} onChange={set('convocation')} />
          </div>
          <div className="field">
            <label>Numéro de liste</label>
            <input required value={form.numero_liste} onChange={set('numero_liste')} />
          </div>
          <div className="field">
            <label>État</label>
            <select value={form.etat} onChange={set('etat')}>
              {etatOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Véhicule</label>
            <select value={form.vehicule_id} onChange={set('vehicule_id')}>
              <option value="">Aucun</option>
              {vehicules.map((v) => <option key={v.id} value={v.id}>{v.immatriculation}</option>)}
            </select>
          </div>
        </div>
        {formError && <p className="error">{formError}</p>}
        <button type="submit">Enregistrer</button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <table>
          <thead>
            <tr><th>Candidat</th><th>Nature</th><th>Catégorie</th><th>Date</th><th>Centre</th><th>État</th><th>Véhicule</th></tr>
          </thead>
          <tbody>
            {exams.map((e) => (
              <tr key={e.id}>
                <td data-label="Candidat">{studentName(e.candidat_id)}</td>
                <td data-label="Nature">{e.nature}</td>
                <td data-label="Catégorie">{e.categorie}</td>
                <td data-label="Date">{e.date_examen ? new Date(`${e.date_examen}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td data-label="Centre">{e.centre}</td>
                <td data-label="État"><span className="badge badge-info">{formatEtat(e.etat)}</span></td>
                <td data-label="Véhicule">{e.vehicule_id ? vehicleLabel(e.vehicule_id) : '—'}</td>
              </tr>
            ))}
            {!loading && exams.length === 0 && (
              <tr><td colSpan={7} className="empty">Aucun examen enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
