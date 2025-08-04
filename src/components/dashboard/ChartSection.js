import { Paper, Typography } from '@mui/material';

export default function ChartSection() {
  return (
    <Paper sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>
        Gráficas (próximamente)
      </Typography>
      <div style={{ height: 220, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="textSecondary">Aquí irán las gráficas de desempeño</Typography>
      </div>
    </Paper>
  );
}