import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const parametros = [
  { nombre: 'Saludo', descripcion: 'El colaborador saludó y estableció contacto visual.' },
  { nombre: 'Agradecimiento', descripcion: 'El colaborador dio las gracias e invitó a volver.' },
  { nombre: 'Producto del mes', descripcion: 'Mencionó el producto del mes.' },
];

export default function ParametrosExplicacion() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Parámetros de Evaluación
      </Typography>
      {parametros.map((param, idx) => (
        <Accordion key={idx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{param.nombre}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{param.descripcion}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}