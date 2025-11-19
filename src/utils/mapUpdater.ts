import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapUpdater({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng]);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [lat, lng, map]);

  return null;
}
