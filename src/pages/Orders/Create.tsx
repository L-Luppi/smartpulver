import { Box } from "@mui/material";
import OrderForm from "../../components/organisms/OrderClientForm";
import OrderDetailsForm from "../../components/organisms/OrderDetailForm";

export default function CreateOrder() {
  return (
    <Box>
      <OrderForm
        state={{
          numeroServico: "",
          cliente: "",
          cnpj: "",
          propriedade: "",
          talhao: "",
          estado: "",
          municipio: "",
          endereco: "",
        }}
        setState={() => {}}
      />
      <OrderDetailsForm
        state={{
          numeroServico: "",
          cliente: "",
          cnpj: "",
          propriedade: "",
          talhao: "",
          estado: "",
          municipio: "",
          endereco: "",
        }}
        setState={() => {}}
      />
    </Box>
  );
}
