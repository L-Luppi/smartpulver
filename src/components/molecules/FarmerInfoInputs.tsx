import { Grid } from "@mui/material";
import Input from "../atoms/Input";

export default function FarmerInfoInputs({ state, onChange }: any) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 3 }}>
        <Input
          label="Nome"
          value={state.nome}
          onChange={(v) => onChange("nome", v)}
        />
      </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
        <Input
          label="E-mail"
          value={state.email}
          onChange={(v) => onChange("email", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }}>
        <Input
          label="Apelido"
          value={state.apelido}
          onChange={(v) => onChange("apelido", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }}>
        <Input
          label="Telefone"
          value={state.telefone}
          onChange={(v) => onChange("telefone", v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }}>
        <Input
          label="CPF/CNPJ"
          value={state.cpfCnpj}
          onChange={(v) => onChange("cpfCnpj", v)}
        />
      </Grid>
    </>
  );
}
