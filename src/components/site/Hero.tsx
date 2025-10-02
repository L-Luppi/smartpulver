import { useState } from "react";
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
import { useAuth } from "react-oidc-context";

export default function Hero() {
  const [openMenu, setOpenMenu] = useState(false);
  const auth = useAuth();

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
            <Button
              sx={{ color: "#fff" }}
              onClick={() => {
                const signupUrl = import.meta.env.VITE_COGNITO_SIGNUP_URL;
                window.location.href = signupUrl;
              }}
            >
              Cadastro
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF9800",
                color: "#fff",
                "&:hover": { backgroundColor: "#e68900" },
              }}
              onClick={() => auth.signinRedirect()}
            >
              Login
            </Button>
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

      {/* Drawer para mobile */}
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
                sx={{ color: "#fff" }}
                onClick={() => {
                  const signupUrl = import.meta.env.VITE_COGNITO_SIGNUP_URL;
                  window.location.href = signupUrl;
                }}
              >
                Cadastro
              </Button>
              <Button
                fullWidth
                sx={{
                  backgroundColor: "#FF9800",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e68900" },
                }}
                onClick={() => auth.signinRedirect()}
              >
                Login
              </Button>
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
              planilhas e burocracias. Com o Smart Pulver, você elimina multas,
              simplifica a gestão e acompanha tudo em tempo real — direto na
              palma da sua mão.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2} // espaço entre os botões
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
              maxHeight: "800px",
              mt: { xs: 4, md: 0 },
              ml: { xs: 0, md: 12 }, // Espaçamento lateral extra no desktop
              objectFit: "contain",
              animation: "infinityMove 6s linear infinite",
              "@keyframes infinityMove": {
                "0%": { transform: "translate(0, 0)" },
                "12.5%": { transform: "translate(50px, -30px)" },
                "25%": { transform: "translate(100px, 0)" },
                "37.5%": { transform: "translate(50px, 30px)" },
                "50%": { transform: "translate(0, 0)" },
                "62.5%": { transform: "translate(-50px, -30px)" },
                "75%": { transform: "translate(-100px, 0)" },
                "87.5%": { transform: "translate(-50px, 30px)" },
                "100%": { transform: "translate(0, 0)" },
              },
            }}
          />
        </Container>
      </Box>
    </Box>
  );
}
