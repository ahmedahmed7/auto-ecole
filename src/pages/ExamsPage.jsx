import { useState } from 'react';
import { useExams } from '../hooks/useExams';
import { useStudents } from '../hooks/useStudents';
import { useVehicules } from '../hooks/useVehicules';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
        <Button type="submit" variant="contained">Enregistrer</Button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <TableContainer className="table-wrap">
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow><TableCell>Candidat</TableCell><TableCell>Nature</TableCell><TableCell>Catégorie</TableCell><TableCell>Date</TableCell><TableCell>Centre</TableCell><TableCell>État</TableCell><TableCell>Véhicule</TableCell></TableRow>
            </TableHead>
            <TableBody>
            {exams.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{studentName(e.candidat_id)}</TableCell>
                <TableCell>{e.nature}</TableCell>
                <TableCell>{e.categorie}</TableCell>
                <TableCell>{e.date_examen ? new Date(`${e.date_examen}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell>{e.centre}</TableCell>
                <TableCell><span className="badge badge-info">{formatEtat(e.etat)}</span></TableCell>
                <TableCell>{e.vehicule_id ? vehicleLabel(e.vehicule_id) : '—'}</TableCell>
              </TableRow>
            ))}
            {!loading && exams.length === 0 && (
              <TableRow><TableCell colSpan={7} className="empty">Aucun examen enregistré</TableCell></TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
