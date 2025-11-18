import { TextField } from "@mui/material";
import React from "react";
import { maskCNPJ } from "../../utils/masks";

interface InputCNPJCPFProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InputMaskCNPJCPF: React.FC<InputCNPJCPFProps> = ({ label, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCNPJ(e.target.value);
    onChange(masked);
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      fullWidth
      margin="normal"
      size="small"
    />
  );
};

export default InputMaskCNPJCPF;
