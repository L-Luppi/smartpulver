import { Grid } from "@mui/material";
import Input from "../atoms/Input";
import Select from "../atoms/Select";

export default function GeneralInfoInputs({ state, onChange }: any) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Select
          label="Modelo de Drone"
          value={state.modeloDrone}
          onChange={(v) => onChange("modeloDrone", v)}
          options={[
            { label: "AGRAS T10", value: "t10" },
            { label: "AGRAS T20", value: "t20" },
            { label: "AGRAS T20P", value: "t20p" },
            { label: "AGRAS T40", value: "t40" },
          ]}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Nome"
          value={state.nome}
          onChange={(v) => onChange("nome", v)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Registro ANAC"
          value={state.registroAnac}
          onChange={(v) => onChange("registroAnac", v)}
        />
      </Grid>
    </>
  );
}
