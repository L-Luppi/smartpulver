import { Alert as MUIAlert } from "@mui/material";

interface AlertProps {
  message: string;
  severity?: "info" | "warning" | "error" | "success";
}

export default function Alert({ message, severity = "info" }: AlertProps) {
  return <MUIAlert severity={severity}>{message}</MUIAlert>;
}
