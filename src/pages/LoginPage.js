import { Paper, Typography, TextField, Button } from '@mui/material';

export default function LoginPage() {
  return (
    <Paper sx={{ padding: 4, maxWidth: 400, margin: '40px auto' }}>
      <Typography variant="h5" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField label="Usuario" fullWidth margin="normal" />
      <TextField label="Contraseña" type="password" fullWidth margin="normal" />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Entrar
      </Button>
    </Paper>
  );
}