import { Box, Typography } from '@mui/material';

interface ChartHeaderProps {
  title: string;
}

export default function ChartHeader({ title }: ChartHeaderProps) {
  return (
    <Box mb={2}>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
}
