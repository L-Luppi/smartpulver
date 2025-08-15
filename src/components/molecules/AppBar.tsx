import { Toolbar, Box } from "@mui/material";
import IconButton from "../atoms/IconButton";
import Typography from "../atoms/Typography";
import ThemeToggleButton from "./ThemeButton";
import MenuIcon from "@mui/icons-material/Menu";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

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

      {/* Agrupa título + toggle */}
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <Typography variant="h6">
            SMART PULVER
        </Typography>

        <IconButton
          onClick={() => setDesktopOpen(!desktopOpen)}
          sx={{ ml: 3, display: { xs: "none", sm: "inline-flex" } }}
        >
          {desktopOpen ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon /> }
        </IconButton>
      </Box>

      {/* Botão tema */}
      <ThemeToggleButton
        isDarkMode={isDarkMode}
        onClick={() => setIsDarkMode(!isDarkMode)}
      />
    </Toolbar>
  );
}
