import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import OrderDetailstInputs from "../molecules/OrderDetailsInputs";
import { Dayjs } from 'dayjs';

interface OrderDetailsData {
  numeroServico: string;
  cliente: string;
  nomeArea: string;
  area: number;
  dataAbertura: Dayjs | null;
  previstoPara: Dayjs | null;
  dataFechamento: Dayjs | null;
  totalValue: number;
}

interface OrderDetailsFormProps {
  state: OrderDetailsData;
  setState: Dispatch<SetStateAction<OrderDetailsData>>;
}

export default function OrderDetailsForm({
  state,
  setState,
}: OrderDetailsFormProps) {
  const handleChange = (field: keyof OrderDetailsData, value: string | Dayjs) => {
    setState({ ...state, [field]: value });
  };

  return (
    <Box>
      <OrderDetailstInputs state={state} onChange={handleChange} />
    </Box>
  );
}
