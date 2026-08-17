import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useStudents } from '../hooks/useStudents';

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
        <button type="submit">Enregistrer</button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <table>
          <thead>
            <tr><th>Candidat</th><th>Montant</th><th>Date</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td data-label="Candidat">{studentName(p.candidat_id)}</td>
                <td data-label="Montant">€{Number(p.montant).toFixed(2)}</td>
                <td data-label="Date">{p.date_paiement ? new Date(`${p.date_paiement}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
              </tr>
            ))}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={3} className="empty">Aucun paiement enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
