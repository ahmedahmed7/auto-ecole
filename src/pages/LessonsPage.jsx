import { useState } from 'react';
import Calendar       from '../components/Calendar';
import { useLessons }     from '../hooks/useLessons';
import { useStudents }    from '../hooks/useStudents';
import { useInstructors } from '../hooks/useInstructors';

export default function LessonsPage() {
  const { lessons, loading, error, schedule, cancel } = useLessons();
  const { students }    = useStudents();
  const { instructors } = useInstructors();

  const [form, setForm] = useState({
    student_id: '', instructor_id: '', duration_mins: 60,
    dateKey: '', heure: '',
  });
  const [formError, setFormError] = useState('');
  const [manualMode, setManualMode] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: key === 'duration_mins' ? Number(e.target.value) : e.target.value }));

  const handleCreneauSelect = ({ dateKey, heure }) =>
    setForm((f) => ({ ...f, dateKey, heure }));

  const handleManualDate = (e) => setForm((f) => ({ ...f, dateKey: e.target.value }));
  const handleManualTime = (e) => setForm((f) => ({ ...f, heure: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.dateKey || !form.heure) {
      setFormError('Veuillez sélectionner un créneau dans le calendrier');
      return;
    }
    try {
      const scheduled_at = new Date(`${form.dateKey}T${form.heure}:00`).toISOString();
      await schedule({
        student_id:    form.student_id,
        instructor_id: form.instructor_id,
        duration_mins: form.duration_mins,
        scheduled_at,
      }).unwrap();
      setForm({ student_id: '', instructor_id: '', duration_mins: 60, dateKey: '', heure: '' });
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de la planification');
    }
  };

  const studentName    = (id) => { const s = students.find((s) => s.ID === id); return s ? `${s.User?.Name} ${s.LastName}` : id; };
  const instructorName = (id) => { const i = instructors.find((i) => i.ID === id); return i ? i.User?.Name : id; };

  return (
    <div className="page">
      <h2>Leçons</h2>

      <div className="lesson-layout">
        <div className="card calendar-card">
          <div className="cal-mode-toggle">
            <button
              type="button"
              className={`cal-mode-btn${!manualMode ? ' active' : ''}`}
              onClick={() => { setManualMode(false); setForm((f) => ({ ...f, dateKey: '', heure: '' })); }}
            >📅 Calendrier</button>
            <button
              type="button"
              className={`cal-mode-btn${manualMode ? ' active' : ''}`}
              onClick={() => { setManualMode(true); setForm((f) => ({ ...f, dateKey: '', heure: '' })); }}
            >✏️ Manuel</button>
          </div>

          {manualMode ? (
            <div className="manual-inputs">
              <div className="field">
                <label>Date</label>
                <input type="date" value={form.dateKey} onChange={handleManualDate} min={new Date().toISOString().slice(0,10)} />
              </div>
              <div className="field">
                <label>Heure</label>
                <input type="time" value={form.heure} onChange={handleManualTime} step={900} />
              </div>
            </div>
          ) : (
            <>
              <h3 className="section-title">Choisir un créneau</h3>
              <Calendar
                onSelect={handleCreneauSelect}
                reservations={lessons.map((l) => ({
                  dateKey:      l.ScheduledAt.slice(0, 10),
                  heure:        l.ScheduledAt.slice(11, 16),
                  duration_mins: l.DurationMins,
                }))}
              />
            </>
          )}
        </div>

        <form className="card form lesson-form" onSubmit={handleSubmit}>
          <h3 className="section-title">Planifier une leçon</h3>

          {form.dateKey && form.heure && (
            <div className="creneau-badge">
              📅 {new Date(form.dateKey + 'T00:00:00').toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })} — {form.heure}
            </div>
          )}

          <div className="form-row">
            <div className="field">
              <label>Candidat</label>
              <select required value={form.student_id} onChange={set('student_id')}>
                <option value="">Sélectionner un candidat…</option>
                {students.map((s) => <option key={s.ID} value={s.ID}>{s.User?.Name} {s.LastName}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Moniteur</label>
              <select required value={form.instructor_id} onChange={set('instructor_id')}>
                <option value="">Sélectionner un moniteur…</option>
                {instructors.map((i) => <option key={i.ID} value={i.ID}>{i.User?.Name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Durée</label>
              <select value={form.duration_mins} onChange={set('duration_mins')}>
                <option value={60}>1h</option>
                <option value={90}>1h30</option>
                <option value={120}>2h</option>
                <option value={180}>3h</option>
                <option value={240}>4h</option>
              </select>
            </div>
          </div>

          {formError && <p className="error">{formError}</p>}
          <button type="submit">Planifier</button>
        </form>
      </div>

      {loading && <p className="loading">Chargement…</p>}
      {error   && <p className="error">{error}</p>}

      <div className="card">
        <table>
          <thead>
            <tr><th>Candidat</th><th>Moniteur</th><th>Durée</th><th>Planifié le</th><th></th></tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.ID}>
                <td data-label="Candidat">{studentName(l.StudentID)}</td>
                <td data-label="Moniteur">{instructorName(l.InstructorID)}</td>
                <td data-label="Durée">{l.DurationMins >= 60 ? `${Math.floor(l.DurationMins/60)}h${l.DurationMins%60 ? l.DurationMins%60 : ''}` : `${l.DurationMins}min`}</td>
                <td data-label="Planifié le">{new Date(l.ScheduledAt).toLocaleString('fr-FR')}</td>
                <td><button className="btn-danger" onClick={() => cancel(l.ID)}>Annuler</button></td>
              </tr>
            ))}
            {!loading && lessons.length === 0 && (
              <tr><td colSpan={5} className="empty">Aucune leçon planifiée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
