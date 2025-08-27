import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import ButtonDefault from "../atoms/Button";
import AircraftRow, { AircraftRowProps } from "../molecules/AircraftRow";

export interface Aircraft {
  id: string;
  prefix: string;
  model: string;
  manufacturer: string;
  year: number;
  type: string;
}

interface AircraftTableProps {
  aircrafts: Aircraft[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function AircraftTable({
  aircrafts,
  onEdit,
  onDelete,
  onAdd,
}: AircraftTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAircrafts = aircrafts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ButtonDefault variant="contained" color="primary" onClick={onAdd}>
          Adicionar Aeronave
        </ButtonDefault>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prefixo</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Fabricante</TableCell>
              <TableCell>Ano de Fabricação</TableCell>
              <TableCell>Tipo de Aeronave</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAircrafts.map((aircraft) => (
              <AircraftRow
                key={aircraft.id}
                aircraft={aircraft}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={aircrafts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}
