import { TextField } from "@mui/material";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export default function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <TextField
      label={label}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin="normal"
    />
  );
}
