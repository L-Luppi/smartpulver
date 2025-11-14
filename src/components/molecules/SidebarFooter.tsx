import { useState } from "react";
import { Box, Divider, List } from "@mui/material";
import UserAvatarButton from "./UserAvatarButton";
import UserDropdownMenu from "../molecules/UserDropdownMenu";
import { signOut } from "@aws-amplify/auth";

export default function SidebarFooter() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const signOutRedirect = async () => {
    try {
      await signOut({
        global: true,
        preferRedirect: true,
      });
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  return (
    <Box>
      <Divider />
      <List>
        <UserAvatarButton
          name={"Usuário"}
          truncatedName={"Usuário"}
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
