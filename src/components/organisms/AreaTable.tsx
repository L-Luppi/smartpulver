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
import AreaRow from "../molecules/AreaRow";
import AreaRowSkeleton from "../molecules/AreaRowSkeleton";

export interface Area {
  id: string;
  nome: string;
  nomeComum: string;
  responsavel: string;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
  talhoes: number;
  total: number;
}

interface AreaTableProps {
  areas: Area[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

export default function AreaTable({
  areas,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: AreaTableProps) {
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

  // dados reais (paginados)
  const paginatedAreas = areas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // skeletons da página
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
              <TableCell>Nome Comum</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Cidade / Estado</TableCell>
              <TableCell>Coordenadas</TableCell>
              <TableCell>Talhões</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? paginatedSkeletons.map((_, i) => (
                  <AreaRowSkeleton key={i} />
                ))
              : paginatedAreas.map((area) => (
                  <AreaRow
                    key={area.id}
                    area={area}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={areas.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}
