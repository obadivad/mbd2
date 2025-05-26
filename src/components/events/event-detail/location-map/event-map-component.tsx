"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface Event {
  id: string;
  title: string;
  location_name?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  concentration_location?: string;
  concentration_coordinates?: {
    lat: number;
    lon: number;
  };
  dispersal_location?: string;
  dispersal_coordinates?: {
    lat: number;
    lon: number;
  };
}

interface EventMapComponentProps {
  event: Event;
  locale: string;
}

// Create custom markers
const createMarker = (
  type: "main" | "concentration" | "dispersal",
  color: string
) => {
  const icons = {
    main: "📍",
    concentration: "🚩",
    dispersal: "🏁",
  };

  return divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      ">
        ${icons[type]}
      </div>
    `,
    className: "custom-event-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function EventMapComponent({
  event,
  locale,
}: EventMapComponentProps) {
  const [mapReady, setMapReady] = useState(false);

  // Collect all available coordinates
  const locations = [];

  if (event.coordinates) {
    locations.push({
      type: "main" as const,
      name:
        event.location_name ||
        (locale === "pt" ? "Local do Evento" : "Event Location"),
      coordinates: event.coordinates,
      address: event.address,
    });
  }

  if (event.concentration_coordinates) {
    locations.push({
      type: "concentration" as const,
      name:
        event.concentration_location ||
        (locale === "pt" ? "Concentração" : "Concentration"),
      coordinates: event.concentration_coordinates,
    });
  }

  if (event.dispersal_coordinates) {
    locations.push({
      type: "dispersal" as const,
      name:
        event.dispersal_location ||
        (locale === "pt" ? "Dispersão" : "Dispersal"),
      coordinates: event.dispersal_coordinates,
    });
  }

  // Calculate center and zoom
  const center: [number, number] =
    locations.length > 0
      ? [locations[0].coordinates.lat, locations[0].coordinates.lon]
      : [-22.9068, -43.1729]; // Default to Rio de Janeiro

  const zoom = locations.length > 1 ? 13 : 15;

  const openInGoogleMaps = (lat: number, lon: number, name: string) => {
    const query = encodeURIComponent(`${lat},${lon} (${name})`);
    window.open(`https://www.google.com/maps/search/${query}`, "_blank");
  };

  return (
    <div className="h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location, index) => {
          const colors = {
            main: "#2D7E32",
            concentration: "#1976D2",
            dispersal: "#D32F2F",
          };

          return (
            <Marker
              key={index}
              position={[location.coordinates.lat, location.coordinates.lon]}
              icon={createMarker(location.type, colors[location.type])}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {location.name}
                    </h3>
                    {location.address && (
                      <p className="text-sm text-gray-600 mb-2">
                        {location.address}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        openInGoogleMaps(
                          location.coordinates.lat,
                          location.coordinates.lon,
                          location.name
                        )
                      }
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      {locale === "pt" ? "Como Chegar" : "Directions"}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    {location.coordinates.lat.toFixed(6)},{" "}
                    {location.coordinates.lon.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      {locations.length > 1 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
          <h4 className="font-semibold text-sm mb-2">
            {locale === "pt" ? "Legenda" : "Legend"}
          </h4>
          <div className="space-y-1 text-xs">
            {locations.map((location, index) => {
              const labels = {
                main: locale === "pt" ? "Local Principal" : "Main Location",
                concentration:
                  locale === "pt" ? "Concentração" : "Concentration",
                dispersal: locale === "pt" ? "Dispersão" : "Dispersal",
              };

              const colors = {
                main: "#2D7E32",
                concentration: "#1976D2",
                dispersal: "#D32F2F",
              };

              return (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: colors[location.type] }}
                  />
                  <span>{labels[location.type]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
