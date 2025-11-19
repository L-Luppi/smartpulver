import {
  AirplanemodeActive,
  Article,
  Group,
  DonutLarge,
  AddCircleOutline,
  FormatListBulleted,
  Terrain,
  GridOn,
} from "@mui/icons-material";

export const SIDEBAR_MENU = [
  { icon: <DonutLarge />, text: "Dashboard", to: "/app" },

  {
    icon: <AirplanemodeActive />,
    text: "Aeronaves",
    subItems: [
      { text: "Cadastrar", to: "aeronaves/criar", icon: <AddCircleOutline /> },
      { text: "Listar", to: "aeronaves/listar", icon: <FormatListBulleted /> },
    ],
  },

  {
    icon: <Article />,
    text: "Ordens de Serviço",
    subItems: [
      { text: "Criar", to: "ordens/criar", icon: <AddCircleOutline /> },
        // { text: "Listar", to: "ordens/listar", icon: <FormatListBulleted /> },
    ],
  },

  {
    icon: <Group />,
    text: "Produtores",
    subItems: [
      { text: "Criar", to: "produtores/criar", icon: <AddCircleOutline /> },
      { text: "Listar", to: "produtores/listar", icon: <FormatListBulleted /> },
    ],
  },

  {
    icon: <Terrain />,
    text: "Áreas",
    subItems: [
      { text: "Criar", to: "areas/criar", icon: <AddCircleOutline /> },
      { text: "Listar", to: "areas/listar", icon: <FormatListBulleted /> },
    ],
  },

  {
    icon: <GridOn />,
    text: "Talhões",
    subItems: [
      { text: "Criar", to: "talhoes/criar", icon: <AddCircleOutline /> },
      { text: "Listar", to: "talhoes/listar", icon: <FormatListBulleted /> },
    ],
  },
];
