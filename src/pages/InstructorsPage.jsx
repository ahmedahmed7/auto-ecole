import { useState } from 'react';
import { useInstructors } from '../hooks/useInstructors';
import { useAuth } from '../hooks/useAuth';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDialog from '../components/ConfirmDialog';

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
  const [pendingDelete, setPendingDelete] = useState(null);

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
  const requestDelete = (instructor) => setPendingDelete(instructor);
  const closeDeleteDialog = () => setPendingDelete(null);
  const confirmDelete = () => {
    if (!pendingDelete) return;
    remove(pendingDelete.id);
    closeDeleteDialog();
  };

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
          <Button type="submit" variant="contained">Activer mon profil moniteur</Button>
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
        <Button type="submit" variant="contained">Ajouter</Button>
      </form>

      {loading && <p className="loading">Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <TableContainer className="table-wrap">
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>CIN</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Spécialité</TableCell>
                <TableCell>Permis</TableCell>
                <TableCell>Liscence</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {instructors.map((i) => (
              <TableRow key={i.id} hover>
                <TableCell>{i.nom}</TableCell>
                <TableCell>{i.prenom}</TableCell>
                <TableCell>{i.cin}</TableCell>
                <TableCell>{i.email || '—'}</TableCell>
                <TableCell>{i.num_telephone || '—'}</TableCell>
                <TableCell>{i.specialite}</TableCell>
                <TableCell>{i.date_validite_permis ? new Date(`${i.date_validite_permis}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell>{i.date_validite_liscence ? new Date(`${i.date_validite_liscence}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Supprimer">
                    <IconButton color="error" size="small" onClick={() => requestDelete(i)} aria-label="Supprimer moniteur">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && instructors.length === 0 && (
              <TableRow><TableCell colSpan={9} className="empty">Aucun moniteur enregistré</TableCell></TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirmer la suppression"
        message={pendingDelete ? `Supprimer le moniteur ${pendingDelete.prenom} ${pendingDelete.nom} ?` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
