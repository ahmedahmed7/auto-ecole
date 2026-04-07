import { useState } from 'react';
import { useAuth }      from './hooks/useAuth';
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import StudentsPage     from './pages/StudentsPage';
import InstructorsPage  from './pages/InstructorsPage';
import LessonsPage      from './pages/LessonsPage';
import ExamsPage        from './pages/ExamsPage';
import PaymentsPage     from './pages/PaymentsPage';
import VehiculesPage    from './pages/VehiculesPage';

const TABS = [
  { key: 'students',    label: 'Candidats',  icon: '👤' },
  { key: 'instructors', label: 'Moniteurs',  icon: '🧑‍🏫' },
  { key: 'lessons',     label: 'Leçons',     icon: '🚗' },
  { key: 'exams',       label: 'Examens',    icon: '📝' },
  { key: 'payments',    label: 'Paiements',  icon: '💶' },
  { key: 'vehicules',   label: 'Véhicules',  icon: '🚙' },
];
const PAGES = {
  students:    StudentsPage,
  instructors: InstructorsPage,
  lessons:     LessonsPage,
  exams:       ExamsPage,
  payments:    PaymentsPage,
  vehicules:   VehiculesPage,
};

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [tab,        setTab]        = useState('students');
  const [showSignup, setShowSignup] = useState(false);

  if (!isAuthenticated) {
    return showSignup
      ? <SignupPage  onSwitch={() => setShowSignup(false)} />
      : <LoginPage   onSwitch={() => setShowSignup(true)}  />;
  }

  const Page = PAGES[tab];

  return (
    <div className="app">
      <header className="header">
        <h1>🚗 Auto École</h1>
        {/* Desktop tab bar */}
        <nav className="tabs">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`tab-btn${tab === key ? ' active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="user-bar">
          <span className="user-name">👤 {user?.name}</span>
          <button className="logout-btn" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <main className="main">
        <Page />
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`bottom-nav-btn${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
