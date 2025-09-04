import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const plans = [
  {
    name: "Plano Mensal",
    subtitle: "Flexibilidade total",
    price: "R$ 149,99",
    per: "/mês",
    description: "Sem compromisso de longo prazo",
    features: [
      "Geração automática dos relatórios",
      "Gestão de clientes, funcionários e produtos",
      "Controle de ordens de serviço",
      "Dashboard com gráficos e mapa",
      "Acesso via computador, celular ou tablet",
      "Backup e segurança na nuvem",
    ],
    color: "primary",
    button: "Começar Agora",
  },
  {
    name: "Plano Anual",
    subtitle: "Melhor custo-benefício",
    price: "R$ 119,99",
    per: "/mês",
    oldPrice: "R$ 149,99/mês",
    description: "Cobrança anual de R$ 1439,84",
    savings: "💰 Economize R$ 360 por ano!",
    features: [
      "Geração automática dos relatórios",
      "Gestão de clientes, funcionários e produtos",
      "Controle de ordens de serviço",
      "Dashboard com gráficos e mapa",
      "Acesso via computador, celular ou tablet",
      "Backup e segurança na nuvem",
    ],
    color: "secondary",
    button: "Aproveitar Desconto",
    highlight: true,
  },
  {
    name: "Plano Personalizado",
    subtitle: "Solução sob medida",
    price: "Sob consulta",
    per: "",
    description: "Escolha os recursos que precisa",
    features: [
      "Pacotes adaptados ao seu negócio",
      "Escalabilidade sob demanda",
      "Suporte dedicado",
    ],
    color: "info",
    button: "Fale Conosco",
  },
];

const guarantees = [
  { text: "100% Seguro", icon: <VerifiedUserIcon /> },
  { text: "Pagamento Protegido", icon: <PaymentIcon /> },
  { text: "Suporte Especializado", icon: <SupportAgentIcon /> },
  { text: "Satisfação Garantida", icon: <SentimentSatisfiedAltIcon /> },
];

export default function Pricing() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Nossos Planos
      </Typography>

      {/* Grid Desktop */}
      {!isMobile && (
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.name}>
              <Card
                elevation={4}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: 6 },
                }}
              >
                {plan.highlight && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      bgcolor: "secondary.main",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    MAIS ESCOLHIDO
                  </Box>
                )}

                {plan.highlight && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: -40,
                      transform: "rotate(45deg)",
                      bgcolor: "error.main",
                      color: "white",
                      px: 10,
                      py: 0.5,
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  >
                    20% OFF
                  </Box>
                )}

                <CardContent sx={{ textAlign: "center", p: 4, flexGrow: 1, marginTop: 2 }}>
                  <Typography variant="h5" fontWeight="bold" color={`${plan.color}.main`} gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {plan.subtitle}
                  </Typography>
                  {plan.oldPrice && (
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through" }}
                      color="text.secondary"
                    >
                      {plan.oldPrice}
                    </Typography>
                  )}
                  <Typography variant="h4" fontWeight="bold" color={`${plan.color}.main`}>
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {plan.per}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {plan.description}
                  </Typography>
                  {plan.savings && (
                    <Typography variant="body2" color="success.main" mb={2}>
                      {plan.savings}
                    </Typography>
                  )}

                  <Box textAlign="left" mb={2}>
                    {plan.features.map((f) => (
                      <Typography
                        key={f}
                        display="flex"
                        alignItems="center"
                        mb={0.5}
                        fontSize="0.875rem"
                      >
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} fontSize="small" /> {f}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button variant="contained" color={plan.color as any} fullWidth>
                    {plan.button}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mobile: Carrossel simples */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            px: 2,
            scrollSnapType: "x mandatory",
            "& > div": { scrollSnapAlign: "start" },
          }}
        >
          {plans.map((plan) => (
            <Box key={plan.name} sx={{ minWidth: 280, flex: "0 0 auto" }}>
              <Card elevation={4} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ textAlign: "center", p: 3, flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" color={`${plan.color}.main`} gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom fontSize="0.9rem">
                    {plan.subtitle}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={`${plan.color}.main`}>
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom fontSize="0.8rem">
                    {plan.per}
                  </Typography>
                  <Box textAlign="left" mt={1} mb={2}>
                    {plan.features.map((f) => (
                      <Typography
                        key={f}
                        display="flex"
                        alignItems="center"
                        fontSize="0.75rem"
                        mb={0.5}
                      >
                        <CheckCircleIcon color="success" sx={{ mr: 0.5 }} fontSize="small" /> {f}
                      </Typography>
                    ))}
                  </Box>
                  <Button variant="contained" color={plan.color as any} fullWidth>
                    {plan.button}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Linha de garantias */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ mt: 4 }}
        direction={isMobile ? "column" : "row"}
        alignItems="center"
      >
        {guarantees.map((g) => (
          <Grid size={{ xs: 6, md: 3 }} key={g.text}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              {React.cloneElement(g.icon, { fontSize: isMobile ? "small" : "large" })}
              <Typography fontSize={isMobile ? "0.5rem" : "0.9rem"}>{g.text}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
