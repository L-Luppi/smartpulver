import { Box } from "@mui/material";
import AircraftTable from "../molecules/AircraftTable";

interface AircraftListProps {
  aircrafts: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function AircraftList({
  aircrafts,
  loading,
  onEdit,
  onDelete,
  onAdd,
}: AircraftListProps) {
  return (
    <Box>
      <AircraftTable
        aircrafts={aircrafts}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        loading={loading}
      />
    </Box>
  );
}
