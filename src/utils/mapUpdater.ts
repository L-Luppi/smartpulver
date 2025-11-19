import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface MapUpdaterProps {
  lat: number;
  lng: number;
}

export default function MapUpdater({ lat, lng }: MapUpdaterProps) {
  const map = useMap(); // map é do tipo Map

  useEffect(() => {
    if (!map) return;

    map.setView([lat, lng]);

    // Garante que o Leaflet recalcule o tamanho depois do layout estar pronto
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [lat, lng, map]);

  return null;
}
