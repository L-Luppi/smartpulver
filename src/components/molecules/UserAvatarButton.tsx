import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AvatarAtom from "../atoms/Avatar";

interface UserAvatarButtonProps {
  name: string;
  truncatedName: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function UserAvatarButton({
  name,
  truncatedName,
  onClick,
}: UserAvatarButtonProps) {
  return (
    <ListItemButton component="button" onClick={onClick}>
      <ListItemIcon>
        <AvatarAtom size={40} name={name} />
      </ListItemIcon>
      <ListItemText primary={truncatedName} />
    </ListItemButton>
  );
}
