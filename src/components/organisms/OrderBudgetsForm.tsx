import { Box, Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import OrderBudgetsHectare from "../molecules/OrderBudgetsService";
import OrderBudgetsTravel from "../molecules/OrderBudgetTravel";
import OrderBudgetsAditionalInfo from "../molecules/OrderBudgetsAditionalInfo";
import ImageUploadAtom from "../atoms/ImageUpload";

export interface BudgetFormData {
  value: string;
  distance: string;
  travelTotal: string;
  aditionalValues: string;
  orderTotal: string;
  hectare: string;
  area: string;
  serviceTotal: string;
  images?: File[];
}

interface OrderFormProps {
  state: BudgetFormData;
  setState: Dispatch<SetStateAction<BudgetFormData>>;
}

export default function OrderBudgetForm({ state, setState }: OrderFormProps) {
  const handleChange = (field: keyof BudgetFormData, value: any) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
          <Grid container spacing={3}>
            {/* Linha 1 */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <OrderBudgetsHectare state={state} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <OrderBudgetsTravel state={state} onChange={handleChange} />
            </Grid>

            {/* Linha 2 */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <OrderBudgetsAditionalInfo
                state={state}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6">Croqui / Mapa da aplicação</Typography>
              </Grid>
              <ImageUploadAtom
                onChange={(value) => handleChange("images", value)}
                value={state.images}
              />
            </Grid>
          </Grid>
    </Box>
  );
}
