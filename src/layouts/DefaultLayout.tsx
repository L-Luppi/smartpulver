import { useState } from "react";
import { Box, AppBar, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { lightTheme, darkTheme } from "../theme";
import Sidebar from "../components/molecules/SideBar";
import AppBarMolecule from "../components/molecules/AppBar";
import { Dispatch, SetStateAction } from "react";

interface DefaultLayoutProps {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

export default function DefaultLayout({ isDarkMode, setIsDarkMode }: DefaultLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" color="primary" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <AppBarMolecule
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          desktopOpen={desktopOpen}
          setDesktopOpen={setDesktopOpen}
        />
      </AppBar>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} desktopOpen={desktopOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
