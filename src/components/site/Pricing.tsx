import React, { useState } from "react";
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
import { useAuth } from "react-oidc-context";

const plans = [
  {
    name: "Plano Mensal",
    subtitle: "Flexibilidade total",
    price: "R$ 149,99",
    per: "/mês",
    description: "Sem compromisso de longo prazo",
    priceId: "price_1MENSALxxxx",
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
    priceId: "price_1ANUALxxxx",
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
    priceId: "",
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
  const [activeStep, setActiveStep] = useState(0);

  const auth = useAuth();

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) {
      // Plano personalizado → fale conosco
      window.location.href = "/contato";
      return;
    }

    if (!auth.isAuthenticated) {
      // se não logado → manda para login e guarda o plano
      auth.signinRedirect({ state: { planId: priceId } });
      return;
    }

    try {
      const idToken = auth.user?.id_token;

      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Erro ao criar checkout:", err);
    }
  };



  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Nossos Planos
      </Typography>

      {/* Desktop */}
      {!isMobile && (
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
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
                <CardContent sx={{ textAlign: "center", p: 4, flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={`${plan.color}.main`}
                  >
                    {plan.name}
                  </Typography>
                  <Typography variant="subtitle1">{plan.subtitle}</Typography>
                  <Typography variant="h4" color={`${plan.color}.main`}>
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle2">{plan.per}</Typography>
                  <Typography variant="body2" color="text.primary" mb={2}>
                    {plan.description}
                  </Typography>
                  {plan.savings && (
                    <Typography color="success.main">{plan.savings}</Typography>
                  )}

                  <Box textAlign="left" mt={2}>
                    {plan.features.map((f) => (
                      <Typography
                        key={f}
                        display="flex"
                        alignItems="center"
                        fontSize="0.875rem"
                        mb={0.5}
                      >
                        <CheckCircleIcon
                          color="success"
                          sx={{ mr: 1 }}
                          fontSize="small"
                        />
                        {f}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button variant="contained" color={plan.color as any} fullWidth onClick={() => handleSubscribe(plans[activeStep].priceId)} >
                    {plan.button}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mobile com dots apenas */}
      {isMobile && (
        <Box>
          <Card
            elevation={4}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              p: 3,
              mb: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={`${plans[activeStep].color}.main`}
              >
                {plans[activeStep].name}
              </Typography>
              <Typography variant="subtitle1">
                {plans[activeStep].subtitle}
              </Typography>
              <Typography variant="h5" color={`${plans[activeStep].color}.main`}>
                {plans[activeStep].price}
              </Typography>
              <Typography variant="subtitle2">{plans[activeStep].per}</Typography>
              <Typography variant="body2" color="text.primary" mb={2}>
                {plans[activeStep].description}
              </Typography>
              {plans[activeStep].savings && (
                <Typography color="success.main">
                  {plans[activeStep].savings}
                </Typography>
              )}
              <Box textAlign="left" mt={2}>
                {plans[activeStep].features.map((f) => (
                  <Typography
                    key={f}
                    display="flex"
                    alignItems="center"
                    fontSize="0.875rem"
                    mb={0.5}
                  >
                    <CheckCircleIcon
                      color="success"
                      sx={{ mr: 1 }}
                      fontSize="small"
                    />
                    {f}
                  </Typography>
                ))}
              </Box>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                color={plans[activeStep].color as any}
                fullWidth
                onClick={() => handleSubscribe(plans[activeStep].priceId)}
              >
                {plans[activeStep].button}
              </Button>
            </Box>
          </Card>

        {/* Dots clicáveis */}
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
      {plans.map((_, index) => (
        <Box
          key={index}
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: index === activeStep ? "primary.main" : "grey.400",
            cursor: "pointer",
          }}
          onClick={() => setActiveStep(index)}
        />
      ))}
    </Box>
  </Box>
      )}

      {/* Garantias */}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        {guarantees.map((g) => (
          <Grid size={{ xs: 12, md: 3 }} key={g.text}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              {React.cloneElement(g.icon, { fontSize: isMobile ? "small" : "large" })}
              <Typography fontSize={isMobile ? "0.75rem" : "0.9rem"}>
                {g.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
