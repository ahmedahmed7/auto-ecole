import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
