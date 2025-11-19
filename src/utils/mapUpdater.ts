import { useMap } from "react-leaflet";

function MapUpdater({ lat, lng }: any) {
  const map = useMap();
  map.setView([lat, lng]); // atualiza o centro do mapa
  return null;
}

export default MapUpdater;