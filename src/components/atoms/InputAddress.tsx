import { TextField } from "@mui/material";
import React from "react";
import { maskCep } from "../../utils/masks";

interface InputCEPProps {
  label: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
}

const InputMaskCEP: React.FC<InputCEPProps> = ({
  label,
  value,
  onChange,
  onBlur,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCep(e.target.value);
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
      onBlur={onBlur}
    />
  );
};

export default InputMaskCEP;
