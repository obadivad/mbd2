# **API Documentation (Updated for New Schema)**
## **Ministério do Bloco - API Reference with Correct Database Structure**

---

## **1. API Overview**

### **🌐 Base Information**
```
Base URL: https://ministeriodobloco.com/api
Version: v1
Authentication: Bearer token (Supabase JWT)
Content-Type: application/json
Rate Limiting: 100 requests/minute per user
```

---

## **2. Blocos API (Updated for New Schema)**

### **🎭 GET /api/blocos**
**Retrieve blocos with filtering and pagination**

#### **Response (Updated for Separate Columns)**
```typescript
interface BlocosResponse {
  data: Bloco[];
  pagination: PaginationInfo;
  filters: FilterOptions;
}

interface Bloco {
  id: string;
  name: string;
  slug: string;
  
  // 🆕 Multilingual content (separate columns, not JSONB)
  shortDescriptionPt: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionFr: string | null;
  shortDescriptionEs: string | null;
  
  longDescriptionPt: string | null;
  longDescriptionEn: string | null;
  longDescriptionFr: string | null;
  longDescriptionEs: string | null;
  
  // Media URLs
  imageUrl: string | null;
  coverImageUrl: string | null;
  mediaUrls: string[];
  
  // Location
  primaryCity: {
    id: string;
    name: string;
    slug: string;
  } | null;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  
  // 🆕 Social media links (separate columns, not JSONB)
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  youtubeChannelUrl: string | null;
  
  // 🆕 Music links (separate columns, not JSONB)
  spotifyProfileUrl: string | null;
  spotifyPlaylistUrl: string | null;
  deezerUrl: string | null;
  soundcloudUrl: string | null;
  bandcampUrl: string | null;
  
  // Stats & metadata
  followersCount: number;
  avgParticipants: number | null;
  foundedYear: number | null;
  
  // Status flags
  isDraft: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  
  // Associations
  genres: Genre[];
  types: BlocoType[];
  cities: City[];  // All cities where bloco performs
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

#### **Example Response (Updated)**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Cordão da Bola Preta",
      "slug": "cordao-da-bola-preta",
      "shortDescriptionPt": "O bloco mais tradicional do Rio de Janeiro",
      "shortDescriptionEn": "Rio's most traditional carnival bloco",
      "shortDescriptionFr": "Le bloc le plus traditionnel de Rio de Janeiro",
      "shortDescriptionEs": "El bloque más tradicional de Río de Janeiro",
      "longDescriptionPt": "Fundado em 1918, o Cordão da Bola Preta é um dos blocos mais tradicionais...",
      "longDescriptionEn": "Founded in 1918, Cordão da Bola Preta is one of Rio's most traditional blocos...",
      "longDescriptionFr": "Fondé en 1918, Cordão da Bola Preta est l'un des blocs les plus traditionnels...",
      "longDescriptionEs": "Fundado en 1918, Cordão da Bola Preta es uno de los bloques más tradicionales...",
      "imageUrl": "https://storage.com/bloco-123.jpg",
      "coverImageUrl": "https://storage.com/cover-123.jpg",
      "mediaUrls": [
        "https://storage.com/media1.jpg",
        "https://storage.com/media2.jpg"
      ],
      "primaryCity": {
        "id": "city-rio",
        "name": "Rio de Janeiro",
        "slug": "rio-de-janeiro"
      },
      "coordinates": {
        "lat": -22.9068,
        "lng": -43.1729
      },
      "facebookUrl": "https://facebook.com/cordaobolapreta",
      "instagramUrl": "https://instagram.com/cordaobolapreta",
      "twitterUrl": null,
      "tiktokUrl": "https://tiktok.com/@cordaobolapreta",
      "youtubeChannelUrl": "https://youtube.com/c/cordaobolapreta",
      "spotifyProfileUrl": "https://open.spotify.com/artist/123",
      "spotifyPlaylistUrl": "https://open.spotify.com/playlist/456",
      "deezerUrl": "https://deezer.com/artist/789",
      "soundcloudUrl": null,
      "bandcampUrl": null,
      "followersCount": 15420,
      "avgParticipants": 50000,
      "foundedYear": 1918,
      "isDraft": false,
      "isFeatured": true,
      "isVerified": true,
      "genres": [
        {
          "id": "genre-samba",
          "name": "Samba",
          "slug": "samba"
        }
      ],
      "types": [
        {
          "id": "type-traditional",
          "name": "Traditional",
          "slug": "traditional"
        }
      ],
      "cities": [
        {
          "id": "city-rio",
          "name": "Rio de Janeiro",
          "slug": "rio-de-janeiro",
          "isPrimary": true
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## **3. Events API (Updated for New Schema)**

### **📅 GET /api/events**
**Retrieve events with filtering and pagination**

#### **Response (Updated for New Schema)**
```typescript
interface EventsResponse {
  data: Event[];
  pagination: PaginationInfo;
  filters: EventFilters;
}

interface Event {
  id: string;
  title: string;
  
  // 🆕 Multilingual descriptions (separate columns)
  descriptionPt: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  descriptionEs: string | null;
  
  // Event classification
  eventType: 'parade' | 'rehearsal' | 'performance' | 'workshop' | 'party' | 'meetup' | 'competition' | 'other';
  eventStatus: 'scheduled' | 'confirmed' | 'cancelled' | 'postponed' | 'completed';
  
  // Date & time
  startDatetime: string;      // ISO 8601
  endDatetime: string | null;
  allDay: boolean;
  
  // Location details
  city: {
    id: string;
    name: string;
    slug: string;
  };
  locationName: string | null;
  address: string | null;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  
  // Parade-specific fields
  concentrationLocation: string | null;
  concentrationCoordinates: {
    lat: number;
    lng: number;
  } | null;
  concentrationTime: string | null;  // ISO 8601
  dispersalLocation: string | null;
  dispersalCoordinates: {
    lat: number;
    lng: number;
  } | null;
  dispersalTime: string | null;      // ISO 8601
  
  // Associated bloco (with separate URL columns)
  bloco: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    // Social links available at bloco level
    instagramUrl: string | null;
    facebookUrl: string | null;
    youtubeChannelUrl: string | null;
  };
  
  // Media & external links
  bannerUrl: string | null;
  externalUrl: string | null;
  externalUrlText: string | null;
  
  // Event metadata
  expectedParticipants: number | null;
  ticketRequired: boolean;
  ticketPrice: number | null;  // Decimal as string in JSON
  
  // Status flags
  isDraft: boolean;
  isFeatured: boolean;
  
  // 🆕 URL structure for new event URLs
  urls: {
    detail: string;          // /pt/rio-de-janeiro/eventos/2025-02-15/desfile/cordao-da-bola-preta
    calendar: {
      google: string;        // Google Calendar add URL
      ical: string;         // iCal download URL
    };
    eventTypeListing: string; // /pt/rio-de-janeiro/eventos/2025-02-15/desfile
    dateListing: string;      // /pt/rio-de-janeiro/eventos/2025-02-15
  };
  
  // User context (if authenticated)
  userContext?: {
    isSaved: boolean;
    isAttending: boolean;
  };
  
  // Stats
  stats: {
    savedCount: number;
    attendingCount: number;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### **📅 GET /api/events/by-city-date-type/{citySlug}/{date}/{type}**
**Get events by URL components (matching new URL structure)**

#### **Path Parameters**
```typescript
interface EventsByURLParams {
  citySlug: string;           // 'rio-de-janeiro'
  date: string;               // 'YYYY-MM-DD' format
  type: string;               // Localized type: 'desfile', 'parade', 'ensaio', etc.
}
```

#### **Query Parameters**
```typescript
interface URLEventsQuery {
  locale?: 'pt' | 'en' | 'fr' | 'es';  // Default: 'pt'
  limit?: number;                       // Default: 50
  page?: number;                        // Default: 1
}
```

#### **Response**
```typescript
interface EventsByURLResponse {
  data: Event[];
  metadata: {
    city: {
      id: string;
      name: string;
      slug: string;
      // City descriptions in all languages
      descriptionPt: string | null;
      descriptionEn: string | null;
      descriptionFr: string | null;
      descriptionEs: string | null;
    };
    date: string;               // YYYY-MM-DD
    eventType: string;          // Original type ('parade')
    localizedEventType: string; // Localized type ('desfile')
    totalEvents: number;
    
    // Navigation helpers
    relatedDates: {
      date: string;
      eventCount: number;
      url: string;              // URL to that date's events
    }[];
    relatedTypes: {
      type: string;
      localizedType: string;
      eventCount: number;
      url: string;              // URL to that type's events on same date
    }[];
    
    // Breadcrumb data
    breadcrumbs: {
      text: string;
      url: string;
    }[];
  };
  pagination: PaginationInfo;
}
```

#### **Example Response**
```json
{
  "data": [
    {
      "id": "event-123",
      "title": "Desfile do Cordão da Bola Preta",
      "descriptionPt": "O tradicional desfile do bloco mais antigo do Rio",
      "descriptionEn": "The traditional parade of Rio's oldest bloco",
      "descriptionFr": "Le défilé traditionnel du plus ancien bloc de Rio",
      "descriptionEs": "El desfile tradicional del bloque más antiguo de Río",
      "eventType": "parade",
      "eventStatus": "confirmed",
      "startDatetime": "2025-02-15T14:00:00-03:00",
      "endDatetime": "2025-02-15T18:00:00-03:00",
      "allDay": false,
      "city": {
        "id": "city-rio",
        "name": "Rio de Janeiro",
        "slug": "rio-de-janeiro"
      },
      "locationName": "Rua 13 de Maio",
      "address": "Rua 13 de Maio, Centro, Rio de Janeiro",
      "coordinates": {
        "lat": -22.9068,
        "lng": -43.1729
      },
      "concentrationLocation": "Rua 13 de Maio, 13",
      "concentrationCoordinates": {
        "lat": -22.9068,
        "lng": -43.1729
      },
      "concentrationTime": "2025-02-15T13:00:00-03:00",
      "dispersalLocation": "Cinelândia",
      "dispersalCoordinates": {
        "lat": -22.9085,
        "lng": -43.1756
      },
      "dispersalTime": "2025-02-15T18:00:00-03:00",
      "bloco": {
        "id": "bloco-123",
        "name": "Cordão da Bola Preta",
        "slug": "cordao-da-bola-preta",
        "imageUrl": "https://storage.com/bloco-123.jpg",
        "instagramUrl": "https://instagram.com/cordaobolapreta",
        "facebookUrl": "https://facebook.com/cordaobolapreta",
        "youtubeChannelUrl": "https://youtube.com/c/cordaobolapreta"
      },
      "bannerUrl": "https://storage.com/event-banner.jpg",
      "externalUrl": null,
      "externalUrlText": null,
      "expectedParticipants": 50000,
      "ticketRequired": false,
      "ticketPrice": null,
      "isDraft": false,
      "isFeatured": true,
      "urls": {
        "detail": "/pt/rio-de-janeiro/eventos/2025-02-15/desfile/cordao-da-bola-preta",
        "calendar": {
          "google": "https://calendar.google.com/calendar/render?action=TEMPLATE&...",
          "ical": "/api/external/calendar/ical?events=event-123"
        },
        "eventTypeListing": "/pt/rio-de-janeiro/eventos/2025-02-15/desfile",
        "dateListing": "/pt/rio-de-janeiro/eventos/2025-02-15"
      },
      "stats": {
        "savedCount": 1250,
        "attendingCount": 890
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-02-01T14:45:00Z"
    }
  ],
  "metadata": {
    "city": {
      "id": "city-rio",
      "name": "Rio de Janeiro",
      "slug": "rio-de-janeiro",
      "descriptionPt": "A cidade maravilhosa e capital do carnaval brasileiro",
      "descriptionEn": "The marvelous city and capital of Brazilian carnival",
      "descriptionFr": "La ville merveilleuse et capitale du carnaval brésilien",
      "descriptionEs": "La ciudad maravillosa y capital del carnaval brasileño"
    },
    "date": "2025-02-15",
    "eventType": "parade",
    "localizedEventType": "desfile",
    "totalEvents": 15,
    "relatedDates": [
      {
        "date": "2025-02-14",
        "eventCount": 12,
        "url": "/pt/rio-de-janeiro/eventos/2025-02-14/desfile"
      },
      {
        "date": "2025-02-16",
        "eventCount": 18,
        "url": "/pt/rio-de-janeiro/eventos/2025-02-16/desfile"
      }
    ],
    "relatedTypes": [
      {
        "type": "rehearsal",
        "localizedType": "ensaio",
        "eventCount": 5,
        "url": "/pt/rio-de-janeiro/eventos/2025-02-15/ensaio"
      },
      {
        "type": "party",
        "localizedType": "festa",
        "eventCount": 3,
        "url": "/pt/rio-de-janeiro/eventos/2025-02-15/festa"
      }
    ],
    "breadcrumbs": [
      {
        "text": "Rio de Janeiro",
        "url": "/pt/rio-de-janeiro"
      },
      {
        "text": "Eventos",
        "url": "/pt/rio-de-janeiro/eventos"
      },
      {
        "text": "15 de Fevereiro",
        "url": "/pt/rio-de-janeiro/eventos/2025-02-15"
      },
      {
        "text": "Desfiles",
        "url": "/pt/rio-de-janeiro/eventos/2025-02-15/desfile"
      }
    ]
  }
}
```

---

## **4. Cities API (Updated)**

### **🏙️ GET /api/cities/{slug}**
**Get detailed city information**

#### **Response (Updated for New Schema)**
```typescript
interface CityDetail {
  id: string;
  name: string;
  slug: string;
  state: string;
  stateCode: string;
  country: string;
  
  // 🆕 Multilingual descriptions (separate columns)
  descriptionPt: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  descriptionEs: string | null;
  
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
  
  carnivalSeason: {
    start: string;      // YYYY-MM-DD
    end: string;        // YYYY-MM-DD
  } | null;
  
  bannerUrl: string | null;
  isFeatured: boolean;
  
  // Enhanced city data
  stats: {
    blocoCount: number;
    eventCount: number;
    upcomingEventCount: number;
  };
  
  featuredBlocos: Bloco[];      // Top blocos in city
  upcomingEvents: Event[];      // Next events in city
  popularGenres: Genre[];       // Most popular music genres
  
  createdAt: string;
}
```

---

## **5. User API (Updated)**

### **👤 PUT /api/blocos/{id}**
**Update bloco information (for bloco organizers)**

#### **Request Body (Updated for New Schema)**
```typescript
interface UpdateBlocoRequest {
  name?: string;
  
  // Multilingual content updates
  shortDescriptionPt?: string;
  shortDescriptionEn?: string;
  shortDescriptionFr?: string;
  shortDescriptionEs?: string;
  
  longDescriptionPt?: string;
  longDescriptionEn?: string;
  longDescriptionFr?: string;
  longDescriptionEs?: string;
  
  // Social media links (separate fields)
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeChannelUrl?: string | null;
  
  // Music links (separate fields)
  spotifyProfileUrl?: string | null;
  spotifyPlaylistUrl?: string | null;
  deezerUrl?: string | null;
  soundcloudUrl?: string | null;
  bandcampUrl?: string | null;
  
  // Other fields
  imageUrl?: string;
  coverImageUrl?: string;
  mediaUrls?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  avgParticipants?: number;
  foundedYear?: number;
}
```

### **📅 POST /api/events**
**Create new event (for bloco organizers)**

#### **Request Body (Updated for New Schema)**
```typescript
interface CreateEventRequest {
  title: string;
  
  // Multilingual descriptions
  descriptionPt?: string;
  descriptionEn?: string;
  descriptionFr?: string;
  descriptionEs?: string;
  
  eventType: 'parade' | 'rehearsal' | 'performance' | 'workshop' | 'party' | 'meetup' | 'competition' | 'other';
  
  // Date & time
  startDatetime: string;      // ISO 8601
  endDatetime?: string;       // ISO 8601
  allDay?: boolean;
  
  // Location
  cityId: string;
  locationName?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Parade-specific (optional)
  concentrationLocation?: string;
  concentrationCoordinates?: {
    lat: number;
    lng: number;
  };
  concentrationTime?: string;  // ISO 8601
  dispersalLocation?: string;
  dispersalCoordinates?: {
    lat: number;
    lng: number;
  };
  dispersalTime?: string;      // ISO 8601
  
  // Media & links
  bannerUrl?: string;
  externalUrl?: string;
  externalUrlText?: string;
  
  // Metadata
  expectedParticipants?: number;
  ticketRequired?: boolean;
  ticketPrice?: number;
}
```

---

## **6. Database Query Utilities (Internal APIs)**

### **🔍 GET /api/internal/events/url-lookup**
**Internal API for URL-based event lookups (used by frontend routing)**

#### **Query Parameters**
```typescript
interface URLLookupQuery {
  citySlug: string;
  date: string;              // YYYY-MM-DD
  eventType: string;         // Localized type ('desfile', 'parade', etc.)
  blocoSlug?: string;        // Optional for specific event
  locale: 'pt' | 'en' | 'fr' | 'es';
}
```

#### **Response**
```typescript
interface URLLookupResponse {
  // If blocoSlug provided - single event
  event?: Event;
  
  // If no blocoSlug - list of events
  events?: Event[];
  
  // Metadata for building pages
  metadata: {
    city: City;
    date: string;
    eventType: string;
    localizedEventType: string;
    canonicalUrl: string;
    alternateUrls: {
      pt: string;
      en: string;
      fr: string;
      es: string;
    };
  };
}
```

---

This updated API documentation now correctly reflects our new database schema with:

✅ **Separate columns for social links** (not JSONB objects)
✅ **Separate columns for music links** (not JSONB objects)  
✅ **Separate columns for multilingual content** (pt, en, fr, es)
✅ **Enhanced event URL structure** matching our new routing
✅ **Proper database field mapping** to API responses
✅ **Updated request/response examples** using the correct structure

The API now perfectly aligns with the schema we defined!
