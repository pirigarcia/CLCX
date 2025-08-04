import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Matriz', icon: <TableChartIcon />, path: '/matriz' },
  { text: 'Gráficas', icon: <BarChartIcon />, path: '/graficas' },
  { text: 'Parámetros', icon: <InfoIcon />, path: '/parametros' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios' }, // solo admin, por ahora visible para todos
];

export default function Sidebar() {
  return (
    <Drawer variant="permanent" sx={{ width: 220, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box' } }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          The Unknown Shopper
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map(item => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}