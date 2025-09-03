import { Typography, Box } from "@mui/material";

interface InfoTextAtomProps {
  label: string;
  value: string;
}

export default function InfoTextAtom({ label, value }: InfoTextAtomProps) {
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}