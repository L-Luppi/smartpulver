import { Box, Card, CardContent } from "@mui/material";
import OrderClientInputs from "../molecules/OrderClientInputs";
import { Dispatch, SetStateAction } from "react";

interface ClientFormData {
  numeroServico: string;
  cliente: string;
  cnpj: string;
  propriedade: string;
  talhao: string;
  estado: string;
  municipio: string;
  endereco: string;
}

interface OrderFormProps {
  state: ClientFormData;
  setState: Dispatch<SetStateAction<ClientFormData>>;
}

export default function OrderForm({ state, setState }: OrderFormProps) {
  const handleChange = (field: keyof ClientFormData, value: string) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <OrderClientInputs state={state} onChange={handleChange} />
        </CardContent>
      </Card>
    </Box>
  );
}
