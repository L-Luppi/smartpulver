import { Grid } from "@mui/material";
import Input from "../atoms/Input";

export default function SerialNumbersInputs({ state, onChange }: any) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Número de Série"
          value={state.numeroSerie}
          onChange={(v) => onChange("numeroSerie", v)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Nº Série Controladora"
          value={state.numeroSerieControladora}
          onChange={(v) => onChange("numeroSerieControladora", v)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Nº Série Placa Aviônica"
          value={state.numeroSerieAvionica}
          onChange={(v) => onChange("numeroSerieAvionica", v)}
        />
      </Grid>
    </>
  );
}
