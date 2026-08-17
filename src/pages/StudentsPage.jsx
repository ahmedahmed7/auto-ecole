import { useState } from 'react';
import { useStudents } from '../hooks/useStudents';

const emptyForm = {
  nom: '',
  prenom: '',
  cin: '',
  email: '',
  num_telephone: '',
  date_de_naissance: '',
  lunette: false,
  observation: '',
};

export default function StudentsPage() {
  const { students, loading, error, create, update, remove, refresh } = useStudents();
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: key === 'lunette' ? e.target.checked : e.target.value }));

  const startEdit = (student) => {
    setEditingId(student.id);
    setForm({
      nom: student.nom ?? '',
      prenom: student.prenom ?? '',
      cin: student.cin ?? '',
      email: student.email ?? '',
      num_telephone: student.num_telephone ?? '',
      date_de_naissance: student.date_de_naissance ?? '',
      lunette: !!student.lunette,
      observation: student.observation ?? '',
    });
    setFormError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload = {
        ...form,
        date_naissance: form.date_de_naissance,
      };

      if (editingId) {
        await update(editingId, payload).unwrap();
      } else {
        await create(payload).unwrap();
      }
      await refresh().unwrap();
      cancelEdit();
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de l\'enregistrement du candidat');
    }
  };

  return (
    <div className="page">
      <h2>Candidats</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Modifier le candidat' : 'Ajouter un candidat'}</h3>
        <div className="form-row">
          <div className="field">
            <label>Nom</label>
            <input required value={form.nom} onChange={set('nom')} />
          </div>
          <div className="field">
            <label>Prénom</label>
            <input required value={form.prenom} onChange={set('prenom')} />
          </div>
          <div className="field">
            <label>CIN</label>
            <input required value={form.cin} onChange={set('cin')} />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jean@email.com" />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.num_telephone} onChange={set('num_telephone')} placeholder="06 00 00 00 00" />
          </div>
          <div className="field">
            <label>Date de naissance</label>
            <input type="date" required value={form.date_de_naissance} onChange={set('date_de_naissance')} />
          </div>
          <div className="field checkbox-field">
            <label>
              <input type="checkbox" checked={form.lunette} onChange={set('lunette')} />
              Lunette
            </label>
          </div>
        </div>
        <div className="field">
          <label>Observation</label>
          <textarea rows="3" value={form.observation} onChange={set('observation')} />
        </div>
        {formError && <p className="error">{formError}</p>}
        <div className="actions-row">
          <button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>CIN</th>
              <th>E-mail</th>
              <th>Téléphone</th>
              <th>Naissance</th>
              <th>Lunette</th>
              <th>Observation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td data-label="Nom">{s.nom}</td>
                <td data-label="Prénom">{s.prenom}</td>
                <td data-label="CIN">{s.cin}</td>
                <td data-label="E-mail">{s.email || '—'}</td>
                <td data-label="Téléphone">{s.num_telephone || '—'}</td>
                <td data-label="Naissance">{s.date_de_naissance ? new Date(`${s.date_de_naissance}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td data-label="Lunette">{s.lunette ? 'Oui' : 'Non'}</td>
                <td data-label="Observation">{s.observation || '—'}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="btn-secondary" onClick={() => startEdit(s)}>Modifier</button>
                    <button type="button" className="btn-danger" onClick={() => remove(s.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && students.length === 0 && (
              <tr><td colSpan={9} className="empty">Aucun candidat enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
