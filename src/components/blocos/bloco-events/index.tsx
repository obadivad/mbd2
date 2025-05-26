import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlocoEventsProps {
  events: any[];
  locale: string;
}

export function BlocoEvents({ events, locale }: BlocoEventsProps) {
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">
            Nenhum evento programado no momento
          </p>
        </CardContent>
      </Card>
    );
  }

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "parade":
        return "bg-purple-100 text-purple-800";
      case "rehearsal":
        return "bg-blue-100 text-blue-800";
      case "party":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeName = (eventType: string) => {
    const typeMap = {
      parade: "Desfile",
      rehearsal: "Ensaio",
      party: "Festa",
      workshop: "Oficina",
    };
    return typeMap[eventType as keyof typeof typeMap] || eventType;
  };

  const generateEventURL = (event: any) => {
    const date = event.start_datetime.split("T")[0];
    const typeMap = {
      pt: {
        parade: "desfile",
        rehearsal: "ensaio",
        party: "festa",
        workshop: "oficina",
      },
      en: {
        parade: "parade",
        rehearsal: "rehearsal",
        party: "party",
        workshop: "workshop",
      },
      fr: {
        parade: "defile",
        rehearsal: "repetition",
        party: "fete",
        workshop: "atelier",
      },
      es: {
        parade: "desfile",
        rehearsal: "ensayo",
        party: "fiesta",
        workshop: "taller",
      },
    };

    const localizedType =
      typeMap[locale as keyof typeof typeMap]?.[
        event.event_type as keyof typeof typeMap.pt
      ] || event.event_type;
    const basePath = locale === "pt" ? "" : `/${locale}`;

    return `${basePath}/${event.city.slug}/eventos/${date}/${localizedType}/${event.bloco.slug}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Próximos Eventos ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={generateEventURL(event)}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getEventTypeColor(event.event_type)}>
                      {getEventTypeName(event.event_type)}
                    </Badge>
                    {event.is_free && (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Gratuito
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {event.name ||
                      `${getEventTypeName(event.event_type)} - ${
                        event.bloco.name
                      }`}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(event.start_datetime), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.start_datetime), "HH:mm")}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
