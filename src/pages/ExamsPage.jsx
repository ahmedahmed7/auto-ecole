import { useState } from 'react';
import { useExams }    from '../hooks/useExams';
import { useStudents } from '../hooks/useStudents';

export default function ExamsPage() {
  const { exams, loading, error, record } = useExams();
  const { students } = useStudents();

  const [form, setForm] = useState({ student_id: '', type: 'code', score: 0 });
  const [formError, setFormError] = useState('');

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: key === 'score' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await record(form).unwrap();
      setForm({ student_id: '', type: 'code', score: 0 });
    } catch (err) {
      setFormError(err.message ?? 'Failed to record exam');
    }
  };

  const studentName = (id) => students.find((s) => s.ID === id)?.Name ?? id;

  return (
    <div className="page">
      <h2>Examens</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Enregistrer un examen</h3>
        <div className="form-row">
          <div className="field">
            <label>Candidat</label>
            <select required value={form.student_id} onChange={set('student_id')}>
              <option value="">Sélectionner un candidat…</option>
              {students.map((s) => <option key={s.ID} value={s.ID}>{s.Name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={set('type')}>
              <option value="code">Code</option>
              <option value="conduite">Conduite</option>
            </select>
          </div>
          <div className="field">
            <label>Score (0–100)</label>
            <input type="number" min={0} max={100} value={form.score} onChange={set('score')} />
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
            <tr><th>Candidat</th><th>Type</th><th>Score</th><th>Résultat</th><th>Date</th></tr>
          </thead>
          <tbody>
            {exams.map((e) => (
              <tr key={e.ID}>
                <td data-label="Candidat">{studentName(e.StudentID)}</td>
                <td data-label="Type"><span className={`badge badge-${e.Type}`}>{e.Type}</span></td>
                <td data-label="Score">{e.Score}</td>
                <td data-label="Résultat">
                  <span className={`badge ${e.Passed ? 'badge-success' : 'badge-fail'}`}>
                    {e.Passed ? 'Reçu' : 'Échoué'}
                  </span>
                </td>
                <td data-label="Date">{new Date(e.TakenAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {!loading && exams.length === 0 && (
              <tr><td colSpan={5} className="empty">Aucun examen enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
