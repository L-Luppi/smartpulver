import { TableCell, TableRow } from "@mui/material";
import ButtonDefault from "../atoms/Button";
import { Area } from "../organisms/AreaTable";

export interface AreaRowProps {
  area: Area;          // ✅ usa a interface Area existente
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AreaRow({ area, onEdit, onDelete }: AreaRowProps) {
  return (
    <TableRow>
      <TableCell>{area.nome}</TableCell>
      <TableCell>{area.nomeComum}</TableCell>
      <TableCell>{area.responsavel}</TableCell>
      <TableCell>{area.cidade} - {area.estado}</TableCell>
      <TableCell>{area.latitude}, {area.longitude}</TableCell>
      <TableCell>{area.talhoes}</TableCell>
      <TableCell>{area.total}</TableCell>
      <TableCell>
        <ButtonDefault
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(area.id)}
          sx={{ mr: 1 }}
        >
          Editar
        </ButtonDefault>
        <ButtonDefault
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onDelete(area.id)}
        >
          Excluir
        </ButtonDefault>
      </TableCell>
    </TableRow>
  );
}
