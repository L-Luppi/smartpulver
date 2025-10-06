import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";

interface UserDropdownMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function UserDropdownMenu({
  anchorEl,
  open,
  onClose,
  onLogout,
}: UserDropdownMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <MenuItem onClick={onClose} component="a" href="/perfil">
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText>Ver Perfil</ListItemText>
      </MenuItem>
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText onClick={onLogout}>Sair</ListItemText>
      </MenuItem>
    </Menu>
  );
}
