import { useState } from 'react';
import { useVehicules } from '../hooks/useVehicules';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = {
  immatriculation: '',
  type: '',
  categorie: '',
  nb_klm: '',
  feuille_de_route: '',
  date_visite_technique: '',
  date_assurance: '',
  date_mise_en_circulation: '',
};

export default function VehiculesPage() {
  const { vehicules, loading, error, create, remove } = useVehicules();
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await create({
        ...form,
        nb_klm: Number(form.nb_klm),
      }).unwrap();
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message ?? 'Erreur lors de l\'ajout');
    }
  };

  const requestDelete = (vehicule) => setPendingDelete(vehicule);
  const closeDeleteDialog = () => setPendingDelete(null);
  const confirmDelete = () => {
    if (!pendingDelete) return;
    remove(pendingDelete.id);
    closeDeleteDialog();
  };

  return (
    <div className="page">
      <h2>Véhicules</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Ajouter un véhicule</h3>
        <div className="form-row">
          <div className="field">
            <label>Immatriculation</label>
            <input required value={form.immatriculation} onChange={set('immatriculation')} placeholder="AB-123-CD" />
          </div>
          <div className="field">
            <label>Type</label>
            <input required value={form.type} onChange={set('type')} placeholder="Voiture" />
          </div>
          <div className="field">
            <label>Catégorie</label>
            <input required value={form.categorie} onChange={set('categorie')} placeholder="B" />
          </div>
          <div className="field">
            <label>Kilométrage</label>
            <input type="number" min={0} value={form.nb_klm} onChange={set('nb_klm')} placeholder="0" />
          </div>
          <div className="field">
            <label>Feuille de route</label>
            <input type="date" required value={form.feuille_de_route} onChange={set('feuille_de_route')} />
          </div>
          <div className="field">
            <label>Contrôle technique</label>
            <input type="date" required value={form.date_visite_technique} onChange={set('date_visite_technique')} />
          </div>
          <div className="field">
            <label>Assurance</label>
            <input type="date" required value={form.date_assurance} onChange={set('date_assurance')} />
          </div>
          <div className="field">
            <label>Mise en circulation</label>
            <input type="date" required value={form.date_mise_en_circulation} onChange={set('date_mise_en_circulation')} />
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
                <TableCell>Immatriculation</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Km</TableCell>
                <TableCell>Feuille</TableCell>
                <TableCell>CT</TableCell>
                <TableCell>Assurance</TableCell>
                <TableCell>Mise en circ.</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {vehicules.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.immatriculation}</TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell>{v.categorie}</TableCell>
                <TableCell>{Number(v.nb_klm).toLocaleString('fr-FR')}</TableCell>
                <TableCell>{v.feuille_de_route ? new Date(`${v.feuille_de_route}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell>{v.date_visite_technique ? new Date(`${v.date_visite_technique}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell>{v.date_assurance ? new Date(`${v.date_assurance}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell>{v.date_mise_en_circulation ? new Date(`${v.date_mise_en_circulation}T00:00:00`).toLocaleDateString('fr-FR') : '—'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Supprimer">
                    <IconButton color="error" size="small" onClick={() => requestDelete(v)} aria-label="Supprimer véhicule">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && vehicules.length === 0 && (
              <TableRow><TableCell colSpan={9} className="empty">Aucun véhicule enregistré</TableCell></TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirmer la suppression"
        message={pendingDelete ? `Supprimer le véhicule ${pendingDelete.immatriculation} ?` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
