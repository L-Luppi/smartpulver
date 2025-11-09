import { useState } from "react";
import { Box, Divider, List } from "@mui/material";
import UserAvatarButton from "./UserAvatarButton";
import UserDropdownMenu from "../molecules/UserDropdownMenu";

export default function SidebarFooter() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);
  

const signOutRedirect = () => {
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
  const postLogoutRedirect = import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI;

  // 🔹 Limpa storage antes do redirect
  localStorage.clear();
  sessionStorage.clear();

  // 🔹 Força o Cognito a destruir sessão completamente
  const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    postLogoutRedirect
  )}`;

  // 🔹 Redireciona imediatamente
  window.location.assign(logoutUrl);
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
