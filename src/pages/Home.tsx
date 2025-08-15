import { Box } from '@mui/material';
import DashboardCards from '../components/organisms/DashboardInfoCards';
import DashboardCharts from '../components/organisms/DashboardCharts';

export default function Home() {
  return (
    <Box>
      <DashboardCards />
      <Box mt={4}>
        <DashboardCharts />
      </Box>
    </Box>
  );
}