import { Grid } from "@mui/material";
import Input from "../atoms/Input";

export default function RecipeInputs({ state, onChange }: any) {
  return (
    <Grid container spacing={2}>
    <Grid size={{ xs: 12, sm: 4 }}>
      <Input
        label="Produto"
        value={state.produto}
        onChange={(v) => onChange("notas", v)}
      />
        </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
      <Input
        label="Categoria"
        value={state.categoria}
        onChange={(v) => onChange("notas", v)}
      />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
      <Input
        label="Dose"
        value={state.dose}
        onChange={(v) => onChange("notas", v)}
      />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
      <Input
        label="Piloto"
        value={state.piloto}
        onChange={(v) => onChange("notas", v)}
      />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
      <Input
        label="Drone"
        value={state.drone}
        onChange={(v) => onChange("notas", v)}
      />
        </Grid>
    </Grid>
  );
}
