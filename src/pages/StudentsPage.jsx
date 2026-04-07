import { useState } from 'react';
import { useStudents } from '../hooks/useStudents';

export default function StudentsPage() {
  const { students, loading, error, create, remove } = useStudents();
  const [form, setForm] = useState({ name: '', last_name: '', email: '', phone: '', cin: '' });
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await create({ ...form, cin: Number(form.cin) }).unwrap();
      setForm({ name: '', last_name: '', email: '', phone: '', cin: '' });
    } catch (err) {
      setFormError(err.message ?? 'Failed to create student');
    }
  };

  return (
    <div className="page">
      <h2>Candidats</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Ajouter un candidat</h3>
        <div className="form-row">
          <div className="field">
            <label>Prénom</label>
            <input required value={form.name} onChange={set('name')} placeholder="Jean" />
          </div>
          <div className="field">
            <label>Nom</label>
            <input required value={form.last_name} onChange={set('last_name')} placeholder="Dupont" />
          </div>
          <div className="field">
            <label>CIN</label>
            <input required type="number" min="1" value={form.cin} onChange={set('cin')} placeholder="12345678" />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input required type="email" value={form.email} onChange={set('email')} placeholder="jean@email.com" />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="06 00 00 00 00" />
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
            <tr><th>Prénom</th><th>Nom</th><th>CIN</th><th>E-mail</th><th>Téléphone</th><th>Inscrit le</th><th></th></tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.ID}>
                <td data-label="Prénom">{s.User?.Name}</td>
                <td data-label="Nom">{s.LastName}</td>
                <td data-label="CIN">{s.Cin}</td>
                <td data-label="E-mail">{s.User?.Email}</td>
                <td data-label="Téléphone">{s.Phone || '—'}</td>
                <td data-label="Inscrit le">{new Date(s.CreatedAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="btn-danger" onClick={() => remove(s.ID)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!loading && students.length === 0 && (
              <tr><td colSpan={7} className="empty">Aucun candidat enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

