import { useEffect, useRef, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PlotTable from "../../components/organisms/PlotTable";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPlots, deletePlot } from "../../store/plotSlice";

export default function ListPlots() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const plots = useAppSelector((s) => s.plots.plots);
  const loading = useAppSelector((s) => s.plots.loading);

  const initialized = useRef(false);

  // carregar apenas 1x
  useEffect(() => {
    if (!initialized.current) {
      dispatch(fetchPlots());
      initialized.current = true;
    }
  }, [dispatch]);

  const handleEdit = useCallback(
    (id: string) => navigate(`/plots/editar/${id}`),
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => dispatch(deletePlot(id)),
    [dispatch]
  );

  const handleAdd = useCallback(
    () => navigate("/plots/criar"),
    [navigate]
  );

  const plotsMemo = useMemo(() => plots, [plots]);

  return (
    <Box>
      <PlotTable
        plots={plotsMemo}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </Box>
  );
}
