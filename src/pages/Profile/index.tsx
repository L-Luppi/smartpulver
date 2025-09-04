import { Box, Container } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Sidebar from "../../components/organisms/SideBar";
import ProfileHeader from "../../components/organisms/ProfileHeader";
// import ProfileInfoCard from "../../components/molecules/ProfileInfoCard";

export default function ProfilePage() {
  const { user } = useAuthenticator((context) => [context.user]);

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
          <ProfileHeader
            name={user?.username || "Usuário"}
            // picture={user?.attributes?.picture}
          />
          {/* <ProfileInfoCard
            email={user?.attributes?.email || "Não informado"}
            phone={user?.attributes?.phone_number}
          /> */}
        </Container>
      </Box>
    </Box>
  );
}
