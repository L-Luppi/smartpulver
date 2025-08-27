import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import OrderForm from "../../components/organisms/OrderClientForm";
import OrderDetailsForm from "../../components/organisms/OrderDetailForm";
import OrderBudgetForm from "../../components/organisms/OrderBudgetsForm";

export default function CreateOrder() {
  return (
    <Box>
      <Card>
        <CardContent>
          {/* Informações do Cliente */}
          <Grid size={{ xs:12 }}>
            <Typography variant="h6">Informações do Cliente</Typography>
          </Grid>
           <Box mb={4}>
            <OrderForm
              state={{
                numeroServico: "",
                cliente: "",
                cnpj: "",
                propriedade: "",
                talhao: "",
                estado: "",
                municipio: "",
                endereco: "",
              }}
              setState={() => {}}
            />
          </Box>

          {/* Detalhes do Serviço */}
          <Grid size={{ xs:12 }}>
            <Typography variant="h6">Detalhes do Serviço</Typography>
          </Grid>
          <Box mb={4}>
            <OrderDetailsForm
              state={{
                numeroServico: "",
                cliente: "",
                cnpj: "",
                propriedade: "",
                talhao: "",
                estado: "",
                municipio: "",
                endereco: "",
              }}
              setState={() => {}}
            />
          </Box>

          {/* Orçamento */}
          <Box my={2}>
            <OrderBudgetForm
              state={{
                value: "",
                distance: "",
                travelTotal: "",
                aditionalValues: "",
                orderTotal: "",
                hectare: "",
                area: "",
                serviceTotal: "",
                images: [],
              }}
              setState={() => {}}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
