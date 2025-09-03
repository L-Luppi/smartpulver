import { Box } from '@mui/material';
//import DashboardCards from '../components/organisms/DashboardInfoCards';
//import DashboardCharts from '../components/organisms/DashboardCharts';
import TestBox from '../components/organisms/TestBox';
import AgrofitProduto from "../components/AgrofitProduto.tsx";

export default function Home() {
  return (
    <Box>
      <Box mt={4} >
        APENAS PARA TESTES
        <TestBox />
        <AgrofitProduto />
      </Box>
    </Box>
  );
}