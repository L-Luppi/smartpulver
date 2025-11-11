import { Box, Container, Typography, Button, Stack } from "@mui/material";
import drone from "../../assets/drone.png";

export default function Hero() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
