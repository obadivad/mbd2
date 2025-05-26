"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateEventURLFromEvent } from "@/lib/events/url-generator";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface Event {
  id: string;
  title: string;
  event_type: string;
  start_datetime: string;
  location_name?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  bloco: {
    id: string;
    name: string;
    slug: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
    state: string;
  };
}

interface MapComponentProps {
  events: Event[];
  locale: string;
}

// Custom marker icons for different event types
const createEventIcon = (eventType: string, count: number = 1) => {
  const colors = {
    parade: "#9C27B0",
    rehearsal: "#3F51B5",
    party: "#E91E63",
    workshop: "#FF5722",
  };

  const color = colors[eventType as keyof typeof colors] || "#2D7E32";

  return divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${count > 1 ? count : getEventTypeInitial(eventType)}
      </div>
    `,
    className: "custom-event-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const getEventTypeInitial = (eventType: string) => {
  const initials = {
    parade: "D",
    rehearsal: "E",
    party: "F",
    workshop: "O",
  };
  return initials[eventType as keyof typeof initials] || "E";
};

// Component to fit map bounds to events
function MapBounds({ events }: { events: Event[] }) {
  const map = useMap();

  useEffect(() => {
    if (events.length === 0) return;

    // Use coordinates from the events table
    const validEvents = events.filter((event) => {
      return event.coordinates?.lat && event.coordinates?.lon;
    });

    if (validEvents.length === 0) return;

    if (validEvents.length === 1) {
      const event = validEvents[0];
      if (event.coordinates) {
        map.setView([event.coordinates.lat, event.coordinates.lon], 13);
      }
    } else {
      const bounds = validEvents
        .filter((event) => event.coordinates)
        .map((event) => {
          return [event.coordinates!.lat, event.coordinates!.lon] as [
            number,
            number
          ];
        });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [events, map]);

  return null;
}

// Get event type color
const getEventTypeColor = (type: string) => {
  switch (type) {
    case "parade":
      return "bg-purple-100 text-purple-800";
    case "rehearsal":
      return "bg-blue-100 text-blue-800";
    case "party":
      return "bg-pink-100 text-pink-800";
    case "workshop":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Get event type label
const getEventTypeLabel = (type: string, locale: string) => {
  const labels = {
    pt: {
      parade: "Desfile",
      rehearsal: "Ensaio",
      party: "Festa",
      workshop: "Oficina",
    },
    en: {
      parade: "Parade",
      rehearsal: "Rehearsal",
      party: "Party",
      workshop: "Workshop",
    },
  };

  return (
    labels[locale as keyof typeof labels]?.[type as keyof typeof labels.pt] ||
    type
  );
};

export default function MapComponent({ events, locale }: MapComponentProps) {
  const [mapReady, setMapReady] = useState(false);

  // Filter events that have location data
  const eventsWithLocation = events.filter((event) => {
    return event.coordinates?.lat && event.coordinates?.lon;
  });

  // Group events by location (for clustering)
  const eventsByLocation = eventsWithLocation.reduce((acc, event) => {
    if (event.coordinates) {
      const key = `${event.coordinates.lat},${event.coordinates.lon}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
    }
    return acc;
  }, {} as Record<string, Event[]>);

  // Format time for display
  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString(locale === "pt" ? "pt-BR" : locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for display
  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : locale, {
      day: "2-digit",
      month: "short",
    });
  };

  // Default center (Rio de Janeiro)
  const defaultCenter: [number, number] = [-22.9068, -43.1729];

  if (eventsWithLocation.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === "pt"
              ? "Nenhum evento com localização"
              : "No events with location"}
          </h3>
          <p className="text-gray-600">
            {locale === "pt"
              ? "Os eventos filtrados não possuem informações de localização."
              : "The filtered events do not have location information."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        className="h-full w-full"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapReady && <MapBounds events={eventsWithLocation} />}

        {Object.entries(eventsByLocation).map(
          ([locationKey, locationEvents]) => {
            const [lat, lng] = locationKey.split(",").map(Number);
            const primaryEvent = locationEvents[0];
            const eventCount = locationEvents.length;

            return (
              <Marker
                key={locationKey}
                position={[lat, lng]}
                icon={createEventIcon(primaryEvent.event_type, eventCount)}
              >
                <Popup className="custom-popup" maxWidth={300}>
                  <div className="space-y-3">
                    {eventCount > 1 ? (
                      // Multiple events at same location
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {eventCount}{" "}
                          {locale === "pt"
                            ? "eventos neste local"
                            : "events at this location"}
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {locationEvents.map((event) => (
                            <div
                              key={event.id}
                              className="border-b border-gray-200 pb-2 last:border-b-0"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-gray-900">
                                    {event.bloco.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mb-1">
                                    {event.title}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>
                                      {formatDate(event.start_datetime)}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {formatTime(event.start_datetime)}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  className={`${getEventTypeColor(
                                    event.event_type
                                  )} text-xs ml-2`}
                                >
                                  {getEventTypeLabel(event.event_type, locale)}
                                </Badge>
                              </div>
                              <Link
                                href={generateEventURLFromEvent(
                                  event as any,
                                  locale
                                )}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2 w-full"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  {locale === "pt"
                                    ? "Ver detalhes"
                                    : "View details"}
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Single event
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {primaryEvent.bloco.name}
                          </h3>
                          <Badge
                            className={`${getEventTypeColor(
                              primaryEvent.event_type
                            )} text-xs ml-2`}
                          >
                            {getEventTypeLabel(primaryEvent.event_type, locale)}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {primaryEvent.title}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatDate(primaryEvent.start_datetime)} •{" "}
                              {formatTime(primaryEvent.start_datetime)}
                            </span>
                          </div>
                        </div>

                        {primaryEvent.location_name && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{primaryEvent.location_name}</span>
                          </div>
                        )}

                        <Link
                          href={generateEventURLFromEvent(
                            primaryEvent as any,
                            locale
                          )}
                        >
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {locale === "pt" ? "Ver evento" : "View event"}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }
        )}
      </MapContainer>
    </div>
  );
}
