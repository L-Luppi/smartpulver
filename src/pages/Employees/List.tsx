import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AircraftList from "../../components/organisms/AircraftList";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAircrafts, deleteAircraftAsync } from "../../store/aircraftSlice";

export default function ListAircrafts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, page, rowsPerPage } = useAppSelector(
    (s) => s.aircrafts
  );

  useEffect(() => {
    dispatch(fetchAircrafts({ page, rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (id: string) => {
    console.log("Editar aeronave:", id);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAircraftAsync(id));
  };

  const handleAdd = () => {
    navigate("/aeronaves/criar");
  };

  return (
    <Box>
      <AircraftList
        aircrafts={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </Box>
  );
}
