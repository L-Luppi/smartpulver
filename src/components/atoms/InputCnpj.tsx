import { TextField } from "@mui/material";
import React from "react";
import { maskCNPJ } from "../../utils/Masks";

interface InputCNPJProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InputMaskCNPJ: React.FC<InputCNPJProps> = ({ label, value, onChange }) => {
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

export default InputMaskCNPJ;
