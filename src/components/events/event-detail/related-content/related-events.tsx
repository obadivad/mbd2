"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateEventURLFromEvent } from "@/lib/events/url-generator";

interface Event {
  id: string;
  title: string;
  event_type: string;
  start_datetime: string;
  location_name?: string;
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
}

interface RelatedEventsProps {
  events: Event[];
  locale: string;
}

export function RelatedEvents({ events, locale }: RelatedEventsProps) {
  // Format date for display
  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : locale, {
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString(locale === "pt" ? "pt-BR" : locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
  const getEventTypeLabel = (type: string) => {
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
      fr: {
        parade: "Défilé",
        rehearsal: "Répétition",
        party: "Fête",
        workshop: "Atelier",
      },
      es: {
        parade: "Desfile",
        rehearsal: "Ensayo",
        party: "Fiesta",
        workshop: "Taller",
      },
    };

    return (
      labels[locale as keyof typeof labels]?.[type as keyof typeof labels.pt] ||
      type
    );
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">
          {locale === "pt"
            ? "Nenhum evento relacionado encontrado"
            : "No related events found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const eventUrl = generateEventURLFromEvent(event, locale);

        return (
          <Link key={event.id} href={eventUrl}>
            <div className="group p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start space-x-3">
                {/* Event Image/Icon */}
                <div className="flex-shrink-0">
                  {event.bloco.image_url ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={event.bloco.image_url}
                        alt={event.bloco.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                      {event.bloco.name}
                    </h4>
                    <Badge
                      className={`${getEventTypeColor(
                        event.event_type
                      )} text-xs ml-2 flex-shrink-0`}
                    >
                      {getEventTypeLabel(event.event_type)}
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 truncate">
                    {event.title}
                  </p>

                  {/* Event Meta */}
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(event.start_datetime)}</span>
                      <Clock className="w-3 h-3 ml-2 mr-1" />
                      <span>{formatTime(event.start_datetime)}</span>
                    </div>

                    {event.location_name && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{event.location_name}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      {event.city.name}, {event.city.state}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      {events.length >= 6 && (
        <div className="text-center pt-2">
          <Link
            href={`/${locale}/eventos`}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {locale === "pt" ? "Ver mais eventos →" : "View more events →"}
          </Link>
        </div>
      )}
    </div>
  );
}
