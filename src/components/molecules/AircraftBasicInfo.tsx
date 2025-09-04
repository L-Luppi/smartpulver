import { Grid } from "@mui/material";
import Input from "../atoms/Input";
import Select from "../atoms/Select";

interface Props {
  state: {
    prefixo: string;
    fabricante: string;
    modelo: string;
        tipo: string;
    ano: string;
    apelido?: string | null;
  };
  onChange: (field: string, value: string) => void;
}

export default function AircraftInputs({ state, onChange }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input label="Prefixo" value={state.prefixo} onChange={(v) => onChange("prefixo", v)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input label="Fabricante" value={state.fabricante} onChange={(v) => onChange("fabricante", v)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input label="Modelo" value={state.modelo} onChange={(v) => onChange("modelo", v)} />
      </Grid>
       <Grid size={{ xs: 12, sm: 6 }}>
        <Select
          label="Tipo de Aeronave"
          value={state.tipo}
          onChange={(v) => onChange("tipo", v)}
          options={[
            { label: "Monomotor", value: "monomotor" },
            { label: "Bimotor", value: "bimotor" },
            { label: "Jato", value: "jato" },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input label="Ano de Fabricação" type="number" value={state.ano} onChange={(v) => onChange("ano", v)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input label="Apelido (opcional)" value={state.apelido || ""} onChange={(v) => onChange("apelido", v)} />
      </Grid>
    </Grid>
  );
}