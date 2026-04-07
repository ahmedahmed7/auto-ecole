import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage({ onSwitch }) {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(form).unwrap();
    } catch (err) {
      setLocalError(err.message ?? 'Identifiants invalides');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🚗</span>
          <h1>Auto École</h1>
        </div>
        <h2>Connexion</h2>
        <p className="auth-subtitle">Bienvenue ! Connectez-vous à votre compte.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Adresse e-mail</label>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="votre@email.com" />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>

          {(localError || error) && <p className="auth-error">{localError || error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-switch">
          Pas encore de compte ?{' '}
          <button className="auth-link" onClick={onSwitch}>Créer un compte</button>
        </p>
      </div>
    </div>
  );
}
