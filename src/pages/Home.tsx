import { Typography, Paper, Box } from '@mui/material';

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Conteúdo da dashboard...</Typography>
      </Paper>
    </Box>
  );
}
