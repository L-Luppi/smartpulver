import { useState } from "react";
import { Box, Divider, List } from "@mui/material";
import { useAuth } from "react-oidc-context";
import UserAvatarButton from "./UserAvatarButton";
import UserDropdownMenu from "../molecules/UserDropdownMenu";

export default function SidebarFooter() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useAuth();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    auth.signoutRedirect({
      post_logout_redirect_uri: import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI,
    });
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
        onLogout={handleLogout}
      />
    </Box>
  );
}
