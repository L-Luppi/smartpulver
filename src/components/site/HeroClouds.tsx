// src/components/Hero/Clouds.jsx
import { Box } from "@mui/material";

export default function Clouds() {
  return (
    <>
      {/* Nuvem 1 */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "-200px",
          width: "200px",
          height: "100px",
          background:
            "radial-gradient(circle at 30% 30%, #fff, #f0f0f0 60%, transparent 70%)",
          borderRadius: "50%",
          animation: "moveCloud 60s linear infinite",
          opacity: 0.8,
          filter: "blur(2px)",
          "@keyframes moveCloud": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(150vw)" },
          },
        }}
      />
      {/* Nuvem 2 */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "-300px",
          width: "250px",
          height: "120px",
          background:
            "radial-gradient(circle at 40% 40%, #fff, #f5f5f5 60%, transparent 70%)",
          borderRadius: "50%",
          animation: "moveCloud 80s linear infinite",
          opacity: 0.6,
          filter: "blur(3px)",
        }}
      />
      {/* Nuvem 3 */}
      <Box
        sx={{
          position: "absolute",
          top: "70%",
          left: "-250px",
          width: "180px",
          height: "90px",
          background:
            "radial-gradient(circle at 30% 30%, #fff, #eaeaea 60%, transparent 70%)",
          borderRadius: "50%",
          animation: "moveCloud 100s linear infinite",
          opacity: 0.7,
          filter: "blur(2px)",
        }}
      />
    </>
  );
}
