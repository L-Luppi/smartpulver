import { TableRow, TableCell } from "@mui/material";
import SkeletonBox from "../atoms/Skeleton";

export default function ProductRowSkeleton() {
  return (
    <TableRow>
      <TableCell><SkeletonBox width={120} /></TableCell>
      <TableCell><SkeletonBox width={120} /></TableCell>
      <TableCell><SkeletonBox width={120} /></TableCell>
      <TableCell><SkeletonBox width={120} /></TableCell>
      <TableCell><SkeletonBox width={120} /></TableCell>
    </TableRow>
  );
}