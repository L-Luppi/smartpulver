import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { signInWithRedirect } from "aws-amplify/auth";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogin = async () => {
    await signInWithRedirect();
  };

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* LOGO */}
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
            SmartPulver
          </Typography>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button sx={{ color: "#fff" }}>Home</Button>
            <Button sx={{ color: "#fff" }}>Planos</Button>
            <Button sx={{ color: "#fff" }}>Contato</Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FF9800",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e68900" },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
          </Box>

          {/* Botão Mobile */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "white" }}
            onClick={() => setOpenMenu(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Container>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box width={250} p={2}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setOpenMenu(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {["Home", "Planos", "Contato"].map((text) => (
              <ListItemButton key={text}>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
            <ListItem>
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#FF9800",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e68900" },
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
