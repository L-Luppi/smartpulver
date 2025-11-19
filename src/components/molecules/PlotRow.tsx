import { TableCell, TableRow } from "@mui/material";
import ButtonDefault from "../atoms/Button";
import { Plot } from "../organisms/PlotTable";

export interface PlotRowProps {
  plot: Plot;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PlotRow({ plot, onEdit, onDelete }: PlotRowProps) {
  return (
    <TableRow>
      <TableCell>{plot.nome}</TableCell>
      <TableCell>{plot.nomeArea}</TableCell>
      <TableCell>{plot.area}</TableCell>
      <TableCell>{plot.mapeado}</TableCell>
      <TableCell>
        {plot.latitude ?? "-"}, {plot.longitude ?? "-"}
      </TableCell>

      <TableCell>
        <ButtonDefault
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(plot.id)}
          sx={{ mr: 1 }}
        >
          Editar
        </ButtonDefault>
        <ButtonDefault
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onDelete(plot.id)}
        >
          Excluir
        </ButtonDefault>
      </TableCell>
    </TableRow>
  );
}
