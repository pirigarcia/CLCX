import { Paper, Typography } from '@mui/material';

export default function GraficasPage() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gráficas Comparativas
      </Typography>
      <div style={{ height: 220, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="textSecondary">Aquí irán las gráficas comparativas</Typography>
      </div>
    </Paper>
  );
}