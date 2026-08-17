import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { Country } from "../data/countries";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapViewProps {
  hoveredCountry: Country | null;
}

function FlyToCountry({ country }: { country: Country | null }) {
  const map = useMap();

  useEffect(() => {
    if (country) {
      map.stop();
      map.flyTo([country.lat, country.lng], 5, { duration: 0.6 });
    }
  }, [country, map]);

  return null;
}

export default function MapView({ hoveredCountry }: MapViewProps) {
  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Standard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Topographic">
            <TileLayer
              attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <FlyToCountry country={hoveredCountry} />
        {hoveredCountry && (
          <Marker position={[hoveredCountry.lat, hoveredCountry.lng]}>
            <Popup>
              <strong>
                {hoveredCountry.flag} {hoveredCountry.namePt}
              </strong>
              <br />
              Capital: {hoveredCountry.capital}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
