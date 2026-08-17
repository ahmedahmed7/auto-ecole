import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage({ onSwitch }) {
  const { signup, loading, error } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    num_telephone: '',
    date_de_naissance: '',
    password: '',
    confirm: '',
  });
  const [localError, setLocalError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirm) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await signup({
        nom: form.nom,
        prenom: form.prenom,
        cin: form.cin,
        email: form.email,
        num_telephone: form.num_telephone,
        date_de_naissance: form.date_de_naissance,
        date_naissance: form.date_de_naissance,
        password: form.password,
      }).unwrap();
    } catch (err) {
      setLocalError(err.message ?? 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <span className="auth-logo-icon">🚗</span>
          <h1>Auto École</h1>
        </div>
        <h2>Créer un compte</h2>
        <p className="auth-subtitle">Rejoignez-nous pour gérer vos dossiers.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="field">
              <label>Nom</label>
              <input required value={form.nom} onChange={set('nom')} />
            </div>
            <div className="field">
              <label>Prénom</label>
              <input required value={form.prenom} onChange={set('prenom')} />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>CIN</label>
              <input required value={form.cin} onChange={set('cin')} />
            </div>
            <div className="field">
              <label>Téléphone</label>
              <input required value={form.num_telephone} onChange={set('num_telephone')} />
            </div>
          </div>
          <div className="field">
            <label>Date de naissance</label>
            <input type="date" required value={form.date_de_naissance} onChange={set('date_de_naissance')} />
          </div>
          <div className="field">
            <label>Adresse e-mail</label>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="votre@email.com" />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="Minimum 6 caractères" />
          </div>
          <div className="field">
            <label>Confirmer le mot de passe</label>
            <input type="password" required value={form.confirm} onChange={set('confirm')} placeholder="••••••••" />
          </div>

          {(localError || error) && <p className="auth-error">{localError || error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Création…' : "S'inscrire"}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ?{' '}
          <button type="button" className="auth-link" onClick={onSwitch}>Se connecter</button>
        </p>
      </div>
    </div>
  );
}
