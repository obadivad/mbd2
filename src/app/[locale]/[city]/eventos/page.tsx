import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Calendar, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/events/event-card";
import { getEventTypesForLocale } from "@/lib/events/url-generator";
import type { Database } from "@/types/database";

type EventType = Database["public"]["Tables"]["events"]["Row"]["event_type"];

interface EventsPageProps {
  params: {
    locale: string;
    city: string;
  };
  searchParams: {
    date?: string;
    eventType?: EventType;
    view?: "grid" | "list";
    upcoming?: string;
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
  };
  city: {
    id: string;
    name: string;
    slug: string;
    state: string;
    country: string;
  };
};

async function getCity(citySlug: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: city, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", citySlug)
    .eq("is_active", true)
    .single();

  if (error || !city) {
    return null;
  }

  return city;
}

async function getEvents(
  citySlug: string,
  filters: {
    date?: string;
    eventType?: EventType;
    upcoming?: boolean;
  }
): Promise<EventWithRelations[]> {
  const supabase = createServerComponentClient<Database>({ cookies });

  let query = supabase
    .from("events")
    .select(
      `
      *,
      bloco:bloco_id(
        id,
        name,
        slug,
        short_description_pt,
        short_description_en,
        short_description_fr,
        short_description_es,
        image_url
      ),
      city:city_id(
        id,
        name,
        slug,
        state,
        country
      )
    `
    )
    .eq("city.slug", citySlug)
    .eq("is_cancelled", false)
    .order("start_datetime", { ascending: true });

  // Apply filters
  if (filters.date) {
    const startOfDay = `${filters.date}T00:00:00`;
    const endOfDay = `${filters.date}T23:59:59`;
    query = query
      .gte("start_datetime", startOfDay)
      .lte("start_datetime", endOfDay);
  }

  if (filters.eventType) {
    query = query.eq("event_type", filters.eventType);
  }

  if (filters.upcoming) {
    const now = new Date().toISOString();
    query = query.gte("start_datetime", now);
  }

  const { data: events, error } = await query.limit(50);

  if (error) {
    console.error("Events fetch error:", error);
    return [];
  }

  return (events || []) as EventWithRelations[];
}

async function getEventStats(citySlug: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Get total events count
  const { count: totalEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("city.slug", citySlug)
    .eq("is_cancelled", false);

  // Get upcoming events count
  const now = new Date().toISOString();
  const { count: upcomingEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("city.slug", citySlug)
    .eq("is_cancelled", false)
    .gte("start_datetime", now);

  // Get events by type
  const { data: eventsByType } = await supabase
    .from("events")
    .select("event_type")
    .eq("city.slug", citySlug)
    .eq("is_cancelled", false);

  const typeStats: Record<EventType, number> = {
    parade: 0,
    rehearsal: 0,
    party: 0,
    workshop: 0,
  };

  eventsByType?.forEach((event) => {
    if (event.event_type in typeStats) {
      typeStats[event.event_type as EventType]++;
    }
  });

  return {
    total: totalEvents || 0,
    upcoming: upcomingEvents || 0,
    byType: typeStats,
  };
}

export async function generateMetadata({
  params,
}: EventsPageProps): Promise<Metadata> {
  const { locale, city } = params;

  const cityData = await getCity(city);

  if (!cityData) {
    return {
      title: "City Not Found",
      description: "The requested city could not be found.",
    };
  }

  const title =
    locale === "pt"
      ? `Eventos de Carnaval em ${cityData.name} | Ministério do Bloco`
      : `Carnival Events in ${cityData.name} | Ministério do Bloco`;

  const description =
    locale === "pt"
      ? `Descubra todos os eventos de carnaval em ${cityData.name}, ${cityData.state}. Desfiles, ensaios, festas e oficinas dos melhores blocos.`
      : `Discover all carnival events in ${cityData.name}, ${cityData.state}. Parades, rehearsals, parties and workshops from the best blocos.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function EventsPage({
  params,
  searchParams,
}: EventsPageProps) {
  const { locale, city } = params;
  const { date, eventType, view = "grid", upcoming } = searchParams;

  const cityData = await getCity(city);

  if (!cityData) {
    notFound();
  }

  const events = await getEvents(city, {
    date,
    eventType,
    upcoming: upcoming === "true",
  });

  const stats = await getEventStats(city);
  const eventTypes = getEventTypesForLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {locale === "pt"
                ? `Eventos de Carnaval em ${cityData.name}`
                : `Carnival Events in ${cityData.name}`}
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              {locale === "pt"
                ? `Descubra todos os eventos de carnaval em ${cityData.name}, ${cityData.state}. Desfiles, ensaios, festas e muito mais.`
                : `Discover all carnival events in ${cityData.name}, ${cityData.state}. Parades, rehearsals, parties and more.`}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    {locale === "pt" ? "Total de Eventos" : "Total Events"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.upcoming}
                  </div>
                  <div className="text-sm text-gray-600">
                    {locale === "pt" ? "Próximos" : "Upcoming"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.byType.parade || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {eventTypes.parade}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {stats.byType.party || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {eventTypes.party}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={upcoming === "true" ? "default" : "outline"}
                size="sm"
                className={
                  upcoming === "true" ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                <Calendar className="w-4 h-4 mr-2" />
                {locale === "pt" ? "Próximos" : "Upcoming"}
              </Button>

              {/* Event Type Filter */}
              <div className="flex gap-2">
                {Object.entries(eventTypes).map(([type, label]) => (
                  <Button
                    key={type}
                    variant={eventType === type ? "default" : "outline"}
                    size="sm"
                    className={
                      eventType === type
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                className={
                  view === "grid" ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                className={
                  view === "list" ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          {events.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {locale === "pt"
                    ? "Nenhum evento encontrado"
                    : "No events found"}
                </h3>
                <p className="text-gray-600">
                  {locale === "pt"
                    ? "Não há eventos que correspondam aos filtros selecionados."
                    : "There are no events matching the selected filters."}
                </p>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </div>
    </div>
  );
}
