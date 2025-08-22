import { Box, Button, Card, CardContent } from "@mui/material";
import AircraftLimitAlert from "../molecules/AircraftLimitAlert";
import { Dispatch, SetStateAction } from "react";
import AircraftInputs from "../molecules/AircraftBasicInfo";

interface AircraftFormProps {
  state: AircraftFormState;
  setState: Dispatch<SetStateAction<AircraftFormState>>;
  maxAircrafts: number;
  currentAircrafts: number;
}

interface AircraftFormState {
  prefixo: string;
  fabricante: string;
  modelo: string;
  tipo: string;
  ano: string;
  apelido?: string | null;
}

export default function AircraftForm({
  state,
  setState,
  maxAircrafts,
  currentAircrafts,
}: AircraftFormProps) {
  const canAdd = currentAircrafts < maxAircrafts;

  const handleChange = (field: string, value: string) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
      <Card>
        <CardContent>
        <AircraftLimitAlert current={currentAircrafts} max={maxAircrafts} />
        <AircraftInputs state={state} onChange={handleChange} />
        <Box mt={4}>
          <Button variant="contained" color="primary" disabled={!canAdd}>
            Criar Aeronave
          </Button>
        </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
