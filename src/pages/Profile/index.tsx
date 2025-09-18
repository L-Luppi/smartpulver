import { Box, Container } from "@mui/material";
import { useAuth } from "react-oidc-context";
import Sidebar from "../../components/organisms/SideBar";
import ProfileInfoCard from "../../components/molecules/ProfileInfoCard";

export default function ProfilePage() {
 const user = useAuth();
  console.log(user)
  return (
    <Box display="flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={false} onClose={() => {}} />

      {/* Conteúdo */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` }, // responsivo com sidebar
        }}
      >
        <Container maxWidth="md">
          <ProfileInfoCard
            email={user?.user?.profile.email
|| "Não informado"}
            phone={user?.user?.profile.email}
          />
        </Container>
      </Box>
    </Box>
  );
}
