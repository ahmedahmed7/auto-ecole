import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useStudents } from '../hooks/useStudents';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const emptyForm = {
  candidat_id: '',
  montant: '',
  date_paiement: '',
};

export default function PaymentsPage() {
  const { payments, loading, error, record } = usePayments();
  const { students } = useStudents();

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const montant = Number.parseFloat(form.montant);
    if (!Number.isFinite(montant) || montant <= 0) {
      setFormError('Le montant doit être un nombre positif');
      return;
    }
    try {
      await record({
        candidat_id: form.candidat_id,
        montant,
        date_paiement: form.date_paiement,
      }).unwrap();
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de l\'enregistrement du paiement');
    }
  };

  const studentName = (id) => {
    const s = students.find((item) => item.id === id);
    return s ? `${s.prenom} ${s.nom}` : id;
  };

  return (
    <div className="page">
      <h2>Paiements</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Enregistrer un paiement</h3>
        <div className="form-row">
          <div className="field">
            <label>Candidat</label>
            <select required value={form.candidat_id} onChange={set('candidat_id')}>
              <option value="">Sélectionner un candidat…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.prenom} {s.nom}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Montant</label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.montant}
              onChange={set('montant')}
              placeholder="0.00"
            />
          </div>
          <div className="field">
            <label>Date de paiement</label>
            <input type="date" required value={form.date_paiement} onChange={set('date_paiement')} />
          </div>
        </div>
        {formError && <p className="error">{formError}</p>}
        <Button type="submit" variant="contained">Enregistrer</Button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <TableContainer className="table-wrap">
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow><TableCell>Candidat</TableCell><TableCell>Montant</TableCell><TableCell>Date</TableCell></TableRow>
            </TableHead>
            <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{studentName(p.candidat_id)}</TableCell>
                <TableCell>€{Number(p.montant).toFixed(2)}</TableCell>
                <TableCell>{p.date_paiement ? new Date(`${p.date_paiement}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
              </TableRow>
            ))}
            {!loading && payments.length === 0 && (
              <TableRow><TableCell colSpan={3} className="empty">Aucun paiement enregistré</TableCell></TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
