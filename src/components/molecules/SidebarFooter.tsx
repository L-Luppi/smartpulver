import { useState, useEffect } from "react";
import { Box, Divider, List } from "@mui/material";
import UserAvatarButton from "./UserAvatarButton";
import UserDropdownMenu from "../molecules/UserDropdownMenu";
import { signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export default function SidebarFooter() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [userName, setUserName] = useState({});
  useEffect(() => {
  async function loadUser() {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.payload;

      const name =
        idToken?.nickname ||
        idToken?.name ||
        idToken?.email ||
        "Usuário";
      console.log(idToken)
      setUserName(name);

    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  }

  loadUser();
}, []);


  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const signOutRedirect = async () => {
    try {
      await signOut({ global: true });
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  return (
    <Box>
      <Divider />
      {/* <List>
        <UserAvatarButton
          name={userName.name || "Usuário"}
          truncatedName={userName.name ? String(userName.name).split(" ")[0] : "Usuário"}
          onClick={handleOpen}
        />
      </List> */}

      <UserDropdownMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onLogout={signOutRedirect}
      />
    </Box>
  );
}
