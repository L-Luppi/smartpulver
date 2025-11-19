import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

const DefaultLayout = lazy(() => import("../layouts/DefaultLayout"));
const Home = lazy(() => import("../pages/Dashboard/Home"));
const CreateAircraft = lazy(() => import("../pages/Aircrafts/Create"));
const CreateFarmer = lazy(() => import("../pages/Farmers/Create"));
const ListFarmers = lazy(() => import("../pages/Farmers/List"));
const ListPlots = lazy(() => import("../pages/Plots/List"));
const CreatePlot = lazy(() => import("../pages/Plots/Create"));
const CreateOrder = lazy(() => import("../pages/Orders/Create"));
const ListAircrafts = lazy(() => import("../pages/Aircrafts/List"));
const ProfilePage = lazy(() => import("../pages/Profile"));
const ListAreas = lazy(() => import("../pages/Areas/List"));
const CreateArea = lazy(() => import("../pages/Areas/Create"));
const Site = lazy(() => import("../pages"));
const ProtectedRoute = lazy(() => import("./protectedRoute"));

export const router = (
  isDarkMode: boolean,
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
) =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<CircularProgress />}>
          <Site />
        </Suspense>
      ),
    },

    {
      path: "/app",
      element: (
        <Suspense fallback={<Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>}>
          <ProtectedRoute>
            <DefaultLayout
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<CircularProgress />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "aeronaves/criar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <CreateAircraft />
            </Suspense>
          ),
        },
        {
          path: "aeronaves/listar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <ListAircrafts />
            </Suspense>
          ),
        },
        {
          path: "produtores/listar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <ListFarmers />
            </Suspense>
          ),
        },
         {
          path: "produtores/criar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <CreateFarmer />
            </Suspense>
          ),
        },
         {
          path: "areas/listar",
          element: (
            <Suspense fallback={<CircularProgress />}>
            <ListAreas />
            </Suspense>
          ),
        },
         {
          path: "areas/criar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <CreateArea />
            </Suspense>
          ),
        },
         {
          path: "talhoes/listar",
          element: (
            <Suspense fallback={<CircularProgress />}>
            <ListPlots />
            </Suspense>
          ),
        },
         {
          path: "talhoes/criar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <CreatePlot />
            </Suspense>
          ),
        },
        {
          path: "ordens/criar",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <CreateOrder />
            </Suspense>
          ),
        },
        {
          path: "perfil",
          element: (
            <Suspense fallback={<CircularProgress />}>
              <ProfilePage />
            </Suspense>
          ),
        },
      ],
    },
  ]);
