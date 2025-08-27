import { TableCell, TableRow } from "@mui/material";
import ButtonDefault from "../atoms/Button";

export interface AircraftRowProps {
  aircraft: {
    id: string;
    prefix: string;
    model: string;
    manufacturer: string;
    year: number;
    type: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AircraftRow({ aircraft, onEdit, onDelete }: AircraftRowProps) {
  return (
    <TableRow>
      <TableCell>{aircraft.prefix}</TableCell>
      <TableCell>{aircraft.model}</TableCell>
      <TableCell>{aircraft.manufacturer}</TableCell>
      <TableCell>{aircraft.year}</TableCell>
      <TableCell>{aircraft.type}</TableCell>
      <TableCell>
        <ButtonDefault
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(aircraft.id)}
          sx={{ mr: 1 }}
        >
          Editar
        </ButtonDefault>
        <ButtonDefault
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onDelete(aircraft.id)}
        >
          Excluir
        </ButtonDefault>
      </TableCell>
    </TableRow>
  );
}