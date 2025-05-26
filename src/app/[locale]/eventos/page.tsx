import { Metadata } from "next";
import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Calendar, MapPin, Filter, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventsCalendarView } from "@/components/events/events-calendar-view";
import { EventsMapView } from "@/components/events/events-map-view";
import { EventsFilters } from "@/components/events/events-filters";
import { getLocalizedEventType } from "@/lib/events/url-generator";
import type { Database } from "@/types/database";

type EventType = Database["public"]["Tables"]["events"]["Row"]["event_type"];

interface EventsPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    city?: string;
    bloco?: string;
    date?: string;
    eventType?: EventType;
    view?: "calendar" | "map";
    carnaval2025?: string;
  };
}

type EventWithRelations = Database["public"]["Tables"]["events"]["Row"] & {
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

async function getEvents(filters: {
  city?: string;
  bloco?: string;
  date?: string;
  eventType?: EventType;
  carnaval2025?: boolean;
}): Promise<EventWithRelations[]> {
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
    .eq("is_cancelled", false)
    .order("start_datetime", { ascending: true });

  // Apply filters
  if (filters.city) {
    const { data: cityData } = await supabase
      .from("cities")
      .select("id")
      .eq("slug", filters.city)
      .single();

    if (cityData) {
      query = query.eq("city_id", cityData.id);
    }
  }

  if (filters.bloco) {
    const { data: blocoData } = await supabase
      .from("blocos")
      .select("id")
      .eq("slug", filters.bloco)
      .single();

    if (blocoData) {
      query = query.eq("bloco_id", blocoData.id);
    }
  }

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

  // Get upcoming events for the next 3 months (or all if carnaval2025 is disabled)
  const now = new Date();
  if (filters.carnaval2025 !== false) {
    // Carnaval 2025 period (adjust dates as needed)
    const carnavalStart = new Date("2025-02-01");
    const carnavalEnd = new Date("2025-03-15");

    query = query
      .gte("start_datetime", carnavalStart.toISOString())
      .lte("start_datetime", carnavalEnd.toISOString());
  } else {
    // All upcoming events
    query = query.gte("start_datetime", now.toISOString());
  }

  query = query.limit(100);

  const { data: events, error } = await query;

  if (error) {
    console.error("Events fetch error:", error);
    return [];
  }

  return (events || []) as EventWithRelations[];
}

async function getCities() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: cities, error } = await supabase
    .from("cities")
    .select("id, name, slug, state")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Cities fetch error:", error);
    return [];
  }

  return cities || [];
}

async function getBlocos() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: blocos, error } = await supabase
    .from("blocos")
    .select("id, name, slug")
    .eq("is_active", true)
    .eq("is_draft", false)
    .order("name")
    .limit(50);

  if (error) {
    console.error("Blocos fetch error:", error);
    return [];
  }

  return blocos || [];
}

export async function generateMetadata({
  params,
}: EventsPageProps): Promise<Metadata> {
  const { locale } = params;

  const title =
    locale === "pt"
      ? "Eventos de Carnaval | Ministério do Bloco"
      : "Carnival Events | Ministério do Bloco";

  const description =
    locale === "pt"
      ? "Descubra todos os eventos de carnaval do Brasil. Ensaios, desfiles, festas e oficinas dos melhores blocos em um só lugar."
      : "Discover all carnival events in Brazil. Rehearsals, parades, parties and workshops from the best blocos in one place.";

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
  const { locale } = params;
  const {
    city,
    bloco,
    date,
    eventType,
    view = "calendar",
    carnaval2025,
  } = searchParams;

  const [events, cities, blocos] = await Promise.all([
    getEvents({
      city,
      bloco,
      date,
      eventType,
      carnaval2025: carnaval2025 !== "false",
    }),
    getCities(),
    getBlocos(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === "pt" ? "Eventos de Carnaval" : "Carnival Events"}
          </h1>

          {/* Filters */}
          <div className="mb-4">
            <Suspense
              fallback={
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              }
            >
              <EventsFilters cities={cities} blocos={blocos} locale={locale} />
            </Suspense>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>
              {events.length}{" "}
              {locale === "pt" ? "eventos encontrados" : "events found"}
            </span>
            {city && (
              <span>
                {locale === "pt" ? "em" : "in"}{" "}
                {cities.find((c) => c.slug === city)?.name}
              </span>
            )}
            {eventType && (
              <span>
                {locale === "pt" ? "tipo:" : "type:"}{" "}
                {getLocalizedEventType(eventType, locale)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Calendar/Events List */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {locale === "pt" ? "Próximos Eventos" : "Upcoming Events"}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={view === "calendar" ? "default" : "outline"}
                    size="sm"
                    className={
                      view === "calendar"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {locale === "pt" ? "Calendário" : "Calendar"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              <Suspense
                fallback={
                  <div className="p-4">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                <EventsCalendarView events={events} locale={locale} />
              </Suspense>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {locale === "pt" ? "Mapa de Eventos" : "Events Map"}
              </h2>
            </div>

            <div className="h-full">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {locale === "pt"
                          ? "Carregando mapa..."
                          : "Loading map..."}
                      </p>
                    </div>
                  </div>
                }
              >
                <EventsMapView events={events} locale={locale} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
