import { Card, CardContent, CardActions, Box, Button } from "@mui/material";
import Typography from "../atoms/Typography";
import { ReactNode } from "react";

interface CardStatsProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  clickable?: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export default function CardStats({
  title,
  value,
  icon,
  clickable = false,
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel = "Ver",
  secondaryLabel = "Criar",
}: CardStatsProps) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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

      {clickable && (
     <CardActions
  sx={{
    mt: "auto",
    display: "flex",
    gap: 1,
    p: 2,
    borderTop: "1px solid",
    borderColor: "divider",
    width: "100%",
  }}
>
  <Button
    onClick={onPrimaryClick}
    variant="contained"
    color="primary"
    sx={{
      flex: 1, // ocupa todo espaço disponível
    }}
  >
    {primaryLabel}
  </Button>
  <Button
    onClick={onSecondaryClick}
    variant="outlined"
    color="secondary"
    sx={{
      flex: 1,
    }}
  >
    {secondaryLabel}
  </Button>
</CardActions>

      )}
    </Card>
  );
}
