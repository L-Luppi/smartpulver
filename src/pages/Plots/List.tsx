import { useEffect, useRef, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AreaTable from "../../components/organisms/AreaTable";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAreas, deleteArea } from "../../store/areaSlice";

export default function ListPlots() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const areas = useAppSelector((s) => s.areas.areas);
  const loading = useAppSelector((s) => s.areas.loading);

  const initialized = useRef(false);

  // carregamento inicial (somente 1x)
  useEffect(() => {
    if (!initialized.current) {
      dispatch(fetchAreas());
      initialized.current = true;
    }
  }, [dispatch]);

  // handlers
  const handleEdit = useCallback(
    (id: string) => navigate(`/areas/editar/${id}`),
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => dispatch(deleteArea(id)),
    [dispatch]
  );

  const handleAdd = useCallback(
    () => navigate("/areas/criar"),
    [navigate]
  );

  // memo para evitar renders extras
  const areasMemo = useMemo(() => areas, [areas]);

  return (
    <Box>
      <AreaTable
        areas={areasMemo}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </Box>
  );
}
