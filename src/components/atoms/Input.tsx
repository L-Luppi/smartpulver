import { TextField } from "@mui/material";

interface InputProps {
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: "text" | "number" | "password" | "area" | "email";
}

export default function Input({ label, value, onChange, type = "text" }: InputProps) {
  const isArea = type === "area";

  return (
    <TextField
      label={label}
      value={value ?? ""}
      type={isArea ? "text" : type}
      multiline={isArea}
      rows={isArea ? 4 : undefined}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin="normal"
      size="small"
    />
  );
}
