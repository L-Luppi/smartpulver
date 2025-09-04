import { Box, Container, Typography, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MapIcon from "@mui/icons-material/Map";
import GroupIcon from "@mui/icons-material/Group";
import DevicesIcon from "@mui/icons-material/Devices";

const features = [
  {
    title: "Ordens de Serviço Detalhadas",
    description:
      "Crie, gerencie e rastreie todas as ordens de forma digital, organizada e eficiente.",
    icon: <CheckCircleIcon fontSize="large" color="primary" />,
  },
  {
    title: "Relatórios Automatizados",
    description:
      "Gere automaticamente relatórios de suas aplicações e MAPA com 1 clique, sem erros ou multas.",
    icon: <AnalyticsIcon fontSize="large" color="primary" />,
  },
  {
    title: "Mapa Interativo de Aplicações",
    description:
      "Visualize áreas aplicadas, planeje rotas e analise a cobertura geográfica de suas operações.",
    icon: <MapIcon fontSize="large" color="primary" />,
  },
  {
    title: "Gestão de Clientes Simplificada",
    description:
      "Centralize informações de clientes, histórico de serviços e comunicação, fortalecendo o relacionamento.",
    icon: <GroupIcon fontSize="large" color="primary" />,
  },
  {
    title: "Acesso de Onde Estiver",
    description:
      "Disponível no computador, tablet ou celular. Sua gestão na nuvem, a qualquer hora e lugar.",
    icon: <DevicesIcon fontSize="large" color="primary" />,
  },
];

export default function Features() {
  return (
    <Box py={12}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={2}
        >
          O que oferecemos?
        </Typography>
        <Grid container spacing={8}>
          {features.map((f, idx) => (
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              spacing={4}
              key={f.title}
              direction={{ xs: "column", md: "row" }}
              justifyContent="center"
              alignItems="center"
              sx={{
                flexDirection: {
                  xs: "column",
                  md: idx % 2 === 0 ? "row" : "row-reverse",
                },
              }}
            >
              <Grid size={{ xs: 12, md: 6 }} textAlign={{ xs: "center", md: "left" }}>
                <Box
                  display="flex"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  mb={2}
                >
                  {f.icon}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {f.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {f.description}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
