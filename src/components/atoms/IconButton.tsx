import { IconButton } from "@mui/material";
import { ReactNode } from "react";

interface IconButtonProps {
  onClick: () => void;
  children: ReactNode;
  sx?: object;
}

export default function IconButtonDefault({ onClick, children, sx }: IconButtonProps) {
  return (
    <IconButton onClick={onClick} sx={sx}>
      {children}
    </IconButton>
  );
}
