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

  requestAnimationFrame(() => {
    map.invalidateSize();
  });
}, [lat, lng, map]);


  return null;
}
