import { Grid } from "@mui/material";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MapUpdater from "../../utils/mapUpdater";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function GeoLocationInput({ state }: any) {
  const lat = Number(state.latitude);
  const lng = Number(state.longitude);

  const hasValidCoords = !isNaN(lat) && !isNaN(lng);

  const mapLat = hasValidCoords ? lat : -15.78;
  const mapLng = hasValidCoords ? lng : -47.93;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <MapContainer
          center={[mapLat, mapLng]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: 300, width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {hasValidCoords && (
            <Marker position={[mapLat, mapLng]} icon={markerIcon} />
          )}

          <MapUpdater lat={mapLat} lng={mapLng} />
        </MapContainer>
      </Grid>
    </Grid>
  );
}
