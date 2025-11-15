import { Grid } from "@mui/material";
import Input from "../atoms/Input";

export default function NotesInput({ state, onChange }: any) {
  return (
    <Grid size={{ xs: 12 }}>
      <Input
        label="Notas"
        type="area"
        value={state.notas}
        onChange={(v) => onChange("notas", v)}
      />
    </Grid>
  );
}
