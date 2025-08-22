import { Box, Card, CardContent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import OrderDetailstInputs from "../molecules/OrderDetailsInputs";

interface OrderDetailsData {
  numeroServico: string;
    cliente: string;
    cnpj: string;
    propriedade: string;
    talhao: string;
    estado: string;
    municipio: string;
    endereco: string;
}

interface OrderDetailsFormProps {
  state: OrderDetailsData;
  setState: Dispatch<SetStateAction<OrderDetailsData>>;
}

export default function OrderDetailsForm({ state, setState }: OrderDetailsFormProps) {
  const handleChange = (field: keyof OrderDetailsData, value: string) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <OrderDetailstInputs state={state} onChange={handleChange} />
        </CardContent>
      </Card>
    </Box>
  );
}
