//import { useState } from "react";
import { Grid } from "@mui/material";
//import dayjs from "dayjs";

//import ConfigTest from "../ConfigTest.tsx";
import {GraphQLTest} from "../GraphQLTest.tsx";

/*import ChartCard from "../atoms/ChartCard";
import AreaChartWidget from "../molecules/AreaChartWidget";
import PieChartWidget from "../molecules/PieChartWidget";


const hectaresPorMes = [
  { mes: "Jan", hectares: 120 },
  { mes: "Fev", hectares: 90 },
  { mes: "Mar", hectares: 150 },
  { mes: "Abr", hectares: 200 },
  { mes: "Mai", hectares: 170 },
  { mes: "Jun", hectares: 220 },
  { mes: "Jul", hectares: 250 },
  { mes: "Ago", hectares: 190 },
  { mes: "Set", hectares: 210 },
  { mes: "Out", hectares: 180 },
  { mes: "Nov", hectares: 140 },
  { mes: "Dez", hectares: 160 },
];

const hectaresPorAeronave = [
  { name: "Aeronave A", value: 400 },
  { name: "Aeronave B", value: 300 },
  { name: "Aeronave C", value: 300 },
  { name: "Aeronave D", value: 200 },
];
*/
export default function TextBox() {

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12, lg: 8 }} sx={{ backgroundColor: '#0090ff'}}>
         <GraphQLTest />
      </Grid>
    </Grid>
  );
}
