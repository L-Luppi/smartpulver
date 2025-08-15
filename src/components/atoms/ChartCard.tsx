import { Card, CardContent } from "@mui/material";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
