import { Box } from "@mui/material";
import { useState } from "react";
import AircraftForm from "../../components/organisms/AircraftForm";
import dayjs from 'dayjs';

export default function CreateAircraft() {
  const [state, setState] = useState({
    modeloDrone: "",
    nome: "",
    registroAnac: "",
    validadeRegistro: dayjs('2022-04-17'),
    anoFabricacao:  dayjs('2022-04-17'),
    anoAquisicao:  dayjs('2022-04-17'),
    numeroSerie: "",
    numeroSerieControladora: "",
    numeroSerieAvionica: "",
    ultimaManutencao: dayjs('2022-04-17'),
    anoBaixa: dayjs('2022-04-17'),
    notas: "",
  });

  return (
    <Box>
      <AircraftForm
        currentAircrafts={0}
        maxAircrafts={0}
        state={state}
        setState={setState}
      />
    </Box>
  );
}
