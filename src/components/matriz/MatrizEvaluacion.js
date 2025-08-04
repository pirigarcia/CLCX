import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const sucursales = ['Altabrisa', 'Américas', 'Ángeles', 'Galerías'];
const parametros = ['Saludo', 'Agradecimiento', 'Producto del mes', 'Tiempo de espera'];

export default function MatrizEvaluacion() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Matriz de Evaluación
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sucursal</TableCell>
            {parametros.map(param => (
              <TableCell key={param}>{param}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sucursales.map(sucursal => (
            <TableRow key={sucursal}>
              <TableCell>{sucursal}</TableCell>
              {parametros.map(param => (
                <TableCell key={param}>-</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}