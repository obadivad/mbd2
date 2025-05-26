import type { Database } from "@/types/database";

type EventType = Database["public"]["Tables"]["events"]["Row"]["event_type"];

interface EventURLParams {
  locale: string;
  city: string;
  date: string; // YYYY-MM-DD format
  eventType: EventType;
  blocoSlug: string;
}

interface Event {
  id: string;
  start_datetime: string;
  event_type: EventType;
  bloco: {
    slug: string;
  };
  city: {
    slug: string;
  };
}

/**
 * Event type localization mapping for different languages
 */
const EVENT_TYPE_LOCALIZATION = {
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
} as const;

/**
 * Generates localized event URL following the pattern:
 * /[locale]/[city]/eventos/[date]/[event-type]/[bloco-slug]
 *
 * All languages including Portuguese use the locale prefix for consistency
 */
export function generateEventURL({
  locale,
  city,
  date,
  eventType,
  blocoSlug,
}: EventURLParams): string {
  const eventTypesMap =
    EVENT_TYPE_LOCALIZATION[locale as keyof typeof EVENT_TYPE_LOCALIZATION] ||
    EVENT_TYPE_LOCALIZATION.pt;

  const localizedType = eventTypesMap[eventType];

  // Always include the locale prefix for consistency
  return `/${locale}/${city}/eventos/${date}/${localizedType}/${blocoSlug}`;
}

/**
 * Generates event URL from event object
 */
export function generateEventURLFromEvent(
  event: Event,
  locale: string = "pt"
): string {
  const date = event.start_datetime.split("T")[0]; // Extract YYYY-MM-DD

  return generateEventURL({
    locale,
    city: event.city.slug,
    date,
    eventType: event.event_type,
    blocoSlug: event.bloco.slug,
  });
}

/**
 * Parses event URL parameters back to structured data
 */
export function parseEventURL(pathname: string): {
  locale: string;
  city: string;
  date: string;
  eventType: EventType;
  blocoSlug: string;
} | null {
  // Remove leading slash and split
  const segments = pathname.replace(/^\//, "").split("/");

  let locale = "pt";
  let startIndex = 0;

  // Check if first segment is a locale
  if (["pt", "en", "fr", "es"].includes(segments[0])) {
    locale = segments[0];
    startIndex = 1;
  }

  // Expected pattern: [city]/eventos/[date]/[event-type]/[bloco-slug]
  if (
    segments.length < startIndex + 5 ||
    segments[startIndex + 1] !== "eventos"
  ) {
    return null;
  }

  const city = segments[startIndex];
  const date = segments[startIndex + 2];
  const localizedEventType = segments[startIndex + 3];
  const blocoSlug = segments[startIndex + 4];

  // Reverse lookup for event type
  const eventTypesMap =
    EVENT_TYPE_LOCALIZATION[locale as keyof typeof EVENT_TYPE_LOCALIZATION];
  const eventType = Object.entries(eventTypesMap).find(
    ([_key, localized]) => localized === localizedEventType
  )?.[0] as EventType;

  if (!eventType) {
    return null;
  }

  return {
    locale,
    city,
    date,
    eventType,
    blocoSlug,
  };
}

/**
 * Generates event listing URL for a specific date and city
 */
export function generateEventListingURL(
  city: string,
  date?: string,
  eventType?: EventType,
  locale: string = "pt"
): string {
  let url = `/${locale}/${city}/eventos`;

  if (date) {
    url += `/${date}`;

    if (eventType) {
      const eventTypesMap =
        EVENT_TYPE_LOCALIZATION[locale as keyof typeof EVENT_TYPE_LOCALIZATION];
      const localizedType = eventTypesMap[eventType];
      url += `/${localizedType}`;
    }
  }

  return url;
}

/**
 * Gets the localized event type name for display
 */
export function getLocalizedEventType(
  eventType: EventType,
  locale: string = "pt"
): string {
  const eventTypesMap =
    EVENT_TYPE_LOCALIZATION[locale as keyof typeof EVENT_TYPE_LOCALIZATION] ||
    EVENT_TYPE_LOCALIZATION.pt;

  return eventTypesMap[eventType];
}

/**
 * Gets all available event types for a locale
 */
export function getEventTypesForLocale(locale: string = "pt") {
  return (
    EVENT_TYPE_LOCALIZATION[locale as keyof typeof EVENT_TYPE_LOCALIZATION] ||
    EVENT_TYPE_LOCALIZATION.pt
  );
}
