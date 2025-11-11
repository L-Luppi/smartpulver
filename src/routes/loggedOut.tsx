import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function LoggedOut() {
  useEffect(() => {
    const domain = "https://sa-east-1me5e1v85a.auth.sa-east-1.amazoncognito.com";
    const clientId = "515546nobqhqjoe80q743ob55j";
    const redirectUri = "https://smartpulver.com.br/app";

    window.location.href = `${domain}/login?client_id=${clientId}&response_type=code&scope=openid+email+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center" }}>
      <Typography variant="body1" color="text.secondary">
        Redirecionando para o login...
      </Typography>
    </Box>
  );
}
