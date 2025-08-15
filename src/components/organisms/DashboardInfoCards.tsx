import Grid from "@mui/material/Grid";
import CardStats from "../molecules/CardStats";

// Ícones MUI
import ListAltIcon from "@mui/icons-material/ListAlt"; // Ordens
import PeopleIcon from "@mui/icons-material/People"; // Clientes
import WorkIcon from "@mui/icons-material/Work"; // Funcionários
import FlightIcon from "@mui/icons-material/Flight"; // Aeronaves
import InventoryIcon from "@mui/icons-material/Inventory"; // Produtos
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // Receita

export default function DashboardCards() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
        <CardStats
          title="Ordens"
          value={1024}
          icon={<ListAltIcon />}
          clickable
          onPrimaryClick={() => console.log("Primary action for Ordens")}
          onSecondaryClick={() => console.log("Secondary action for Ordens")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
        <CardStats
          title="Clientes"
          value={230}
          icon={<PeopleIcon />}
          clickable
          onPrimaryClick={() => console.log("Primary action for Clientes")}
          onSecondaryClick={() => console.log("Secondary action for Clientes")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
        <CardStats
          title="Funcionários"
          value={56}
          icon={<WorkIcon />}
          clickable
          onPrimaryClick={() => console.log("Primary action for Funcionários")}
          onSecondaryClick={() =>
            console.log("Secondary action for Funcionários")
          }
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
        <CardStats
          title="Aeronaves"
          value={5}
          icon={<FlightIcon />}
          clickable
          onPrimaryClick={() => console.log("Primary action for Aeronaves")}
          onSecondaryClick={() => console.log("Secondary action for Aeronaves")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
        <CardStats
          title="Produtos"
          value={82}
          icon={<InventoryIcon />}
          clickable
          onPrimaryClick={() => console.log("Primary action for Produtos")}
          onSecondaryClick={() => console.log("Secondary action for Produtos")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
        <CardStats
          title="Receita"
          value="$12.345"
          icon={<MonetizationOnIcon />}
          clickable
          onPrimaryClick={() => console.log("Primary action for Receita")}
          onSecondaryClick={() => console.log("Secondary action for Receita")}
        />
      </Grid>
    </Grid>
  );
}
