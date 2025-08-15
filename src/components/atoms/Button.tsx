import { Button } from "@mui/material";
import { ReactNode } from "react";

interface ButtonDefaultProps {
  onClick: () => void;
  children: ReactNode;
  color?: "primary" | "secondary";
  variant?: "text" | "contained" | "outlined";
  sx?: object;
}

export default function ButtonDefault({ onClick, children, color = "primary", variant = "contained", sx }: ButtonDefaultProps) {
  return (
    <Button onClick={onClick} color={color} variant={variant} sx={sx}>
      {children}
    </Button>
  );
}
