import { Box } from "@mui/material";
import { ReactNode } from "react";

interface MapContainerAtomProps {
  children: ReactNode;
  height?: string | number;
}

export default function MapContainerAtom({ children, height = 400 }: MapContainerAtomProps) {
  return (
    <Box sx={{ width: "100%", height }}>
      {children}
    </Box>
  );
}
