import { Grid } from "@mui/material";
import { Dayjs } from "dayjs";
import DatePickerInput from "../atoms/DatePicker";

export default function DateInputs({ state, onChange }: any) {
  return (
    <>
      {/* Linha 1 */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePickerInput
            label="Validade Registro"
            value={state.validadeRegistro}
            onChange={(v) => onChange("validadeRegistro", v as Dayjs)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePickerInput
            label="Última Manutenção"
            value={state.ultimaManutencao}
            onChange={(v) => onChange("ultimaManutencao", v as Dayjs)}
          />
        </Grid>
      </Grid>

      {/* Linha 2 */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePickerInput
            label="Ano Fabricação"
            value={state.anoFabricacao}
            onChange={(v) => onChange("anoFabricacao", v as Dayjs)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePickerInput
            label="Ano Aquisição"
            value={state.anoAquisicao}
            onChange={(v) => onChange("anoAquisicao", v as Dayjs)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePickerInput
            label="Ano Baixa"
            value={state.anoBaixa}
            onChange={(v) => onChange("anoBaixa", v as Dayjs)}
          />
        </Grid>
      </Grid>
    </>
  );
}
