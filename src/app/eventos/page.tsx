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
  searchParams: Promise<{
    city?: string;
    bloco?: string;
    date?: string;
    eventType?: EventType;
    view?: "calendar" | "map";
    carnaval2025?: string;
  }>;
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
    .eq("is_draft", false)
    .order("start_datetime", { ascending: true });

  // Apply filters
  if (filters.city) {
    const { data: cityData } = await supabase
      .from("cities")
      .select("id")
      .eq("slug", filters.city)
      .single();

    if (cityData?.id) {
      query = query.eq("city_id", cityData.id);
    }
  }

  if (filters.bloco) {
    const { data: blocoData } = await supabase
      .from("blocos")
      .select("id")
      .eq("slug", filters.bloco)
      .single();

    if (blocoData?.id) {
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

  return (events || []) as any;
}

async function getCities() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: cities, error } = await supabase
    .from("cities")
    .select("id, name, slug, state")
    .eq("is_hidden", false)
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
    .eq("is_draft", false)
    .order("name")
    .limit(50);

  if (error) {
    console.error("Blocos fetch error:", error);
    return [];
  }

  return blocos || [];
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Eventos de Carnaval | Ministério do Bloco";
  const description =
    "Descubra todos os eventos de carnaval do Brasil. Ensaios, desfiles, festas e oficinas dos melhores blocos em um só lugar.";

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

export default async function EventosPage({ searchParams }: EventsPageProps) {
  const locale = "pt"; // Default locale for this route
  const resolvedSearchParams = await searchParams;
  const {
    city,
    bloco,
    date,
    eventType,
    view = "calendar",
    carnaval2025,
  } = resolvedSearchParams;

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
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Eventos de Carnaval
          </h1>

          {/* Filters */}
          <div className="mb-4">
            <Suspense
              fallback={
                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                  <div className="w-full sm:w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full sm:w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full sm:w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full sm:w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              }
            >
              <EventsFilters cities={cities} blocos={blocos} locale={locale} />
            </Suspense>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-gray-600">
            <span>{events.length} eventos encontrados</span>
            {city && (
              <span>em {cities.find((c) => c.slug === city)?.name}</span>
            )}
            {eventType && (
              <span>tipo: {getLocalizedEventType(eventType, locale)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 lg:py-6">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Calendar/Events List */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden order-1 lg:order-none">
            <div className="p-3 lg:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                  Próximos Eventos
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
                    <Calendar className="w-4 h-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Calendário</span>
                    <span className="sm:hidden">Cal</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto h-[50vh] lg:h-[calc(100vh-280px)]">
              <Suspense
                fallback={
                  <div className="p-3 lg:p-4">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded"></div>
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

          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden order-2 lg:order-none">
            <div className="p-3 lg:p-4 border-b border-gray-200">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                Mapa de Eventos
              </h2>
            </div>

            <div className="h-[50vh] lg:h-[calc(100vh-280px)]">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 lg:mb-4" />
                      <p className="text-sm lg:text-base text-gray-600">
                        Carregando mapa...
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
