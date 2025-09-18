import { useEffect, useRef, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AircraftList from "../../components/organisms/AircraftList";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAircrafts, deleteAircraftAsync } from "../../store/aircraftSlice";
import { fetchManufacturers } from "../../store/manufacturerSlice";

export default function ListAircrafts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector((s) => s.aircrafts.items);
  const loading = useAppSelector((s) => s.aircrafts.loading);
  const page = useAppSelector((s) => s.aircrafts.page);
  const rowsPerPage = useAppSelector((s) => s.aircrafts.rowsPerPage);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      dispatch(fetchAircrafts({ page, rowsPerPage }));
      dispatch(fetchManufacturers({ page: 1, rowsPerPage: 10 }));
      initialized.current = true;
    }
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = useCallback((id: string) => {
    console.log("Editar aeronave:", id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteAircraftAsync(id));
    },
    [dispatch]
  );

  const handleAdd = useCallback(() => {
    navigate("/aeronaves/criar");
  }, [navigate]);

  const aircraftsMemo = useMemo(() => items, [items]);

  return (
    <Box>
      <AircraftList
        aircrafts={aircraftsMemo}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </Box>
  );
}
