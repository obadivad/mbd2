"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface EventDetailMapProps {
  event: Event;
  locale: string;
}

// Dynamically import the actual map component with SSR disabled
const DynamicEventMap = dynamic(
  () =>
    import("./event-map-component").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
);

export function EventDetailMap({ event, locale }: EventDetailMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  // Check if we have any coordinates to show
  const hasCoordinates =
    event.coordinates ||
    event.concentration_coordinates ||
    event.dispersal_coordinates;

  if (!hasCoordinates) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === "pt"
              ? "Localização não disponível"
              : "Location not available"}
          </h3>
          <p className="text-gray-600">
            {locale === "pt"
              ? "As coordenadas deste evento não estão disponíveis."
              : "The coordinates for this event are not available."}
          </p>
          {event.address && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium">{event.address}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  if (event.address) {
                    const query = encodeURIComponent(event.address);
                    window.open(
                      `https://www.google.com/maps/search/${query}`,
                      "_blank"
                    );
                  }
                }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {locale === "pt"
                  ? "Abrir no Google Maps"
                  : "Open in Google Maps"}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <DynamicEventMap event={event} locale={locale} />;
}
