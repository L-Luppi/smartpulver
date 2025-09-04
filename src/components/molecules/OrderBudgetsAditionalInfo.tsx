import { Grid, Typography } from "@mui/material";
import Input from "../atoms/Input";

interface OrderBudgetsState {
    aditionalValues: string;
    orderTotal: string;
}

interface OrderBudgetsAditionalInfoProps {
  state: OrderBudgetsState;
  onChange: <K extends keyof OrderBudgetsState>(
    field: K,
    value: OrderBudgetsState[K]
  ) => void;
}

export default function OrderBudgetsAditionalInfo({ state, onChange }: OrderBudgetsAditionalInfoProps) {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6">Adicionais</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Valores adicionais (R$)"
          value={state.aditionalValues}
          onChange={(value) => onChange("aditionalValues", value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Valor Total da ordem (R$)"
          value={state.orderTotal}
          onChange={(value) => onChange("orderTotal", value)}
        />
      </Grid>
    </>
  );
}
