import { Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

export default function DateInputs({ state, onChange }: any) {
  return (
    <>
      {/* Linha 1: Validade Registro + Última Manutenção */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Validade Registro"
            value={state.validadeRegistro}
            onChange={(v) => onChange("validadeRegistro", v as Dayjs)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Última Manutenção"
            value={state.ultimaManutencao}
            onChange={(v) => onChange("ultimaManutencao", v as Dayjs)}
          />
        </Grid>
      </Grid>

      {/* Linha 2: Ano Fabricação + Ano Aquisição + Ano Baixa */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker
            label="Ano Fabricação"
            value={state.anoFabricacao}
            onChange={(v) => onChange("anoFabricacao", v as Dayjs)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker
            label="Ano Aquisição"
            value={state.anoAquisicao}
            onChange={(v) => onChange("anoAquisicao", v as Dayjs)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker
            label="Ano Baixa"
            value={state.anoBaixa}
            onChange={(v) => onChange("anoBaixa", v as Dayjs)}
          />
        </Grid>
      </Grid>
    </>
  );
}
