import { Grid, Typography } from "@mui/material";
import Input from "../atoms/Input";

interface OrderBudgetsState {
    value: string;
    distance: string;
    travelTotal: string;
}

interface OrderBudgetsTravelProps {
  state: OrderBudgetsState;
  onChange: <K extends keyof OrderBudgetsState>(
    field: K,
    value: OrderBudgetsState[K]
  ) => void;
}

export default function OrderBudgetsTravel({ state, onChange }: OrderBudgetsTravelProps ) {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6">Custos de Deslocamento</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Valor por Km (R$)"
          value={state.value}
          onChange={(value) => onChange("value", value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Distância Total (Km)"
          value={state.distance}
          onChange={(value) => onChange("distance", value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Input
          label="Valor Total do deslocamento (R$)"
          value={state.travelTotal}
          onChange={(value) => onChange("travelTotal", value)}
        />
      </Grid>
    </>
  );
}
