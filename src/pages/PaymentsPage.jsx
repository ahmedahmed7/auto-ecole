import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useStudents } from '../hooks/useStudents';

export default function PaymentsPage() {
  const { payments, loading, error, record } = usePayments();
  const { students } = useStudents();

  const [form, setForm] = useState({ student_id: '', amount_euros: '', description: '' });
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const amount_cents = Math.round(parseFloat(form.amount_euros) * 100);
    if (isNaN(amount_cents) || amount_cents <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }
    try {
      await record({ student_id: form.student_id, amount_cents, description: form.description }).unwrap();
      setForm({ student_id: '', amount_euros: '', description: '' });
    } catch (err) {
      setFormError(err.message ?? 'Failed to record payment');
    }
  };

  const studentName = (id) => students.find((s) => s.ID === id)?.Name ?? id;

  return (
    <div className="page">
      <h2>Paiements</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Enregistrer un paiement</h3>
        <div className="form-row">
          <div className="field">
            <label>Candidat</label>
            <select required value={form.student_id} onChange={set('student_id')}>
              <option value="">Sélectionner un candidat…</option>
              {students.map((s) => <option key={s.ID} value={s.ID}>{s.Name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Montant (€)</label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount_euros}
              onChange={set('amount_euros')}
              placeholder="0.00"
            />
          </div>
          <div className="field">
            <label>Description</label>
            <input value={form.description} onChange={set('description')} placeholder="Note optionnelle…" />
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
            <tr><th>Candidat</th><th>Montant</th><th>Description</th><th>Payé le</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.ID}>
                <td data-label="Candidat">{studentName(p.StudentID)}</td>
                <td data-label="Montant">€{(p.AmountCents / 100).toFixed(2)}</td>
                <td data-label="Description">{p.Description || '—'}</td>
                <td data-label="Payé le">{new Date(p.PaidAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={4} className="empty">Aucun paiement enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
