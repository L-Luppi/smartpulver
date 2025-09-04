import { Grid, Typography } from "@mui/material";
import Input from "../atoms/Input";

interface OrderBudgetsState {
 value: string;
 area: string;
 serviceTotal: string;
}

interface OrderBudgetsHectareProps {
  state: OrderBudgetsState;
  onChange: <K extends keyof OrderBudgetsState>(
    field: K,
    value: OrderBudgetsState[K]
  ) => void;
}

export default function OrderBudgetsHectare({ state, onChange }: OrderBudgetsHectareProps) {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6">Custos por Hectare</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Valor por hectare (R$)"
          value={state.value}
          onChange={(value) => onChange("value", value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Área Total (ha)"
          value={state.area}
          onChange={(value) => onChange("area", value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Valor Total do serviço (R$)"
          value={state.serviceTotal}
          onChange={(value) => onChange("serviceTotal", value)}
        />
      </Grid>
    </>
  );
}
