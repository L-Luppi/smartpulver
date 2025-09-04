import {
  Box,
  Typography,
} from "@mui/material";
import Pricing from "../../components/site/Pricing";
import Features from "../../components/site/Features";
import Hero from "../../components/site/Hero";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />

      <Box
        bgcolor="primary.main"
        color="white"
        py={4}
        mt={8}
        textAlign="center"
      >
        <Typography>
          © 2025 SmartPulver. Todos os direitos reservados.
        </Typography>
      </Box>
    </>
  );
}
