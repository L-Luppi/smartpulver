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
import PlotRow from "../molecules/PlotRow";
import PlotRowSkeleton from "../molecules/PlotRowSkeleton";

export interface Plot {
  id: string;
  nome: string;
  nomeArea: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  mapeado: string;
}

interface PlotTableProps {
  plots: Plot[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

export default function PlotTable({
  plots,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: PlotTableProps) {
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

  const paginatedPlots = plots.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const paginatedSkeletons = Array.from({ length: rowsPerPage });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ButtonDefault variant="contained" color="primary" onClick={onAdd}>
          Adicionar Área
        </ButtonDefault>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Nome da Área</TableCell>
              <TableCell>Área</TableCell>
              <TableCell>Mapeado</TableCell>
              <TableCell>Lat / Long</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? paginatedSkeletons.map((_, i) => <PlotRowSkeleton key={i} />)
              : paginatedPlots.map((plot) => (
                  <PlotRow
                    key={plot.id}
                    plot={plot}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={plots.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}
