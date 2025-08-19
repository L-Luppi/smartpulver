import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {items.map((item, idx) =>
        item.to ? (
          <Link key={idx} component={RouterLink} to={item.to}>
            {item.label}
          </Link>
        ) : (
          <Typography key={idx} color="text.primary">
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
