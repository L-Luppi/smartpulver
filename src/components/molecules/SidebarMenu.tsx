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
      <SidebarItem icon={<DonutLarge />} text="Dashboard" to="/app/" />
      
      <SidebarItem
        icon={<AirplanemodeActive />}
        text="Aeronaves"
        subItems={[
          { text: "Cadastrar", to: "/aeronaves/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "/aeronaves/listar", icon: <FormatListBulleted /> },
        ]}
      />

      <SidebarItem
        icon={<Article />}
        text="Ordens de Serviço"
        subItems={[
          { text: "Criar", to: "/ordens/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "/ordens/listar", icon: <FormatListBulleted /> },
        ]}
      />

      <SidebarItem
        icon={<Group />}
        text="Clientes"
        subItems={[
          { text: "Criar", to: "/clientes/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "/clientes/listar", icon: <FormatListBulleted /> },
        ]}
      />

      <SidebarItem
        icon={<Badge />}
        text="Funcionários"
        subItems={[
          { text: "Criar", to: "/funcionarios/criar", icon: <AddCircleOutline /> },
          { text: "Listar", to: "/funcionarios/listar", icon: <FormatListBulleted /> },
        ]}
      />
    </List>
  );
}
