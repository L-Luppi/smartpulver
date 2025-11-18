import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Dayjs } from "dayjs";
import FarmerInfoInputs from "../molecules/FarmerInfoInputs";
import FarmerAddressInputs from "../molecules/FarmerAddressInputs";

export interface FarmerFormState {
  nome: string;
  email: string;
  apelido: string;
  telefone: string;
  cpfCnpj: string;
  cep: string;
  estado: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  notas: string;
}


interface FarmerFormProps {
  state: FarmerFormState;
  setState: Dispatch<SetStateAction<FarmerFormState>>;
  maxFarmers: number;
  currentFarmers: number;
}

export default function FarmerForm({
  state,
  setState,
  maxFarmers,
  currentFarmers,
}: FarmerFormProps) {
  const canAdd = currentFarmers < maxFarmers;

  const handleChange = (field: keyof FarmerFormState, value: string | Dayjs) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setState({
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
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" mt={2} mb={1}>
            Informações Gerais
          </Typography>
          <Grid container spacing={2} mb={2}>
           <FarmerInfoInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={2} mb={1}>
            Endereços
          </Typography>
          <Grid container spacing={2} mb={2}>
            <FarmerAddressInputs state={state} onChange={handleChange} />
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Limpar Todos os Campos
            </Button>
            <Button variant="contained" color="primary" disabled={!canAdd}>
              Criar Aeronave
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
