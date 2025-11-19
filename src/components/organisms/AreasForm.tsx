import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Dayjs } from "dayjs";
import AreasAddressInputs from "../molecules/AreaAddressInputs";
import AreaInfoInputs from "../molecules/AreaInfoInputs";
import AreaAdditionalInputs from "../molecules/AreaAdditionalInputs";

export interface AreaFormState {
  cliente: string;
  email: string;
  area: string;
  telefone: string;
  nomeComum: string;
  responsavel: string;
  cep: string;
  estado: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  notas: string;
    latitude: number;
    longitude: number;
}

interface AreaFormProps {
  state: AreaFormState;
  setState: Dispatch<SetStateAction<AreaFormState>>;
}

export default function AreaForm({ state, setState }: AreaFormProps) {
  const handleChange = (field: keyof AreaFormState, value: string | Dayjs) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setState({
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
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" mt={2} mb={1}>
            Informações Gerais
          </Typography>
          <Grid container spacing={2} mb={2}>
            <AreaInfoInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={2} mb={1}>
            Endereços
          </Typography>
          <Grid container spacing={2} mb={2}>
            <AreasAddressInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={2} mb={1}>
            Informações Adicionais
          </Typography>
          <Grid container spacing={2} mb={2}>
            <AreaAdditionalInputs state={state} onChange={handleChange} />
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Limpar Todos os Campos
            </Button>
            <Button variant="contained" color="primary">
              Criar Área
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
