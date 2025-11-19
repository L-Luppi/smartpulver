import { Grid } from "@mui/material";
import Input from "../atoms/Input";

export default function PlotInfoInputs({ state, onChange }: any) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Cliente"
          value={state.cliente}
          onChange={(v) => onChange("cliente", v)}
        />
      </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Área"
          value={state.area}
          onChange={(v) => onChange("area", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Talhão"
          value={state.talhao}
          onChange={(v) => onChange("talhao", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Código do Talhão"
          value={state.codigoTalhao}
          onChange={(v) => onChange("codigoTalhao", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Área do Talhão (ha)"
          value={state.areaTalhao}
          onChange={(v) => onChange("areaTalhao", v)}
        />
      </Grid>
    </>
  );
}
