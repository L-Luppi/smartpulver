import { Grid } from "@mui/material";
import { Dayjs } from "dayjs";
import DatePickerInput from "../atoms/DatePicker";
import Input from "../atoms/Input";

interface ClientInfoFieldsProps {
  state: {
    numeroServico: string;
    cliente: string;
    nomeArea: string;
    area: number;
    dataAbertura: Dayjs | null;
    previstoPara: Dayjs | null;
    dataFechamento: Dayjs | null;
    totalValue: number;
  };
  onChange: (
    field: keyof ClientInfoFieldsProps["state"],
    value: string | Dayjs
  ) => void;
}

export default function OrderDetailstInputs({ state, onChange }: ClientInfoFieldsProps) {
  return (
    <Grid container spacing={2} alignItems={"center"}>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <DatePickerInput
          label="Data Abertura"
          value={state.dataAbertura}
          onChange={(v) => onChange("dataAbertura", v as Dayjs)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <DatePickerInput
          label="Previsto Para"
          value={state.previstoPara}
          onChange={(v) => onChange("previstoPara", v as Dayjs)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <DatePickerInput
          label="Concluída Em"
          value={state.dataFechamento}
          onChange={(v) => onChange("dataFechamento", v as Dayjs)}
        />
      </Grid>
      <Input label="Valor Previsto" value={state.totalValue} onChange={(v) => onChange("totalValue", v)} />
    </Grid>
  );
}
