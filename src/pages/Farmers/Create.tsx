import { Box } from "@mui/material";
import { useState } from "react";
import FarmerForm from "../../components/organisms/FarmerForm";

export default function CreateFarmer() {
const [state, setState] = useState({
  nome: "",
  email: "",
  apelido: "",
  telefone: "",
  cpfCnpj: "",
  cep: "",
  estado: "",
  cidade: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  notas: "",
});


  return (
    <Box>
      <FarmerForm currentFarmers={0} maxFarmers={0} state={state} setState={setState} />
    </Box>
  );
}
