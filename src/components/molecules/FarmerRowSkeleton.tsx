import { TableRow, TableCell } from "@mui/material";
import SkeletonBox from "../atoms/Skeleton";

export default function FarmerRowSkeleton() {
  return (
    <TableRow>
      <TableCell><SkeletonBox width={140} /></TableCell> {/* Nome */}
      <TableCell><SkeletonBox width={120} /></TableCell> {/* Telefone */}
      <TableCell><SkeletonBox width={80} /></TableCell>  {/* Áreas */}
      <TableCell><SkeletonBox width={160} /></TableCell> {/* Serviços */}
      <TableCell><SkeletonBox width={60} /></TableCell>  {/* Ativo */}
      <TableCell><SkeletonBox width={150} /></TableCell> {/* Ações */}
    </TableRow>
  );
}
