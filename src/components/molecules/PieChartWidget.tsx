import { Box, TextField, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PieChartWidgetProps {
  data: { name: string; value: number }[];
  dataInicio: string;
  setDataInicio: (value: string) => void;
  dataFim: string;
  setDataFim: (value: string) => void;
  colors?: string[];
}

export default function PieChartWidget({
  data,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
}: PieChartWidgetProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Hectares por Aeronave
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="date"
          label="Data Início"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />
        <TextField
          type="date"
          label="Data Fim"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="80%" // usar percentual
            dataKey="value"
            label={({ name, percent = 0 }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
