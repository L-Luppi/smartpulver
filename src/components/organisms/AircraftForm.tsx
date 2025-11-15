import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import AircraftLimitAlert from "../molecules/AircraftLimitAlert";
import { Dispatch, SetStateAction } from "react";
import GeneralInfoInputs from "../molecules/GeneralInfoInputs";
import SerialNumbersInputs from "../molecules/SerialNumbersInputs";
import DateInputs from "../molecules/DateInputs";
import NotesInput from "../molecules/NotesInput";
import { Dayjs } from "dayjs";

export interface AircraftFormState {
  modeloDrone: string;
  nome: string;
  registroAnac: string;
  validadeRegistro: Dayjs;
  anoFabricacao: Dayjs;
  anoAquisicao: Dayjs;
  numeroSerie: string;
  numeroSerieControladora: string;
  numeroSerieAvionica: string;
  ultimaManutencao: Dayjs;
  anoBaixa: Dayjs;
  notas: string;
}

interface AircraftFormProps {
  state: AircraftFormState;
  setState: Dispatch<SetStateAction<AircraftFormState>>;
  maxAircrafts: number;
  currentAircrafts: number;
}

export default function AircraftForm({
  state,
  setState,
  maxAircrafts,
  currentAircrafts,
}: AircraftFormProps) {
  const canAdd = currentAircrafts < maxAircrafts;

  const handleChange = (field: keyof AircraftFormState, value: string | Dayjs) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setState({
      modeloDrone: "",
      nome: "",
      registroAnac: "",
      validadeRegistro: null as any,
      anoFabricacao: null as any,
      anoAquisicao: null as any,
      numeroSerie: "",
      numeroSerieControladora: "",
      numeroSerieAvionica: "",
      ultimaManutencao: null as any,
      anoBaixa: null as any,
      notas: "",
    });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <AircraftLimitAlert current={currentAircrafts} max={maxAircrafts} />

          <Typography variant="h6" mt={2} mb={1}>
            Informações Gerais
          </Typography>
          <Grid container spacing={2} mb={2}>
            <GeneralInfoInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={2} mb={1}>
            Números de Série
          </Typography>
          <Grid container spacing={2} mb={2}>
            <SerialNumbersInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={2} mb={1}>
            Datas
          </Typography>
          <Grid container spacing={2} mb={2}>
            <DateInputs state={state} onChange={handleChange} />
          </Grid>

          <Typography variant="h6" mt={4} mb={1}>
            Informações Adicionais
          </Typography>
          <Grid container spacing={2} mb={2}>
            <NotesInput state={state} onChange={handleChange} />
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
