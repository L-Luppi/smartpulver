import { Toolbar } from "@mui/material";
import IconButton from "../atoms/IconButton";
import Typography from "../atoms/Typography";
import Button from "../atoms/Button";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface AppBarMoleculeProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  desktopOpen: boolean;
  setDesktopOpen: (value: boolean) => void;
}

export default function AppBarMolecule({
  isDarkMode,
  setIsDarkMode,
  mobileOpen,
  setMobileOpen,
  desktopOpen,
  setDesktopOpen,
}: AppBarMoleculeProps) {
  return (
    <Toolbar sx={{ display: "flex", alignItems: "center" }}>
      {/* Botão mobile */}
      <IconButton
        onClick={() => setMobileOpen(!mobileOpen)}
        sx={{ mr: 1, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      {/* Título */}
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Dashboard
      </Typography>

      {/* Botão desktop toggle */}
      <IconButton
        onClick={() => setDesktopOpen(!desktopOpen)}
        sx={{ mr: 2, display: { xs: "none", sm: "inline-flex" } }}
      >
        {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      {/* Botão tema */}
      <Button onClick={() => setIsDarkMode(!isDarkMode)} color="secondary">
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </Button>
    </Toolbar>
  );
}
