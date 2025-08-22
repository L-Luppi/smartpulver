import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";
import CreateAircraft from "../pages/Aircrafts/Create";
import CreateOrder from "../pages/Orders/Create";

export const router = (isDarkMode: boolean, setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>) =>
  createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />,
      children: [
        { path: "", element: <Home /> },
        { path: "aeronaves/criar", element: <CreateAircraft /> },
        { path: "aeronaves/listar", element: <Home /> },
        { path: "aeronaves/relatorios", element: <Home /> },
        { path: "ordens/criar", element: <CreateOrder /> },
      ],
    },
  ]);
