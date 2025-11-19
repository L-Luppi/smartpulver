import { TableCell, TableRow } from "@mui/material";
import ButtonDefault from "../atoms/Button";
import { Product } from "../organisms/ProductsTable";

export interface ProductRowProps {
  product: Product;          // ✅ usa a interface Product existente
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <TableRow>
      <TableCell>{product.nome}</TableCell>
      <TableCell>{product.categoria}</TableCell>
      <TableCell>{product.dose}</TableCell>
      <TableCell>{product.bula}</TableCell>
      <TableCell>{product.agrofit}</TableCell>
      <TableCell>
        <ButtonDefault
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(product.id)}
          sx={{ mr: 1 }}
        >
          Editar
        </ButtonDefault>
        <ButtonDefault
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onDelete(product.id)}
        >
          Excluir
        </ButtonDefault>
      </TableCell>
    </TableRow>
  );
}
