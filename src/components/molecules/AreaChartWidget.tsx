import { Box, TextField, MenuItem, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AreaChartWidgetProps {
  data: { mes: string; hectares: number }[];
  mesFiltro: string;
  setMesFiltro: (value: string) => void;
  anoFiltro: string;
  setAnoFiltro: (value: string) => void;
}

export default function AreaChartWidget({
  data,
  mesFiltro,
  setMesFiltro,
  anoFiltro,
  setAnoFiltro,
}: AreaChartWidgetProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Hectares Pulverizados por Mês ({anoFiltro})
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select
          label="Mês"
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {data.map((d) => (
            <MenuItem key={d.mes} value={d.mes}>
              {d.mes}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Ano"
          value={anoFiltro}
          onChange={(e) => setAnoFiltro(e.target.value)}
          sx={{ minWidth: 100 }}
        />
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="hectares" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          <Line type="monotone" dataKey="hectares" stroke="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
