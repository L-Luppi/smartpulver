import { Box } from "@mui/material";
import { useState } from "react";
import AreaForm from "../../components/organisms/AreasForm";

export default function CreateArea() {
  const [state, setState] = useState({
    cliente: "",
    email: "",
    area: "",
    telefone: "",
    nomeComum: "",
    responsavel: "",
    cep: "",
    estado: "",
    cidade: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    notas: "",
    latitude: -15.78,
    longitude: -47.93,
  });

  return (
    <Box>
      <AreaForm state={state} setState={setState} />
    </Box>
  );
}
