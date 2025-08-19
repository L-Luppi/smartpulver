// molecules/AircraftLimitAlert.tsx
import Alert from "../atoms/Alert";

interface AircraftLimitAlertProps {
  current: number;
  max: number;
}

export default function AircraftLimitAlert({ current, max }: AircraftLimitAlertProps) {
  const canAdd = current < max;
  return canAdd ? (
    <Alert message={`Você ainda pode cadastrar ${max - current} aeronaves.`} />
  ) : (
    <Alert message="Você atingiu o limite máximo de aeronaves cadastradas!" severity="error" />
  );
}
