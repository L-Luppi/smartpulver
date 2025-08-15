import {
  Drawer,
  List,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import SidebarItem from "../atoms/SideBarItem";
const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  desktopOpen?: boolean;
}

export default function Sidebar({ mobileOpen, onClose, desktopOpen = true }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Minha App
        </Typography>
      </Toolbar>
      <List>
        <SidebarItem icon={<DashboardIcon />} text="Dashboard" to="/" />
        <SidebarItem
          icon={<SettingsIcon />}
          text="Configurações"
          to="/settings"
        />
        <SidebarItem icon={<SettingsIcon />} text="Relatórios" to="/reports" />
        <SidebarItem
          icon={<SettingsIcon />}
          text="Configurações"
          subItems={[
            { text: "Usuários", to: "/settings/users" },
            { text: "Permissões", to: "/settings/permissions" },
          ]}
        />
        <SidebarItem icon={<SettingsIcon />} text="Sair" to="/logout" />
      </List>
    </>
  );

  // Desktop: só renderiza se desktopOpen for true
  if (!desktopOpen) return null;

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          [`& .MuiDrawer-paper`]: { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
