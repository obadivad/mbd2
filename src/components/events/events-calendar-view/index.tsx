"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    image_url?: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
    state: string;
  };
};

interface EventsCalendarViewProps {
  events: Event[];
  locale: string;
}

export function EventsCalendarView({
  events,
  locale,
}: EventsCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.start_datetime.split("T")[0]; // YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date
      .toLocaleDateString(locale === "pt" ? "pt-BR" : locale, {
        month: "short",
      })
      .toUpperCase();

    return { day, month };
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
    };

    return (
      labels[locale as keyof typeof labels]?.[type as keyof typeof labels.pt] ||
      type
    );
  };

  if (events.length === 0) {
    return (
      <div className="p-4 lg:p-8 text-center">
        <Calendar className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
          {locale === "pt" ? "Nenhum evento encontrado" : "No events found"}
        </h3>
        <p className="text-sm lg:text-base text-gray-600">
          {locale === "pt"
            ? "Não há eventos que correspondam aos filtros selecionados."
            : "There are no events matching the selected filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {Object.entries(eventsByDate).map(([date, dateEvents]) => {
        const { day, month } = formatDate(date);

        return (
          <div key={date}>
            {dateEvents.map((event, index) => {
              const eventUrl = generateEventURLFromEvent(event, locale);
              const isFirstEventOfDay = index === 0;

              return (
                <Link key={event.id} href={eventUrl}>
                  <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 mx-2 lg:mx-4 my-1 lg:my-2">
                    <CardContent className="p-3 lg:p-4">
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        {/* Date Badge - Only show for first event of the day */}
                        {isFirstEventOfDay && (
                          <div className="flex-shrink-0">
                            <div className="bg-green-600 text-white rounded-lg p-2 lg:p-3 text-center min-w-[50px] lg:min-w-[60px]">
                              <div className="text-xs font-medium">{month}</div>
                              <div className="text-lg lg:text-xl font-bold">
                                {day}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Event Image/Icon */}
                        <div className="flex-shrink-0">
                          {event.bloco.image_url ? (
                            <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden">
                              <Image
                                src={event.bloco.image_url}
                                alt={event.bloco.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                                {event.bloco.name}
                              </h3>
                              <p className="text-xs lg:text-sm text-gray-600 mb-1 truncate">
                                {event.title}
                              </p>
                            </div>

                            <Badge
                              className={`${getEventTypeColor(
                                event.event_type
                              )} text-xs ml-2 flex-shrink-0`}
                            >
                              {getEventTypeLabel(event.event_type)}
                            </Badge>
                          </div>

                          {/* Event Meta */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-gray-500 mt-2 space-y-1 sm:space-y-0">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(event.start_datetime)}</span>
                            </div>

                            {event.location_name && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">
                                  {event.location_name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Event Type Label */}
                          <div className="mt-2">
                            <span className="text-xs text-green-600 font-medium">
                              {getEventTypeLabel(event.event_type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
