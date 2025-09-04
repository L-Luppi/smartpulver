import { Skeleton } from "@mui/material";

interface SkeletonBoxProps {
  width?: number | string;
  height?: number | string;
  variant?: "text" | "rectangular" | "rounded" | "circular";
}

export default function SkeletonBox({
  width = "100%",
  height = 30,
  variant = "text",
}: SkeletonBoxProps) {
  return <Skeleton variant={variant} width={width} height={height} />;
}
