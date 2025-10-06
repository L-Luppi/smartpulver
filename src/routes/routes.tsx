import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";
import CreateAircraft from "../pages/Aircrafts/Create";
import CreateOrder from "../pages/Orders/Create";
import ListAircrafts from "../pages/Aircrafts/List";
import ProfilePage from "../pages/Profile";
import Site from "../pages/Site";
import LoginCallback from "./login";
import ProtectedRoute from "./protectedRoute";
import LoggedOut from "./loggedOut";

export const router = (
  isDarkMode: boolean,
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
) =>
  createBrowserRouter([
    // 🔹 Callback do Cognito (pública)
    {
      path: "/login",
      element: <LoginCallback />,
    },
    {
      path: "/logged-out",
      element: <LoggedOut />,
    },
    // 🔹 Rotas protegidas (usuário precisa estar logado)
    {
      path: "/app",
      element: (
        <ProtectedRoute>
          <DefaultLayout
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "aeronaves/criar", element: <CreateAircraft /> },
        { path: "aeronaves/listar", element: <ListAircrafts /> },
        { path: "ordens/criar", element: <CreateOrder /> },
        { path: "perfil", element: <ProfilePage /> },
      ],
    },

    // 🔹 Rota pública (ex.: landing page do site)
    {
      path: "/",
      element: <Site />,
    },
  ]);
