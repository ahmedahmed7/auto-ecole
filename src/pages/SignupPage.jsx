import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage({ onSwitch }) {
  const { signup, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirm) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await signup({ name: form.name, email: form.email, password: form.password }).unwrap();
    } catch (err) {
      setLocalError(err.message ?? 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🚗</span>
          <h1>Auto École</h1>
        </div>
        <h2>Créer un compte</h2>
        <p className="auth-subtitle">Rejoignez-nous pour gérer vos cours.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Nom complet</label>
            <input required value={form.name} onChange={set('name')} placeholder="Jean Dupont" />
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
          <button className="auth-link" onClick={onSwitch}>Se connecter</button>
        </p>
      </div>
    </div>
  );
}
