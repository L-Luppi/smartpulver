import { TableRow, TableCell } from "@mui/material";
import SkeletonBox from "../atoms/Skeleton";

export default function AreaRowSkeleton() {
  return (
    <TableRow>
      <TableCell><SkeletonBox width={120} /></TableCell> {/* nome */}
      <TableCell><SkeletonBox width={120} /></TableCell> {/* nomeComum */}
      <TableCell><SkeletonBox width={120} /></TableCell> {/* responsavel */}
      <TableCell><SkeletonBox width={120} /></TableCell> {/* cidade - estado */}
      <TableCell><SkeletonBox width={140} /></TableCell> {/* latitude, longitude */}
      <TableCell><SkeletonBox width={80} /></TableCell>  {/* talhoes */}
      <TableCell><SkeletonBox width={100} /></TableCell> {/* total */}
      
      <TableCell>
        <SkeletonBox width={160} height={32} /> {/* botões */}
      </TableCell>
    </TableRow>
  );
}
