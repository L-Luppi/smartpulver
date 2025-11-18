import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFarmers, deleteFarmerAsync } from "../../store/farmerSlice";
import FarmerList from "../../components/organisms/FarmerList";

export default function ListFarmers() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, page, rowsPerPage } = useAppSelector(
    (s) => s.farmers
  );

  useEffect(() => {
    dispatch(fetchFarmers({ page, rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (id: string) => {
    navigate(`/produtores/editar/${id}`);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteFarmerAsync(id));
  };

  const handleAdd = () => {
    navigate("/produtores/criar");
  };

  return (
    <Box>
      <FarmerList
        farmers={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </Box>
  );
}
