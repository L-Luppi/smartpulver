import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { Amplify } from "aws-amplify";
import { authConfig } from "./utils/aws-exports";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "leaflet/dist/leaflet.css";

Amplify.configure(authConfig, { ssr: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
        </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);
