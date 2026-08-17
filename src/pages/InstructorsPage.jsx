import { useState } from 'react';
import { useInstructors } from '../hooks/useInstructors';
import { useAuth } from '../hooks/useAuth';

const emptyForm = {
  nom: '',
  prenom: '',
  cin: '',
  email: '',
  num_telephone: '',
  date_de_naissance: '',
  date_validite_permis: '',
  date_validite_liscence: '',
  specialite: '',
};

export default function InstructorsPage() {
  const { instructors, loading, error, create, promote, remove, refresh } = useInstructors();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [promoteForm, setPromoteForm] = useState({
    specialite: '',
    date_validite_permis: '',
    date_validite_liscence: '',
  });
  const [promoteError, setPromoteError] = useState('');
  const [promoted, setPromoted] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await create({
        ...form,
        date_naissance: form.date_de_naissance,
      }).unwrap();
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de la création du moniteur');
    }
  };

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    setPromoteError('');
    try {
      await promote(promoteForm).unwrap();
      await refresh().unwrap();

      const stored = JSON.parse(localStorage.getItem('auth') || 'null');
      if (stored?.user) {
        localStorage.setItem('auth', JSON.stringify({
          ...stored,
          user: { ...stored.user, role_type: 'moniteur' },
        }));
      }
      setPromoted(true);
    } catch (err) {
      setPromoteError(err.message ?? 'Erreur lors de la conversion en moniteur');
    }
  };

  const setPromote = (key) => (e) => setPromoteForm((f) => ({ ...f, [key]: e.target.value }));
  const canPromote = !promoted && user?.role_type !== 'moniteur';

  return (
    <div className="page">
      <h2>Moniteurs</h2>

      {canPromote && (
        <form className="card form" onSubmit={handlePromoteSubmit}>
          <h3>Devenir moniteur avec ce compte</h3>
          <div className="form-row">
            <div className="field">
              <label>Spécialité</label>
              <input required value={promoteForm.specialite} onChange={setPromote('specialite')} />
            </div>
            <div className="field">
              <label>Validité permis</label>
              <input type="date" required value={promoteForm.date_validite_permis} onChange={setPromote('date_validite_permis')} />
            </div>
            <div className="field">
              <label>Validité liscence</label>
              <input type="date" required value={promoteForm.date_validite_liscence} onChange={setPromote('date_validite_liscence')} />
            </div>
          </div>
          {promoteError && <p className="error">{promoteError}</p>}
          <button type="submit">Activer mon profil moniteur</button>
        </form>
      )}

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Ajouter un moniteur</h3>
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
            <input type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.num_telephone} onChange={set('num_telephone')} />
          </div>
          <div className="field">
            <label>Date de naissance</label>
            <input type="date" required value={form.date_de_naissance} onChange={set('date_de_naissance')} />
          </div>
          <div className="field">
            <label>Validité permis</label>
            <input type="date" required value={form.date_validite_permis} onChange={set('date_validite_permis')} />
          </div>
          <div className="field">
            <label>Validité liscence</label>
            <input type="date" required value={form.date_validite_liscence} onChange={set('date_validite_liscence')} />
          </div>
          <div className="field">
            <label>Spécialité</label>
            <input required value={form.specialite} onChange={set('specialite')} />
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
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>CIN</th>
              <th>E-mail</th>
              <th>Téléphone</th>
              <th>Spécialité</th>
              <th>Permis</th>
              <th>Liscence</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((i) => (
              <tr key={i.id}>
                <td data-label="Nom">{i.nom}</td>
                <td data-label="Prénom">{i.prenom}</td>
                <td data-label="CIN">{i.cin}</td>
                <td data-label="E-mail">{i.email || '—'}</td>
                <td data-label="Téléphone">{i.num_telephone || '—'}</td>
                <td data-label="Spécialité">{i.specialite}</td>
                <td data-label="Permis">{i.date_validite_permis ? new Date(`${i.date_validite_permis}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td data-label="Liscence">{i.date_validite_liscence ? new Date(`${i.date_validite_liscence}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</td>
                <td>
                  <button type="button" className="btn-danger" onClick={() => remove(i.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!loading && instructors.length === 0 && (
              <tr><td colSpan={9} className="empty">Aucun moniteur enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
