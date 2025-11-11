import { List } from "@mui/material";
import SidebarItem from "../atoms/SideBarItem";
import {
  AirplanemodeActive,
  Article,
  Group,
  Badge,
  DonutLarge,
  AddCircleOutline,
  FormatListBulleted,
} from "@mui/icons-material";

export default function SidebarMenu() {
  return (
    <List sx={{ flexGrow: 1 }}>
      <SidebarItem icon={<DonutLarge />} text="Dashboard" to="/app" />
      
      <SidebarItem
        icon={<AirplanemodeActive />}
        text="Aeronaves"
        subItems={[
          { text: "Cadastrar", to: "app/aeronaves/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "app/aeronaves/listar", icon: <FormatListBulleted /> },
        ]}
      />

      <SidebarItem
        icon={<Article />}
        text="Ordens de Serviço"
        subItems={[
          { text: "Criar", to: "app/ordens/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "app/ordens/listar", icon: <FormatListBulleted /> },
        ]}
      />

      <SidebarItem
        icon={<Group />}
        text="Clientes"
        subItems={[
          { text: "Criar", to: "app/clientes/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "app/clientes/listar", icon: <FormatListBulleted /> },
        ]}
      />

      <SidebarItem
        icon={<Badge />}
        text="Funcionários"
        subItems={[
          { text: "Criar", to: "app/funcionarios/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "app/funcionarios/listar", icon: <FormatListBulleted /> },
        ]}
      />
    </List>
  );
}
