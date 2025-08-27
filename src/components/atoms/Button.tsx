import { Button } from "@mui/material";
import { ReactNode } from "react";

interface ButtonDefaultProps {
  onClick: () => void;
  children: ReactNode;
  color?: "primary" | "secondary";
  variant?: "text" | "contained" | "outlined";
  size?: "small" | "medium" | "large";
  sx?: object;
}

export default function ButtonDefault({ onClick, children, color = "primary", variant = "contained", sx, size = "medium" }: ButtonDefaultProps) {
  return (
    <Button onClick={onClick} color={color} variant={variant} sx={sx} size={size}>
      {children}
    </Button>
  );
}
