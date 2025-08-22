import { Grid } from "@mui/material";
import Input from "../atoms/Input";
import InputMaskCNPJ from "../atoms/InputCnpj";
import Select from "../atoms/Select";

interface ClientInfoFieldsProps {
  state: {
    numeroServico: string;
    cliente: string;
    cnpj: string;
    propriedade: string;
    talhao: string;
    estado: string;   // aqui vai ser a Data Inicial
    municipio: string; // aqui vai ser a Data Final
    endereco: string;
  };
  onChange: (field: keyof ClientInfoFieldsProps["state"], value: string) => void;
}

export default function OrderDetailstInputs({ state, onChange }: ClientInfoFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Tipo de Serviço"
          value={state.numeroServico}
          onChange={(value) => onChange("numeroServico", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Cultura"
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

      {/* AERONAVE (select) */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Select
          label="Aeronave"
          value={state.propriedade}
          onChange={(value) => onChange("propriedade", value)}
          options={[
            { label: "Aeronave 1", value: "a1" },
            { label: "Aeronave 2", value: "a2" },
          ]}
        />
      </Grid>

      {/* RESPONSÁVEL TÉCNICO (select) */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Select
          label="Responsável Técnico"
          value={state.talhao}
          onChange={(value) => onChange("talhao", value)}
          options={[
            { label: "Eng. João", value: "joao" },
            { label: "Eng. Maria", value: "maria" },
          ]}
        />
      </Grid>

      {/* DATA INICIAL (date) */}
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Input
          type="date"
          label="Data Inicial"
          value={state.estado}
          onChange={(value) => onChange("estado", value)}
        />
      </Grid>

      {/* DATA FINAL (date) */}
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Input
          type="date"
          label="Data Final"
          value={state.municipio}
          onChange={(value) => onChange("municipio", value)}
        />
      </Grid>

      {/* RESTO CONTINUA INPUT */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Input
          label="Piloto"
          value={state.endereco}
          onChange={(value) => onChange("endereco", value)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Input
          label="Ajudante"
          value={state.endereco}
          onChange={(value) => onChange("endereco", value)}
        />
      </Grid>
    </Grid>
  );
}
