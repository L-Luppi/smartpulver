import { Grid } from "@mui/material";
import Input from "../atoms/Input";

export default function AreaInfoInputs({ state, onChange }: any) {
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
          label="email"
          value={state.email}
          type="email"
          onChange={(v) => onChange("email", v)}
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
          label="Nome Comum"
          value={state.apelido}
          onChange={(v) => onChange("nomeComum", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Telefone"
          value={state.telefone}
          onChange={(v) => onChange("telefone", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Responsável"
          value={state.cpfCnpj}
          onChange={(v) => onChange("responsavel", v)}
        />
      </Grid>
    </>
  );
}
