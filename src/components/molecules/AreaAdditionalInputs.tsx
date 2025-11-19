import { Grid } from "@mui/material";
import GeoLocationInput from "./GeoLocationInput";
import NotesInput from "./NotesInput";
import Input from "../atoms/Input";

export default function AreaAdditionalInputs({ state, onChange }: any) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input
          label="Latitude"
          value={state.latitude ?? ""}
          type="number"
          onChange={(v) => onChange("latitude", v === "" ? "" : parseFloat(v))}
        />

        <Input
          label="Longitude"
          value={state.longitude ?? ""}
          type="number"
          onChange={(v) => onChange("longitude", v === "" ? "" : parseFloat(v))}
        />
        <NotesInput state={state} onChange={onChange} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }} marginTop={2}>
        <GeoLocationInput state={state} onChange={onChange} />
      </Grid>
    </>
  );
}
