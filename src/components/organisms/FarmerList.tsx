import { Box } from "@mui/material";
import FarmerTable from "./FarmersTable";

interface FarmerListProps {
  farmers: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function FarmerList({
  farmers,
  loading,
  onEdit,
  onDelete,
  onAdd,
}: FarmerListProps) {
  return (
    <Box>
      <FarmerTable
        farmers={farmers}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        loading={loading}
      />
    </Box>
  );
}
