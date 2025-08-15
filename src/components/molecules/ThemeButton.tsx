import { Button, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface ThemeToggleButtonProps {
  isDarkMode: boolean;
  onClick: () => void;
}

export default function ThemeToggleButton({ isDarkMode, onClick }: ThemeToggleButtonProps) {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        borderRadius: "50%",
        minWidth: 40,
        height: 40,
        padding: 0,
        backgroundColor: theme.palette.mode === "dark"
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
        color: theme.palette.getContrastText(
          theme.palette.mode === "dark"
            ? theme.palette.primary.main
            : theme.palette.secondary.main
        ),
        "&:hover": {
          backgroundColor: theme.palette.mode === "dark"
            ? theme.palette.primary.dark
            : theme.palette.secondary.dark,
        },
      }}
    >
      {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </Button>
  );
}
