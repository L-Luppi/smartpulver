// organisms/AircraftForm.tsx
import { Grid, Box, Button, Card } from "@mui/material";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import AircraftLimitAlert from "../molecules/AircraftLimitAlert";
import { Dispatch, SetStateAction } from "react";

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
  apelido?: string | null | undefined;
}

export default function AircraftForm({
  state,
  setState,
  maxAircrafts,
  currentAircrafts,
}: AircraftFormProps) {
  const canAdd = currentAircrafts < maxAircrafts;

  return (
    <Box>
      <Card>
        {" "}
        <AircraftLimitAlert current={currentAircrafts} max={maxAircrafts} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Prefixo"
              value={state.prefixo}
              onChange={(v) => setState({ ...state, prefixo: v })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Fabricante"
              value={state.fabricante}
              onChange={(v) => setState({ ...state, fabricante: v })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Modelo"
              value={state.modelo}
              onChange={(v) => setState({ ...state, modelo: v })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Select
              label="Tipo de Aeronave"
              value={state.tipo}
              onChange={(v) => setState({ ...state, tipo: v })}
              options={[
                { label: "Monomotor", value: "monomotor" },
                { label: "Bimotor", value: "bimotor" },
                { label: "Jato", value: "jato" },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Ano de Fabricação"
              type="number"
              value={state.ano}
              onChange={(v) => setState({ ...state, ano: v })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Apelido (opcional)"
              value={state.apelido || ""}
              onChange={(v) => setState({ ...state, apelido: v })}
            />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button variant="contained" color="primary" disabled={!canAdd}>
            Criar Aeronave
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
