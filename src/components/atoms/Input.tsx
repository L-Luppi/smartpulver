import { TextField } from "@mui/material";

interface InputProps {
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  disable?: boolean;
  type?: "text" | "number" | "password" | "area" | "email";
}

export default function Input({ label, value, onChange, type = "text", disable = false }: InputProps) {
  const isArea = type === "area";

  return (
    <TextField
      label={label}
      value={value ?? ""}
      type={isArea ? "text" : type}
      multiline={isArea}
      disabled={disable}
      rows={isArea ? 4 : undefined}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin="normal"
      size="small"
    />
  );
}
