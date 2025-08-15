import { Card, CardContent, Box } from '@mui/material';
import Typography from '../atoms/Typography';
import { ReactNode } from 'react';

interface CardStatsProps {
  title: string;
  value: string | number;
  icon: ReactNode; // ícone passado como prop
}

export default function CardStats({ title, value, icon }: CardStatsProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
          </Box>
          <Box color="primary.main">{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}
