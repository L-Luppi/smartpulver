import { Box } from "@mui/material";
import { useState } from "react";
import PlotForm from "../../components/organisms/PlotForm";

export default function CreatePlot() {
  const [state, setState] = useState({
    cliente: "",
    area: "",
    talhao: "",
    codigoTalhao: "",
    areaTalhao: "",
    notas: "",
    latitude: -15.78,
    longitude: -47.93,
  });

  return (
    <Box>
      <PlotForm state={state} setState={setState} />
    </Box>
  );
}
