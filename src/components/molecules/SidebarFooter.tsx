import { useState } from "react";
import { Box, Divider, List } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import UserAvatarButton from "./UserAvatarButton";
import UserDropdownMenu from "../molecules/UserDropdownMenu";

export default function SidebarFooter() {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.signOut,
  ]);

  const username = user?.username || "Meu Perfil";
  const truncatedUsername =
    username.length > 15 ? username.slice(0, 15) + "..." : username;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    signOut();
  };

  return (
    <Box>
      <Divider />
      <List>
        <UserAvatarButton
          name={username}
          truncatedName={truncatedUsername}
          onClick={handleOpen}
        />
      </List>

      <UserDropdownMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onLogout={handleLogout}
      />
    </Box>
  );
}
