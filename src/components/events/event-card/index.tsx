"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, Heart, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  generateEventURLFromEvent,
  getLocalizedEventType,
} from "@/lib/events/url-generator";
import type { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"] & {
  bloco: {
    id: string;
    name: string;
    slug: string;
    short_description_pt?: string;
    short_description_en?: string;
    short_description_fr?: string;
    short_description_es?: string;
    image_url?: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
    state: string;
  };
};

interface EventCardProps {
  event: Event;
  locale?: string;
  showSaveButton?: boolean;
  onSave?: (eventId: string) => void;
  onShare?: (event: Event) => void;
}

export function EventCard({
  event,
  locale = "pt",
  showSaveButton = true,
  onSave,
  onShare,
}: EventCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get localized description
  const getDescription = () => {
    const key = `short_description_${locale}` as keyof typeof event.bloco;
    return event.bloco[key] || event.bloco.short_description_pt || "";
  };

  // Format date and time
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    const dateStr = date.toLocaleDateString(
      locale === "pt" ? "pt-BR" : locale,
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
    const timeStr = date.toLocaleTimeString(
      locale === "pt" ? "pt-BR" : locale,
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(event.start_datetime);
  const eventUrl = generateEventURLFromEvent(event, locale);
  const localizedEventType = getLocalizedEventType(event.event_type, locale);

  // Event type colors
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "parade":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "rehearsal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "party":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "workshop":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsLoading(true);
    try {
      await onSave(event.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to save event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(event);
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: `${event.title} - ${event.bloco.name}`,
          url: window.location.origin + eventUrl,
        });
      }
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-green-300">
      <CardContent className="p-0">
        {/* Event Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {event.bloco.image_url ? (
            <Image
              src={event.bloco.image_url}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Users className="w-12 h-12 text-white opacity-80" />
            </div>
          )}

          {/* Event Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={`${getEventTypeColor(event.event_type)} font-medium`}
            >
              {localizedEventType}
            </Badge>
          </div>

          {/* Status Badge */}
          {!event.is_confirmed && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                {locale === "pt" ? "Não confirmado" : "Not confirmed"}
              </Badge>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="p-4">
          {/* Date and Time */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Event Title */}
          <Link href={eventUrl} className="block group">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
              {event.title}
            </h3>
          </Link>

          {/* Bloco Name */}
          <p className="text-green-600 font-medium mb-2">{event.bloco.name}</p>

          {/* Description */}
          {getDescription() && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {getDescription()}
            </p>
          )}

          {/* Location */}
          {(event.location_name || event.location_address) && (
            <div className="flex items-start gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                {event.location_name && (
                  <div className="font-medium">{event.location_name}</div>
                )}
                {event.location_address && <div>{event.location_address}</div>}
                <div className="text-xs text-gray-500">
                  {event.city.name}, {event.city.state}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Card Footer with Actions */}
      <CardFooter className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <Link href={eventUrl}>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              {locale === "pt" ? "Ver detalhes" : "View details"}
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {showSaveButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className={`p-2 ${
                  isSaved
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-green-600"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
