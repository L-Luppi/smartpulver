import {
  Drawer,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import SidebarMenu from "../molecules/SidebarMenu";
import SidebarFooter from "../molecules/SidebarFooter";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  desktopOpen?: boolean;
}

export default function Sidebar({
  mobileOpen,
  onClose,
  desktopOpen = true,
}: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Toolbar>
        <Typography variant="h6" noWrap>
          Minha App
        </Typography>
      </Toolbar>

      {/* Menu */}
      <SidebarMenu />

      {/* Footer */}
      <SidebarFooter />
    </Box>
  );

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
