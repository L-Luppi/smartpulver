import { Avatar } from "@mui/material";

interface AvatarAtomProps {
  name: string;
  src?: string;
  size?: number;
}

export default function AvatarAtom({ name, src, size = 80 }: AvatarAtomProps) {
  return (
    <Avatar
      src={src}
      alt={name}
      sx={{ width: size, height: size, fontSize: size / 3 }}
    >
      {name[0]}
    </Avatar>
  );
}
