import { Paper, Typography } from '@mui/material';

export default function UsuariosPage() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Usuarios (solo admin)
      </Typography>
      <Typography color="textSecondary">
        Aquí irá la gestión de usuarios.
      </Typography>
    </Paper>
  );
}