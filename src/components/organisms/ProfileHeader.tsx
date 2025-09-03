import { Box, Typography } from "@mui/material";
import AvatarAtom from "../atoms/Avatar";

interface ProfileHeaderProps {
  name: string;
  picture?: string;
}

export default function ProfileHeader({ name, picture }: ProfileHeaderProps) {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <AvatarAtom name={name} src={picture} size={100} />
      <Typography variant="h5" fontWeight="bold">
        {name}
      </Typography>
    </Box>
  );
}