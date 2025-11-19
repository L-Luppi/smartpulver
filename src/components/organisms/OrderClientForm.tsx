import { Box } from "@mui/material";
import OrderClientInputs from "../molecules/OrderClientInputs";
import { Dispatch, SetStateAction } from "react";

interface ClientFormData {
  numeroServico: string;
  cliente: string;
  nomeArea: string;
  area: number;
}

interface OrderFormProps {
  state: ClientFormData;
  setState: Dispatch<SetStateAction<ClientFormData>>;
}

export default function OrderClientForm({ state, setState }: OrderFormProps) {
  const handleChange = (field: keyof ClientFormData, value: string) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
          <OrderClientInputs state={state} onChange={handleChange} />
    </Box>
  );
}
