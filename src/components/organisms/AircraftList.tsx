import { Box } from "@mui/material";
import AircraftTable, { Aircraft } from "../molecules/AircraftTable";
import { useNavigate } from "react-router-dom";

export default function AircraftList() {
  const navigate = useNavigate();
  // Mock de aeronaves
  const mockAircrafts: Aircraft[] = [
    {
      id: "1",
      prefix: "PR-AAA",
      model: "Cessna 172",
      manufacturer: "Cessna",
      year: 2010,
      type: "Monomotor",
    },
    {
      id: "2",
      prefix: "PR-BBB",
      model: "Beechcraft King Air",
      manufacturer: "Beechcraft",
      year: 2015,
      type: "Turboélice",
    },
    {
      id: "3",
      prefix: "PR-CCC",
      model: "Embraer Phenom 100",
      manufacturer: "Embraer",
      year: 2018,
      type: "Jato leve",
    },
    {
      id: "4",
      prefix: "PR-DDD",
      model: "Piper PA-28",
      manufacturer: "Piper",
      year: 2005,
      type: "Monomotor",
    },
    {
      id: "5",
      prefix: "PR-EEE",
      model: "Airbus A320",
      manufacturer: "Airbus",
      year: 2020,
      type: "Jato comercial",
    },
  ];

  const handleEdit = (id: string) => {
    console.log("Editar aeronave:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Excluir aeronave:", id);
  };

  const handleAdd = () => {
    navigate("/aeronaves/criar");
  };

  return (
    <Box>
      <AircraftTable
        aircrafts={mockAircrafts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </Box>
  );
}
