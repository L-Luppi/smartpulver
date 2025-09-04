import { Box } from "@mui/material";
import AircraftForm from "../../components/organisms/AircraftForm";

export default function CreateAircraft() {
  return (
    <Box>
      <AircraftForm
        currentAircrafts={0}
        maxAircrafts={0}
        setState={() => {}}
        state={{ prefixo: "", fabricante: "", modelo: "", tipo: "", ano: "" }}
      />
    </Box>
  );
}
