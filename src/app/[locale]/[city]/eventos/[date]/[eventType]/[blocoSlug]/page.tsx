import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Heart,
  Share2,
  Navigation,
  Ticket,
  Info,
  Music,
  Camera,
} from "lucide-react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventDetailMap } from "@/components/events/event-detail/location-map";
import { RelatedEvents } from "@/components/events/event-detail/related-content/related-events";
import { BlocoInfo } from "@/components/events/event-detail/event-info/bloco-info";
import { CalendarIntegration } from "@/components/events/calendar-integration/export-buttons";
import {
  parseEventURL,
  getLocalizedEventType,
} from "@/lib/events/url-generator";
import type { Database } from "@/types/database";
import { Suspense } from "react";

type EventType = Database["public"]["Tables"]["events"]["Row"]["event_type"];

interface EventPageProps {
  params: {
    locale: string;
    city: string;
    date: string;
    eventType: string;
    blocoSlug: string;
  };
}

type EventWithRelations = Database["public"]["Tables"]["events"]["Row"] & {
  bloco: {
    id: string;
    name: string;
    slug: string;
    short_description_pt?: string;
    short_description_en?: string;
    short_description_fr?: string;
    short_description_es?: string;
    image_url?: string;
    instagram_url?: string;
    facebook_url?: string;
    youtube_channel_url?: string;
    spotify_playlist_url?: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
    state: string;
  };
};

async function getEvent(
  citySlug: string,
  date: string,
  eventType: EventType,
  blocoSlug: string
): Promise<EventWithRelations | null> {
  const supabase = createServerComponentClient<Database>({ cookies });

  // First, get the city and bloco IDs
  const { data: city } = await supabase
    .from("cities")
    .select("id, name, slug, state")
    .eq("slug", citySlug)
    .single();

  if (!city) {
    console.log("City not found:", citySlug);
    return null;
  }

  const { data: bloco } = await supabase
    .from("blocos")
    .select(
      "id, name, slug, short_description_pt, short_description_en, short_description_fr, short_description_es, image_url, instagram_url, facebook_url, youtube_channel_url, spotify_playlist_url"
    )
    .eq("slug", blocoSlug)
    .single();

  if (!bloco) {
    console.log("Bloco not found:", blocoSlug);
    return null;
  }

  // Now query the event
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("city_id", city.id)
    .eq("bloco_id", bloco.id)
    .eq("event_type", eventType)
    .gte("start_datetime", `${date}T00:00:00`)
    .lte("start_datetime", `${date}T23:59:59`)
    .single();

  if (error || !event) {
    console.log("Event not found:", error?.message || "No event found");
    return null;
  }

  // Combine the data
  return {
    ...event,
    bloco,
    city,
  } as EventWithRelations;
}

async function getRelatedEvents(
  eventId: string,
  cityId: string,
  blocoId: string,
  eventType: string
): Promise<EventWithRelations[]> {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
      *,
      bloco:bloco_id(
        id,
        name,
        slug,
        short_description_pt,
        image_url
      ),
      city:city_id(
        id,
        name,
        slug,
        state
      )
    `
    )
    .neq("id", eventId)
    .or(
      `city_id.eq.${cityId},bloco_id.eq.${blocoId},event_type.eq.${eventType}`
    )
    .eq("is_draft", false)
    .gte("start_datetime", new Date().toISOString())
    .order("start_datetime", { ascending: true })
    .limit(6);

  if (error) {
    return [];
  }

  return (events || []) as EventWithRelations[];
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, city, date, eventType, blocoSlug } = resolvedParams;

  // Parse the URL to get the actual event type
  const urlPath = `/${locale}/${city}/eventos/${date}/${eventType}/${blocoSlug}`;
  const parsedUrl = parseEventURL(urlPath);

  if (!parsedUrl) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  const event = await getEvent(
    parsedUrl.city,
    parsedUrl.date,
    parsedUrl.eventType,
    parsedUrl.blocoSlug
  );

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  const localizedEventType = getLocalizedEventType(event.event_type, locale);
  const eventDate = new Date(event.start_datetime).toLocaleDateString(
    locale === "pt" ? "pt-BR" : locale,
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  const title = `${event.bloco.name} - ${localizedEventType} | ${event.city.name}`;
  const description =
    event.description_pt ||
    event.title ||
    `${localizedEventType} do ${event.bloco.name} em ${event.city.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: event.bloco.image_url ? [event.bloco.image_url] : [],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.bloco.image_url ? [event.bloco.image_url] : [],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  const { locale, city, date, eventType, blocoSlug } = resolvedParams;

  // Parse the URL to get the actual event type
  const urlPath = `/${locale}/${city}/eventos/${date}/${eventType}/${blocoSlug}`;
  const parsedUrl = parseEventURL(urlPath);

  if (!parsedUrl) {
    notFound();
  }

  const event = await getEvent(
    parsedUrl.city,
    parsedUrl.date,
    parsedUrl.eventType,
    parsedUrl.blocoSlug
  );

  if (!event) {
    notFound();
  }

  const relatedEvents = await getRelatedEvents(
    event.id,
    event.city.id,
    event.bloco.id,
    event.event_type
  );

  // Get localized content
  const getDescription = () => {
    switch (locale) {
      case "en":
        return event.description_en || event.description_pt || event.title;
      case "fr":
        return event.description_fr || event.description_pt || event.title;
      case "es":
        return event.description_es || event.description_pt || event.title;
      default:
        return event.description_pt || event.title;
    }
  };

  // Format date and time
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    const dateStr = date.toLocaleDateString(
      locale === "pt" ? "pt-BR" : locale,
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {event.bloco.image_url ? (
          <Image
            src={event.bloco.image_url}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Users className="w-24 h-24 text-white opacity-80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="secondary"
                  className={`${getEventTypeColor(
                    event.event_type
                  )} font-medium text-sm`}
                >
                  {getEventTypeLabel(event.event_type)}
                </Badge>
                {event.event_status !== "scheduled" && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    {locale === "pt" ? "Não confirmado" : "Not confirmed"}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {event.title}
              </h1>

              <div className="flex items-center gap-6 text-white text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{timeStr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "pt" ? "Sobre o Evento" : "About the Event"}
                </h2>

                {getDescription() && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {getDescription()}
                  </p>
                )}

                {/* Location */}
                {(event.location_name || event.address) && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      {locale === "pt" ? "Local" : "Location"}
                    </h3>
                    <div className="text-gray-700">
                      {event.location_name && (
                        <div className="font-medium text-lg">
                          {event.location_name}
                        </div>
                      )}
                      {event.address && (
                        <div className="text-gray-600">{event.address}</div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {event.city.name}, {event.city.state}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bloco Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "pt" ? "Sobre o Bloco" : "About the Bloco"}
                </h2>

                <Link
                  href={`/${locale}/${event.city.slug}/blocos/${event.bloco.slug}`}
                  className="text-green-600 hover:text-green-700 font-semibold text-xl mb-3 block"
                >
                  {event.bloco.name}
                </Link>

                {event.bloco.short_description_pt && (
                  <p className="text-gray-700 mb-4">
                    {event.bloco.short_description_pt}
                  </p>
                )}

                {event.bloco.short_description_en && (
                  <p className="text-gray-700 leading-relaxed">
                    {event.bloco.short_description_en}
                  </p>
                )}

                {event.bloco.short_description_fr && (
                  <p className="text-gray-700 leading-relaxed">
                    {event.bloco.short_description_fr}
                  </p>
                )}

                {event.bloco.short_description_es && (
                  <p className="text-gray-700 leading-relaxed">
                    {event.bloco.short_description_es}
                  </p>
                )}

                {/* Social Links */}
                {(event.bloco.instagram_url ||
                  event.bloco.facebook_url ||
                  event.bloco.youtube_channel_url) && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold mb-3">
                      {locale === "pt" ? "Links" : "Links"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {event.bloco.instagram_url && (
                        <Link
                          href={event.bloco.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Instagram
                        </Link>
                      )}
                      {event.bloco.facebook_url && (
                        <Link
                          href={event.bloco.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Facebook
                        </Link>
                      )}
                      {event.bloco.youtube_channel_url && (
                        <Link
                          href={event.bloco.youtube_channel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          YouTube
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Heart className="w-4 h-4 mr-2" />
                    {locale === "pt" ? "Salvar Evento" : "Save Event"}
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    {locale === "pt" ? "Compartilhar" : "Share"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  {locale === "pt"
                    ? "Informações do Evento"
                    : "Event Information"}
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">
                      {locale === "pt" ? "Tipo" : "Type"}
                    </div>
                    <div className="text-gray-600">{localizedEventType}</div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900">
                      {locale === "pt" ? "Data" : "Date"}
                    </div>
                    <div className="text-gray-600">{dateStr}</div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900">
                      {locale === "pt" ? "Horário" : "Time"}
                    </div>
                    <div className="text-gray-600">{timeStr}</div>
                  </div>

                  {event.end_datetime && (
                    <div>
                      <div className="font-medium text-gray-900">
                        {locale === "pt" ? "Término" : "End Time"}
                      </div>
                      <div className="text-gray-600">
                        {new Date(event.end_datetime).toLocaleTimeString(
                          locale === "pt" ? "pt-BR" : locale,
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="font-medium text-gray-900">
                      {locale === "pt" ? "Cidade" : "City"}
                    </div>
                    <div className="text-gray-600">
                      {event.city.name}, {event.city.state}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900">
                      {locale === "pt" ? "Status" : "Status"}
                    </div>
                    <div className="text-gray-600">
                      {event.event_status === "scheduled"
                        ? locale === "pt"
                          ? "Confirmado"
                          : "Confirmed"
                        : locale === "pt"
                        ? "Não confirmado"
                        : "Not confirmed"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
