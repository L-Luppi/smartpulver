import { TableCell, TableRow } from "@mui/material";
import ButtonDefault from "../atoms/Button";
import { Farmer } from "../organisms/FarmersTable";

export interface FarmerRowProps {
  farmer: Farmer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FarmerRow({ farmer, onEdit, onDelete }: FarmerRowProps) {
  return (
    <TableRow>
      <TableCell>{farmer.nome}</TableCell>
      <TableCell>{farmer.telefone}</TableCell>
      <TableCell>{farmer.areas}</TableCell>

      <TableCell>
        {farmer.servicos?.length > 0
          ? farmer.servicos.join(", ")
          : "—"}
      </TableCell>

      <TableCell>{farmer.ativo ? "Sim" : "Não"}</TableCell>

      <TableCell>
        <ButtonDefault
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(farmer.id)}
          sx={{ mr: 1 }}
        >
          Editar
        </ButtonDefault>

        <ButtonDefault
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onDelete(farmer.id)}
        >
          Excluir
        </ButtonDefault>
      </TableCell>
    </TableRow>
  );
}
