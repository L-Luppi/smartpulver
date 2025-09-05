import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
// import { useAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import { router } from "./routes/routes";
import { lightTheme, darkTheme } from "./theme";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // const { route } = useAuthenticator((context) => [context.route]);

  // // Se não estiver autenticado, renderiza Authenticator
  // if (route !== "authenticated") {
  //   return <Authenticator />;
  // }

  // Usuário autenticado → renderiza app normalmente
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <RouterProvider router={router(isDarkMode, setIsDarkMode)} />
    </ThemeProvider>
  );
}
