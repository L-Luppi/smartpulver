import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import PlotInfoInputs from "../molecules/PlotInfoInputs";
import PlotAdditionalInputs from "../molecules/PlotAdditionalInputs";

export interface PlotFormState {
  cliente: string;
  area: string;
  talhao: string;
  codigoTalhao: string;
  areaTalhao: string;
  notas: string;
  latitude: number;
  longitude: number;
}


interface PlotFormProps {
  state: PlotFormState;
  setState: Dispatch<SetStateAction<PlotFormState>>;
}

export default function PlotForm({ state, setState }: PlotFormProps) {
  const handleChange = (field: keyof PlotFormState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setState({
      cliente: "",
      area: "",
      talhao: "",
      codigoTalhao: "",
      areaTalhao: "",
      notas: "",
      latitude: -15.78,
      longitude: -15.78,
    });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" mt={2} mb={1}>
            Informações do Talhão
          </Typography>

          <Grid container spacing={2} mb={2}>
            <PlotInfoInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={2} mb={1}>
            Informações Adicionais
          </Typography>

          <Grid container spacing={2} mb={2}>
            <PlotAdditionalInputs state={state} onChange={handleChange} />
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Limpar Todos os Campos
            </Button>

            <Button variant="contained" color="primary">
              Criar Talhão
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
