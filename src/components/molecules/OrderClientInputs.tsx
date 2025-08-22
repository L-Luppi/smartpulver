import { Grid } from "@mui/material";
import Input from "../atoms/Input";
import InputMaskCNPJ from "../atoms/InputCnpj";

interface ClientInfoFieldsProps {
  state: {
    numeroServico: string;
    cliente: string;
    cnpj: string;
    propriedade: string;
    talhao: string;
    estado: string;
    municipio: string;
    endereco: string;
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
        <InputMaskCNPJ
          label="CNPJ"
          value={state.cnpj}
          onChange={(value) => onChange("cnpj", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Propriedade"
          value={state.propriedade}
          onChange={(value) => onChange("propriedade", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Talhão"
          value={state.talhao}
          onChange={(value) => onChange("talhao", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Estado"
          value={state.estado}
          onChange={(value) => onChange("estado", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Município"
          value={state.municipio}
          onChange={(value) => onChange("municipio", value)}
        />
      </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Endereço da propriedade"
          value={state.endereco}
          onChange={(value) => onChange("endereco", value)}
        />
      </Grid>
    </Grid>
  );
}
