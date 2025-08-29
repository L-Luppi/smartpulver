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
} from "@mui/material";
import ButtonDefault from "../atoms/Button";
import AircraftRow from "../molecules/AircraftRow";
import AircraftRowSkeleton from "../molecules/AircraftRowSkeleton"; // novo

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
  loading?: boolean; // 👈 nova prop
}

export default function AircraftTable({
  aircrafts,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: AircraftTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Se está carregando, cria array "fake" para skeleton
  const paginatedAircrafts = loading
    ? Array.from({ length: rowsPerPage })
    : aircrafts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

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
            {loading
              ? paginatedAircrafts.map((_, i) => (
                  <AircraftRowSkeleton key={i} />
                ))
              : paginatedAircrafts.map((aircraft) => (
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
