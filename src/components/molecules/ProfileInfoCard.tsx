import { Card, CardContent } from "@mui/material";
import InfoTextAtom from "../atoms/InfoText";

interface ProfileInfoCardProps {
  email: string;
  phone?: string;
}

export default function ProfileInfoCard({ email, phone }: ProfileInfoCardProps) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <InfoTextAtom label="Email" value={email} />
        {phone && <InfoTextAtom label="Telefone" value={phone} />}
      </CardContent>
    </Card>
  );
}