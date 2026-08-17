import { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDialog from '../components/ConfirmDialog';

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
  const [pendingDelete, setPendingDelete] = useState(null);

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

  const requestDelete = (student) => setPendingDelete(student);
  const closeDeleteDialog = () => setPendingDelete(null);
  const confirmDelete = () => {
    if (!pendingDelete) return;
    remove(pendingDelete.id);
    closeDeleteDialog();
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
          <Button type="submit" variant="contained">{editingId ? 'Mettre à jour' : 'Ajouter'}</Button>
          {editingId && (
            <Button type="button" variant="outlined" onClick={cancelEdit}>
              Annuler
            </Button>
          )}
        </div>
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
                <TableCell>Naissance</TableCell>
                <TableCell>Lunette</TableCell>
                <TableCell>Observation</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {students.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>{s.nom}</TableCell>
                <TableCell>{s.prenom}</TableCell>
                <TableCell>{s.cin}</TableCell>
                <TableCell>{s.email || '—'}</TableCell>
                <TableCell>{s.num_telephone || '—'}</TableCell>
                <TableCell>{s.date_de_naissance ? new Date(`${s.date_de_naissance}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell>{s.lunette ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{s.observation || '—'}</TableCell>
                <TableCell align="right">
                  <div className="row-actions">
                    <Tooltip title="Modifier">
                      <IconButton color="primary" size="small" onClick={() => startEdit(s)} aria-label="Modifier candidat">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="error" size="small" onClick={() => requestDelete(s)} aria-label="Supprimer candidat">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && students.length === 0 && (
              <TableRow><TableCell colSpan={9} className="empty">Aucun candidat enregistré</TableCell></TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirmer la suppression"
        message={pendingDelete ? `Supprimer le candidat ${pendingDelete.prenom} ${pendingDelete.nom} ?` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
