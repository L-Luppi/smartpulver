import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MapIcon from "@mui/icons-material/Map";
import GroupIcon from "@mui/icons-material/Group";
import DevicesIcon from "@mui/icons-material/Devices";
import { SvgIconProps } from "@mui/material";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactElement<SvgIconProps>;
}

const features: Feature[] = [
  {
    title: "Ordens de Serviço Detalhadas",
    description:
      "Crie, gerencie e rastreie todas as ordens de forma digital, organizada e eficiente.",
    icon: <CheckCircleIcon fontSize="large" />,
  },
  {
    title: "Relatórios Automatizados",
    description:
      "Gere automaticamente relatórios de suas aplicações e MAPA com 1 clique, sem erros ou multas.",
    icon: <AnalyticsIcon fontSize="large" />,
  },
  {
    title: "Mapa Interativo de Aplicações",
    description:
      "Visualize áreas aplicadas, planeje rotas e analise a cobertura geográfica de suas operações.",
    icon: <MapIcon fontSize="large" />,
  },
  {
    title: "Gestão de Clientes Simplificada",
    description:
      "Centralize informações de clientes, histórico de serviços e comunicação, fortalecendo o relacionamento.",
    icon: <GroupIcon fontSize="large" />,
  },
  {
    title: "Acesso de Onde Estiver",
    description:
      "Disponível no computador, tablet ou celular. Sua gestão na nuvem, a qualquer hora e lugar.",
    icon: <DevicesIcon fontSize="large" />,
  },
];

export default function Features() {
  const firstRow = features.slice(0, 3);
  const secondRow = features.slice(3, 5);

  const renderRow = (row: Feature[]) => (
    <Grid container spacing={4} justifyContent="center">
      {row.map((f) => (
        <Grid size={{ xs: 12, md: Math.floor(12 / row.length) }} key={f.title} sx={{ display: "flex" }}>
          <Paper
            elevation={3}
            sx={{
              position: "relative",
              pt: 6,
              pb: 4,
              px: 3,
              mt: 2,
              borderRadius: 3,
              textAlign: "center",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Círculo do ícone */}
            <Box
              sx={{
                position: "absolute",
                top: -30,
                left: "50%",
                transform: "translateX(-50%)",
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: 3,
              }}
            >
              {f.icon}
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {f.title}
            </Typography>
            <Typography variant="body2" color="#555">
              {f.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box py={12} bgcolor="#f9f9f9">
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
          O que oferecemos?
        </Typography>

        {renderRow(firstRow)}
        <Box mt={4}>{renderRow(secondRow)}</Box>
      </Container>
    </Box>
  );
}
