import { useState } from "react";
import { Box, Divider, List } from "@mui/material";
import UserAvatarButton from "./UserAvatarButton";
import UserDropdownMenu from "../molecules/UserDropdownMenu";
import { useAuth } from "react-oidc-context";

export default function SidebarFooter() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useAuth();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const signOutRedirect = async () => {
    try {
      // 🔹 Usa o fluxo padrão do react-oidc-context (respeita o endpoint do Cognito)
      await auth.signoutRedirect();

      // 🔹 Depois de redirecionar, limpa tokens locais
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <Box>
      <Divider />
      <List>
        <UserAvatarButton
          name={"username"}
          truncatedName={"truncatedUsername"}
          onClick={handleOpen}
        />
      </List>

      <UserDropdownMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onLogout={signOutRedirect}
      />
    </Box>
  );
}
