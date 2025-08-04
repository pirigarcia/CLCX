import { Grid, Paper, Typography } from '@mui/material';

const kpis = [
  { label: 'Evaluaciones del mes', value: 25 },
  { label: 'Promedio general', value: '88%' },
  { label: 'Mejor sucursal', value: 'Altabrisa' },
  { label: 'Peor sucursal', value: 'Pista' },
];

export default function KpiCards() {
  return (
    <Grid container spacing={2}>
      {kpis.map((kpi, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">{kpi.label}</Typography>
            <Typography variant="h4">{kpi.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}