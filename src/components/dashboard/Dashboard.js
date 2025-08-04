import { Grid, Typography } from '@mui/material';
import KpiCards from './KpiCards';
import ChartSection from './ChartSection';

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard General
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <KpiCards />
      </Grid>
      <Grid item xs={12}>
        <ChartSection />
      </Grid>
    </Grid>
  );
}