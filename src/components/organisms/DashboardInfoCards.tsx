import Grid from '@mui/material/Grid';
import CardStats from '../molecules/CardStats';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SupportIcon from '@mui/icons-material/Support';

export default function DashboardCards() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStats title="Usuários" value={1024} icon={<AccountCircleIcon />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStats title="Vendas" value={230} icon={<ShoppingCartIcon />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStats title="Receita" value="$12.345" icon={<AttachMoneyIcon />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStats title="Tickets" value={5} icon={<SupportIcon />} />
      </Grid>
    </Grid>
  );
}
