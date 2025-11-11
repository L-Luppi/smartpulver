import React, { useEffect, useState } from "react";
import { getCurrentUser, signInWithRedirect } from "@aws-amplify/auth";
import { CircularProgress, Box } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch {
        await signInWithRedirect();
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );

  if (!authenticated) return null;

  return <>{children}</>;
}
