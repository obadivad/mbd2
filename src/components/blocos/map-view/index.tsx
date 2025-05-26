"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { MapPin, Layers, Navigation, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface BlocoLocation {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  short_description_pt?: string;
  short_description_en?: string;
  short_description_fr?: string;
  short_description_es?: string;
  city: {
    name: string;
    slug: string;
  };
  instagram_url?: string;
  spotify_playlist_url?: string;
  image_url?: string;
}

interface MapViewProps {
  locale: string;
  city?: string;
  className?: string;
  height?: string;
}

export function MapView({
  locale,
  city,
  className,
  height = "500px",
}: MapViewProps) {
  const t = useTranslations("Map");
  const [selectedBloco, setSelectedBloco] = useState<BlocoLocation | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -22.9068, -43.1729,
  ]); // Rio de Janeiro default
  const [mapZoom, setMapZoom] = useState(11);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<any>(null);

  // Fetch blocos with coordinates
  const {
    data: blocos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blocos-map", city, locale],
    queryFn: async (): Promise<BlocoLocation[]> => {
      const params = new URLSearchParams({
        locale,
        hasCoordinates: "true",
        ...(city && { city }),
      });

      const response = await fetch(`/api/blocos?${params}`);
      if (!response.ok) throw new Error("Failed to fetch blocos");

      const data = await response.json();
      return data.data.filter(
        (bloco: any) => bloco.latitude && bloco.longitude
      );
    },
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(userPos);

          // If no specific city, center on user location
          if (!city) {
            setMapCenter(userPos);
            setMapZoom(13);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [city]);

  // City center coordinates
  const cityCenters: Record<string, [number, number]> = {
    "rio-de-janeiro": [-22.9068, -43.1729],
    salvador: [-12.9714, -38.5014],
    "sao-paulo": [-23.5505, -46.6333],
    recife: [-8.0476, -34.877],
    "belo-horizonte": [-19.9167, -43.9345],
  };

  // Update map center when city changes
  useEffect(() => {
    if (city && cityCenters[city]) {
      setMapCenter(cityCenters[city]);
      setMapZoom(12);
    }
  }, [city]);

  const getDescription = (bloco: BlocoLocation) => {
    const key = `short_description_${locale}` as keyof BlocoLocation;
    return (bloco[key] as string) || bloco.short_description_pt || "";
  };

  const handleBlocoClick = (bloco: BlocoLocation) => {
    setSelectedBloco(bloco);
    setMapCenter([bloco.latitude, bloco.longitude]);
    setMapZoom(15);
  };

  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Custom marker icon
  const createCustomIcon = (bloco: BlocoLocation) => {
    if (typeof window === "undefined") return null;

    const L = require("leaflet");
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  if (isLoading) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">{t("loadError")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className} ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
      }`}
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-white shadow-md"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {userLocation && (
          <Button
            variant="secondary"
            size="sm"
            onClick={centerOnUser}
            className="bg-white shadow-md"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          <span>{t("blocoLocation")}</span>
        </div>
        {userLocation && (
          <div className="flex items-center space-x-2 text-sm mt-1">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span>{t("yourLocation")}</span>
          </div>
        )}
      </div>

      {/* Selected Bloco Info */}
      {selectedBloco && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {selectedBloco.image_url && (
                  <img
                    src={selectedBloco.image_url}
                    alt={selectedBloco.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-green-800 truncate">
                    {selectedBloco.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    {selectedBloco.city.name}
                  </p>
                  {getDescription(selectedBloco) && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {getDescription(selectedBloco)}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    {selectedBloco.instagram_url && (
                      <Badge variant="secondary" className="text-xs">
                        Instagram
                      </Badge>
                    )}
                    {selectedBloco.spotify_playlist_url && (
                      <Badge variant="secondary" className="text-xs">
                        Spotify
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBloco(null)}
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div
        style={{ height: isFullscreen ? "100vh" : height }}
        className="w-full rounded-lg overflow-hidden"
      >
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={
                typeof window !== "undefined"
                  ? require("leaflet").divIcon({
                      className: "user-location-marker",
                      html: `
                        <div class="bg-blue-600 text-white rounded-full w-4 h-4 border-2 border-white shadow-lg"></div>
                      `,
                      iconSize: [16, 16],
                      iconAnchor: [8, 8],
                    })
                  : undefined
              }
            >
              <Popup>
                <div className="text-center">
                  <p className="font-medium">{t("yourLocation")}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Bloco markers */}
          {blocos?.map((bloco) => (
            <Marker
              key={bloco.id}
              position={[bloco.latitude, bloco.longitude]}
              icon={createCustomIcon(bloco)}
              eventHandlers={{
                click: () => handleBlocoClick(bloco),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-green-800 mb-1">
                    {bloco.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {bloco.city.name}
                  </p>
                  {getDescription(bloco) && (
                    <p className="text-sm text-gray-700 mb-2">
                      {getDescription(bloco)}
                    </p>
                  )}
                  <div className="flex space-x-1">
                    {bloco.instagram_url && (
                      <Badge variant="secondary" className="text-xs">
                        Instagram
                      </Badge>
                    )}
                    {bloco.spotify_playlist_url && (
                      <Badge variant="secondary" className="text-xs">
                        Spotify
                      </Badge>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
