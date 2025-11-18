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
import FarmerRow from "../molecules/FarmerRow";
import FarmerRowSkeleton from "../molecules/FarmerRowSkeleton";

export interface Farmer {
  id: string;
  nome: string;
  telefone: string;
  areas: number;        // ou string[]
  servicos: string[];   // lista de serviços
  ativo: boolean;
}

interface FarmerTableProps {
  farmers: Farmer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

export default function FarmerTable({
  farmers,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: FarmerTableProps) {
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

  const paginatedFarmersData = farmers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const paginatedSkeletons = Array.from({ length: rowsPerPage });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ButtonDefault variant="contained" color="primary" onClick={onAdd}>
          Adicionar Produtor
        </ButtonDefault>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Áreas</TableCell>
              <TableCell>Serviços</TableCell>
              <TableCell>Ativo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? paginatedSkeletons.map((_, i) => <FarmerRowSkeleton key={i} />)
              : paginatedFarmersData.map((farmer) => (
                  <FarmerRow
                    key={farmer.id}
                    farmer={farmer}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={farmers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}
