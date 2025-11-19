import { Grid } from "@mui/material";
import Input from "../atoms/Input";

interface ClientInfoFieldsProps {
  state: {
    numeroServico: string;
    cliente: string;
    nomeArea: string;
    area: number;
  };
  onChange: (field: keyof ClientInfoFieldsProps["state"], value: string) => void;
}

export default function OrderClientInputs({ state, onChange }: ClientInfoFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Número de Serviço"
          value={state.numeroServico}
          onChange={(value) => onChange("numeroServico", value)}
        />
      </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Cliente"
          value={state.cliente}
          onChange={(value) => onChange("cliente", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Área a ser aplicada"
          value={state.nomeArea}
          onChange={(value) => onChange("nomeArea", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Área (ha)"
          value={state.area}
          onChange={(value) => onChange("area", value)}
        />
      </Grid>
    </Grid>
  );
}
