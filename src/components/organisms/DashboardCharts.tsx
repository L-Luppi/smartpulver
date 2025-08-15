import { useState } from "react";
import { Grid } from "@mui/material";
import dayjs from "dayjs";
import ChartCard from "../atoms/ChartCard";
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

export default function DashboardCharts() {
  const [mesFiltro, setMesFiltro] = useState("");
  const [anoFiltro, setAnoFiltro] = useState("2025");
  const [dataInicio, setDataInicio] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [dataFim, setDataFim] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));

  const dadosAreaFiltrados = hectaresPorMes.filter((d) =>
    mesFiltro ? d.mes.toLowerCase().startsWith(mesFiltro.toLowerCase()) : true
  );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12, lg: 8 }}>
        <ChartCard title={`Hectares Pulverizados (${anoFiltro})`}>
          <AreaChartWidget
            data={dadosAreaFiltrados}
            mesFiltro={mesFiltro}
            setMesFiltro={setMesFiltro}
            anoFiltro={anoFiltro}
            setAnoFiltro={setAnoFiltro}
          />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg: 4 }}>
        <ChartCard title="Hectares por Aeronave">
          <PieChartWidget
            data={hectaresPorAeronave}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
          />
        </ChartCard>
      </Grid>
    </Grid>
  );
}
