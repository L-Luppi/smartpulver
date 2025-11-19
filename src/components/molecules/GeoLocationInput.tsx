import { Grid } from "@mui/material";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MapUpdater from "../../utils/mapUpdater";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const markerIcon = L.icon({ iconUrl, shadowUrl });

export default function GeoLocationInput({ state }: any) {
  const lat = Number(String(state.latitude).replace(",", "."));
  const lng = Number(String(state.longitude).replace(",", "."));

  const hasValidCoords = !isNaN(lat) && !isNaN(lng);

  const mapLat = hasValidCoords ? lat : -15.78;
  const mapLng = hasValidCoords ? lng : -47.93;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <div
          id="map-wrapper"
          style={{
            height: "300px",
            width: "100%",
            minHeight: "300px",
            position: "relative",
          }}
        >
          {state.latitude && state.longitude && (
            <MapContainer
              center={[mapLat, mapLng]}
              zoom={15}
              scrollWheelZoom={true}
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {hasValidCoords && (
                <Marker position={[mapLat, mapLng]} icon={markerIcon} />
              )}
              <MapUpdater lat={mapLat} lng={mapLng} />
            </MapContainer>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
