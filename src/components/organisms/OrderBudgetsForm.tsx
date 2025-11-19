import { Box, Grid } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Input from "../atoms/Input";

interface OrderAdditionalFormData {
  notas: string;
}
interface OrderFormProps {
  state: OrderAdditionalFormData;
  setState: Dispatch<SetStateAction<OrderAdditionalFormData>>;
}

export default function OrderAdditionalInputs({ state, setState }: OrderFormProps) {
  const handleChange = (field: keyof OrderAdditionalFormData, value: any) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Input label="Informação Preliminar" type="area" value={state.notas} onChange={(v) => handleChange("notas", v)} />
            </Grid>
          </Grid>
    </Box>
  );
}
