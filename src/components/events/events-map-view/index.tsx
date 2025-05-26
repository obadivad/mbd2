"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"] & {
  bloco: {
    id: string;
    name: string;
    slug: string;
    short_description_pt?: string;
    image_url?: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
    state: string;
  };
  coordinates?: {
    lat: number;
    lon: number;
  };
};

interface EventsMapViewProps {
  events: Event[];
  locale: string;
}

// Dynamically import the actual map component with SSR disabled
const DynamicMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export function EventsMapView({ events, locale }: EventsMapViewProps) {
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

  return <DynamicMap events={events} locale={locale} />;
}
