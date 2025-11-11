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
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import drone from "../../assets/drone.png";
import { signInWithRedirect, signOut } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";

export default function Hero() {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Verifica se o usuário está logado
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogin = async () => {
    await signInWithRedirect(); // redireciona para o Cognito Hosted UI
  };

  const handleLogout = async () => {
    await signOut({ global: true });
  };

  return (
    <Box
      component="header"
      color="white"
      sx={{
        position: "relative",
        backgroundColor: "primary.main",
        overflow: "hidden",
      }}
    >
      {/* NAVBAR */}
      <Container maxWidth="lg">
        <Box
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
            SmartPulver
          </Typography>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button sx={{ color: "#fff" }}>Home</Button>
            <Button sx={{ color: "#fff" }}>Planos</Button>
            <Button sx={{ color: "#fff" }}>Contato</Button>

            {user ? (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#d32f2f" },
                }}
                onClick={handleLogout}
              >
                Sair
              </Button>
            ) : (
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
            )}
          </Box>

          {/* Menu Mobile */}
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
              {user ? (
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              ) : (
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
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* HERO */}
      <Box py={10}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Texto */}
          <Box flex={1}>
            <Typography
              variant="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "2rem", md: "3rem" }, color: "#fff" }}
            >
              Chega de perder tempo com papelada e dores de cabeça!
            </Typography>
            <Typography
              variant="h2"
              mb={4}
              sx={{
                fontSize: { xs: "1.5rem", md: "1.5rem" },
                color: "#f5f5f5",
              }}
            >
              Seus drones foram feitos para voar, não para você ficar preso em
              planilhas e burocracias.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
              mb={4}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#FF9800",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e68900" },
                }}
              >
                Assine Agora
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { backgroundColor: "#fff", color: "#000" },
                }}
              >
                Saiba Mais
              </Button>
            </Stack>
          </Box>

          {/* Drone animado */}
          <Box
            component="img"
            src={drone}
            alt="Drone"
            sx={{
              width: { xs: "80%", md: "500px" },
              mt: { xs: 4, md: 0 },
              ml: { xs: 0, md: 12 },
              objectFit: "contain",
              animation: "infinityMove 6s linear infinite",
              "@keyframes infinityMove": {
                "0%": { transform: "translate(0, 0)" },
                "50%": { transform: "translate(50px, 20px)" },
                "100%": { transform: "translate(0, 0)" },
              },
            }}
          />
        </Container>
      </Box>
    </Box>
  );
}
