import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";

export const router = (isDarkMode: boolean, setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>) =>
  createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />,
      children: [
        { path: "", element: <Home /> },
        { path: "settings", element: <Home /> },
        { path: "clients", element: <Home /> },
        { path: "drones", element: <Home /> },
        { path: "reports", element: <Home /> },
      ],
    },
  ]);
