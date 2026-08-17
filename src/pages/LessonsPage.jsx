import { useState } from 'react';
import Calendar from '../components/Calendar';
import { useLessons } from '../hooks/useLessons';
import { useStudents } from '../hooks/useStudents';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = {
  candidat_id: '',
  dateKey: '',
  heure: '',
  duration_mins: 120,
  lieu_rencontre: '',
};

const durationOptions = [
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
  { label: '3h', value: 180 },
];

function toIso(dateKey, heure) {
  return new Date(`${dateKey}T${heure}:00`).toISOString();
}

function parseLessonDateTime(value) {
  if (!value) return null;

  const nativeDate = new Date(value);
  if (!Number.isNaN(nativeDate.getTime())) {
    return nativeDate;
  }

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const [, day, month, year, hour, minute, second = '00'] = match;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
}

export default function LessonsPage() {
  const { lessons, loading, error, schedule, cancel, refresh } = useLessons();
  const { students } = useStudents();

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(null);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: key === 'duration_mins' ? Number(e.target.value) : e.target.value }));

  const reservations = lessons
    .filter((l) => l.date_h_debut && l.date_h_fin)
    .map((l) => {
      const start = parseLessonDateTime(l.date_h_debut);
      const end = parseLessonDateTime(l.date_h_fin);
      if (!start || !end) {
        return null;
      }

      const dateKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
      const heure = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
      const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);

      return {
        dateKey,
        heure,
        duration_mins: Math.max(30, durationMins),
      };
    })
    .filter(Boolean);

  const handleCreneauSelect = ({ dateKey, heure }) =>
    setForm((f) => ({ ...f, dateKey, heure }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.dateKey || !form.heure) {
      setFormError('Veuillez sélectionner un créneau');
      return;
    }
    if (!form.lieu_rencontre) {
      setFormError('Veuillez saisir le lieu de rencontre');
      return;
    }

    try {
      const date_h_debut = toIso(form.dateKey, form.heure);
      const date_h_fin = new Date(new Date(date_h_debut).getTime() + form.duration_mins * 60000).toISOString();
      await schedule({
        candidat_id: form.candidat_id,
        date_h_debut,
        date_h_fin,
        lieu_rencontre: form.lieu_rencontre,
      }).unwrap();
      await refresh().unwrap();
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de la planification');
    }
  };

  const studentName = (id) => {
    const s = students.find((item) => item.id === id);
    return s ? `${s.prenom} ${s.nom}` : id;
  };

  const requestCancel = (lesson) => setPendingCancel(lesson);
  const closeCancelDialog = () => setPendingCancel(null);
  const confirmCancel = () => {
    if (!pendingCancel) return;
    cancel(pendingCancel.id);
    closeCancelDialog();
  };

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
            >
              📅 Calendrier
            </button>
            <button
              type="button"
              className={`cal-mode-btn${manualMode ? ' active' : ''}`}
              onClick={() => { setManualMode(true); setForm((f) => ({ ...f, dateKey: '', heure: '' })); }}
            >
              ✏️ Manuel
            </button>
          </div>

          {manualMode ? (
            <div className="manual-inputs">
              <div className="field">
                <label>Date</label>
                <input type="date" value={form.dateKey} onChange={set('dateKey')} min={new Date().toISOString().slice(0, 10)} />
              </div>
              <div className="field">
                <label>Heure</label>
                <input type="time" value={form.heure} onChange={set('heure')} step={900} />
              </div>
            </div>
          ) : (
            <Calendar
              onSelect={handleCreneauSelect}
              reservations={reservations}
            />
          )}
        </div>

        <form className="card form lesson-form" onSubmit={handleSubmit}>
          <h3 className="section-title">Planifier une leçon</h3>

          {form.dateKey && form.heure && (
            <div className="creneau-badge">
              📅 {new Date(`${form.dateKey}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} — {form.heure}
            </div>
          )}

          <div className="form-row">
            <div className="field">
              <label>Candidat</label>
              <select required value={form.candidat_id} onChange={set('candidat_id')}>
                <option value="">Sélectionner un candidat…</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.prenom} {s.nom}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Durée</label>
              <select value={form.duration_mins} onChange={set('duration_mins')}>
                {durationOptions.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Lieu de rencontre</label>
              <input required value={form.lieu_rencontre} onChange={set('lieu_rencontre')} />
            </div>
          </div>

          {formError && <p className="error">{formError}</p>}
          <Button type="submit" variant="contained">Planifier</Button>
        </form>
      </div>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <TableContainer className="table-wrap">
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow><TableCell>Candidat</TableCell><TableCell>Début</TableCell><TableCell>Fin</TableCell><TableCell>Lieu</TableCell><TableCell align="right"></TableCell></TableRow>
            </TableHead>
            <TableBody>
            {lessons.map((l) => (
              <TableRow key={l.id} hover>
                <TableCell>{studentName(l.candidat_id)}</TableCell>
                <TableCell>{l.date_h_debut ? new Date(l.date_h_debut).toLocaleString('fr-FR') : '—'}</TableCell>
                <TableCell>{l.date_h_fin ? new Date(l.date_h_fin).toLocaleString('fr-FR') : '—'}</TableCell>
                <TableCell>{l.lieu_rencontre}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Annuler">
                    <IconButton color="error" size="small" onClick={() => requestCancel(l)} aria-label="Annuler leçon">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && lessons.length === 0 && (
              <TableRow><TableCell colSpan={5} className="empty">Aucune leçon planifiée</TableCell></TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title="Confirmer l'annulation"
        message={pendingCancel ? `Annuler la leçon de ${studentName(pendingCancel.candidat_id)} ?` : ''}
        confirmLabel="Annuler la leçon"
        onConfirm={confirmCancel}
        onCancel={closeCancelDialog}
      />
    </div>
  );
}
