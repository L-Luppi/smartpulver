import { useState, useEffect } from "react";
import { Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import OrderClientForm from "../../components/organisms/OrderClientForm";
import OrderDetailsForm from "../../components/organisms/OrderDetailForm";
import OrderBudgetForm from "../../components/organisms/OrderBudgetsForm";
import { Dayjs } from "dayjs";
import RecipeInputs from "../../components/molecules/RecipeInputs";
import ProductTable from "../../components/organisms/ProductsTable";
import { fetchFarmers, deleteFarmerAsync } from "../../store/farmerSlice";

export default function CreateOrder() {
  const [clientData, setClientData] = useState({
    numeroServico: "",
    cliente: "",
    nomeArea: "",
    area: 0,
  });

  const [detailsData, setDetailsData] = useState({
    numeroServico: "",
    cliente: "",
    nomeArea: "",
    area: 0,
    dataAbertura: null as Dayjs | null,
    previstoPara: null as Dayjs | null,
    dataFechamento: null as Dayjs | null,
    totalValue: 0
  });

  const [budgetData, setBudgetData] = useState({
    notas: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {  loading, page, rowsPerPage } = useAppSelector(
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
      <Card>
        <CardContent>
          {/* CLIENTE */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">Informações da Ordem de Serviço</Typography>
          </Grid>

          <Box mb={4}>
            <OrderClientForm state={clientData} setState={setClientData} />
          </Box>

          <Box mb={4}>
            <OrderDetailsForm state={detailsData} setState={setDetailsData} />
          </Box>

          {/* ORÇAMENTO */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">Informações adicionais</Typography>
          </Grid>

          <Box mt={2}>
            <OrderBudgetForm state={budgetData} setState={setBudgetData} />
          </Box>

          <Divider sx={{ my: 4 }} /> 

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">Receita para Aplicação</Typography>
          </Grid>
          <Box mt={2}>
            <RecipeInputs state={budgetData} onChange={setBudgetData} />
          </Box>
          <Box mt={4}>
            <ProductTable products={[]} onAdd={handleAdd} onDelete={handleDelete} onEdit={handleEdit} loading={loading} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
