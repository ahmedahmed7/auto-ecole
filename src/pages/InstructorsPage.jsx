import { useState } from 'react';
import { useInstructors } from '../hooks/useInstructors';

export default function InstructorsPage() {
  const { instructors, loading, error, create, remove } = useInstructors();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await create(form).unwrap();
      setForm({ name: '', email: '', phone: '' });
    } catch (err) {
      setFormError(err.message ?? 'Failed to create instructor');
    }
  };

  return (
    <div className="page">
      <h2>Moniteurs</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Ajouter un moniteur</h3>
        <div className="form-row">
          <div className="field">
            <label>Nom</label>
            <input required value={form.name} onChange={set('name')} placeholder="Marie Martin" />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input required type="email" value={form.email} onChange={set('email')} placeholder="marie@email.com" />
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
            <tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Ajouté le</th><th></th></tr>
          </thead>
          <tbody>
            {instructors.map((i) => (
              <tr key={i.ID}>
                <td data-label="Nom">{i.User?.Name}</td>
                <td data-label="E-mail">{i.User?.Email}</td>
                <td data-label="Téléphone">{i.Phone || '—'}</td>
                <td data-label="Ajouté le">{new Date(i.CreatedAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="btn-danger" onClick={() => remove(i.ID)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!loading && instructors.length === 0 && (
              <tr><td colSpan={5} className="empty">Aucun moniteur enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
