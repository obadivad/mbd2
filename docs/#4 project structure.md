# **Project Structure Document (Final Updated)**

## **Ministério do Bloco - Complete File Organization with Improved Event URLs**

---

## **1. Root Directory Structure**

```
ministeriodobloco/
├── 📁 .cursorrules                    # AI IDE guidance
├── 📁 .env.local                      # Environment variables
├── 📁 .env.example                    # Environment template
├── 📁 .eslintrc.json                  # Code linting rules
├── 📁 .gitignore                      # Git ignore rules
├── 📁 .prettierrc                     # Code formatting
├── 📁 components.json                 # Shadcn component config
├── 📁 next.config.js                  # Next.js configuration
├── 📁 package.json                    # Dependencies & scripts
├── 📁 tailwind.config.ts              # Tailwind CSS config
├── 📁 tsconfig.json                   # TypeScript config
├── 📁 README.md                       # Project documentation
├── 📁 middleware.ts                   # Next.js middleware (i18n)
└── 📁 src/                           # Source code
    ├── 📁 app/                       # Next.js App Router
    ├── 📁 components/                # Reusable components
    ├── 📁 lib/                       # Utilities & configs
    ├── 📁 hooks/                     # Custom React hooks
    ├── 📁 stores/                    # State management
    ├── 📁 types/                     # TypeScript definitions
    ├── 📁 styles/                    # Global styles
    └── 📁 constants/                 # App constants
```

---

## **2. App Router Structure (src/app/) - With Improved Event URLs**

### **Complete Routing Architecture**

```
src/app/
├── 📁 globals.css                     # Global Tailwind styles
├── 📁 layout.tsx                      # Root layout
├── 📁 page.tsx                        # 🏠 ROOT HOMEPAGE (redirects to /pt)
├── 📁 not-found.tsx                   # 404 page
├── 📁 sitemap.ts                      # Dynamic sitemap
├── 📁 robots.ts                       # SEO robots
├── 📁 manifest.ts                     # PWA manifest
├── 📁 api/                           # API routes
│   ├── 📁 auth/                      # Authentication
│   │   ├── 📁 callback/
│   │   │   └── 📁 route.ts           # OAuth callback
│   │   ├── 📁 login/
│   │   │   └── 📁 route.ts           # Login endpoint
│   │   └── 📁 logout/
│   │       └── 📁 route.ts           # Logout endpoint
│   ├── 📁 blocos/                    # Bloco APIs
│   │   ├── 📁 route.ts               # GET /api/blocos (list, search, filter)
│   │   ├── 📁 [id]/
│   │   │   ├── 📁 route.ts           # GET/PUT/DELETE /api/blocos/[id]
│   │   │   ├── 📁 events/
│   │   │   │   └── 📁 route.ts       # GET /api/blocos/[id]/events
│   │   │   ├── 📁 followers/
│   │   │   │   └── 📁 route.ts       # GET/POST /api/blocos/[id]/followers
│   │   │   └── 📁 media/
│   │   │       └── 📁 route.ts       # GET /api/blocos/[id]/media
│   │   ├── 📁 featured/
│   │   │   └── 📁 route.ts           # GET /api/blocos/featured
│   │   └── 📁 search/
│   │       └── 📁 route.ts           # POST /api/blocos/search
│   ├── 📁 events/                    # Event APIs
│   │   ├── 📁 route.ts               # GET /api/events (list, filter)
│   │   ├── 📁 [id]/
│   │   │   ├── 📁 route.ts           # GET/PUT/DELETE /api/events/[id]
│   │   │   └── 📁 attendees/
│   │   │       └── 📁 route.ts       # GET/POST /api/events/[id]/attendees
│   │   ├── 📁 by-date/
│   │   │   └── 📁 [date]/
│   │   │       └── 📁 route.ts       # GET /api/events/by-date/[date]
│   │   ├── 📁 by-type/
│   │   │   └── 📁 [type]/
│   │   │       └── 📁 route.ts       # GET /api/events/by-type/[type]
│   │   ├── 📁 by-city-date-type/
│   │   │   └── 📁 [citySlug]/
│   │   │       └── 📁 [date]/
│   │   │           └── 📁 [type]/
│   │   │               └── 📁 route.ts # GET events by city/date/type
│   │   ├── 📁 upcoming/
│   │   │   └── 📁 route.ts           # GET /api/events/upcoming
│   │   └── 📁 featured/
│   │       └── 📁 route.ts           # GET /api/events/featured
│   ├── 📁 cities/                    # City APIs
│   │   ├── 📁 route.ts               # GET /api/cities
│   │   ├── 📁 [slug]/
│   │   │   ├── 📁 route.ts           # GET /api/cities/[slug]
│   │   │   ├── 📁 blocos/
│   │   │   │   └── 📁 route.ts       # GET /api/cities/[slug]/blocos
│   │   │   └── 📁 events/
│   │   │       └── 📁 route.ts       # GET /api/cities/[slug]/events
│   │   └── 📁 trending/
│   │       └── 📁 route.ts           # GET /api/cities/trending
│   ├── 📁 users/                     # User APIs
│   │   ├── 📁 profile/
│   │   │   └── 📁 route.ts           # GET/PUT /api/users/profile
│   │   ├── 📁 agenda/
│   │   │   └── 📁 route.ts           # GET /api/users/agenda
│   │   ├── 📁 following/
│   │   │   └── 📁 route.ts           # GET/POST /api/users/following
│   │   ├── 📁 friends/
│   │   │   └── 📁 route.ts           # GET/POST /api/users/friends
│   │   └── 📁 preferences/
│   │       └── 📁 route.ts           # GET/PUT /api/users/preferences
│   ├── 📁 search/                    # Search APIs
│   │   ├── 📁 route.ts               # GET /api/search?q=query
│   │   ├── 📁 suggestions/
│   │   │   └── 📁 route.ts           # GET /api/search/suggestions
│   │   └── 📁 autocomplete/
│   │       └── 📁 route.ts           # GET /api/search/autocomplete
│   ├── 📁 notifications/             # Notification APIs
│   │   ├── 📁 route.ts               # GET/POST/PUT /api/notifications
│   │   ├── 📁 mark-read/
│   │   │   └── 📁 route.ts           # POST /api/notifications/mark-read
│   │   └── 📁 settings/
│   │       └── 📁 route.ts           # GET/PUT /api/notifications/settings
│   ├── 📁 location/                  # Location sharing APIs
│   │   ├── 📁 route.ts               # POST /api/location (update location)
│   │   ├── 📁 sessions/
│   │   │   └── 📁 route.ts           # GET/POST /api/location/sessions
│   │   └── 📁 friends/
│   │       └── 📁 route.ts           # GET /api/location/friends
│   ├── 📁 chat/                      # Chat APIs
│   │   ├── 📁 rooms/
│   │   │   ├── 📁 route.ts           # GET/POST /api/chat/rooms
│   │   │   └── 📁 [roomId]/
│   │   │       ├── 📁 route.ts       # GET /api/chat/rooms/[roomId]
│   │   │       └── 📁 messages/
│   │   │           └── 📁 route.ts   # GET/POST /api/chat/rooms/[roomId]/messages
│   │   └── 📁 participants/
│   │       └── 📁 route.ts           # GET/POST /api/chat/participants
│   ├── 📁 external/                  # External integrations
│   │   ├── 📁 calendar/              # Calendar export
│   │   │   ├── 📁 google/
│   │   │   │   └── 📁 route.ts       # POST /api/external/calendar/google
│   │   │   └── 📁 ical/
│   │   │       └── 📁 route.ts       # GET /api/external/calendar/ical
│   │   ├── 📁 social/               # Social media embeds
│   │   │   ├── 📁 instagram/
│   │   │   │   └── 📁 route.ts       # GET /api/external/social/instagram
│   │   │   ├── 📁 youtube/
│   │   │   │   └── 📁 route.ts       # GET /api/external/social/youtube
│   │   │   └── 📁 spotify/
│   │   │       └── 📁 route.ts       # GET /api/external/social/spotify
│   │   └── 📁 webhooks/             # External webhooks
│   │       ├── 📁 stripe/
│   │       │   └── 📁 route.ts       # POST /api/external/webhooks/stripe
│   │       └── 📁 supabase/
│   │           └── 📁 route.ts       # POST /api/external/webhooks/supabase
│   └── 📁 analytics/                 # Analytics APIs
│       ├── 📁 track/
│       │   └── 📁 route.ts           # POST /api/analytics/track
│       └── 📁 stats/
│           └── 📁 route.ts           # GET /api/analytics/stats
└── 📁 [locale]/                      # Internationalization routes
    ├── 📁 layout.tsx                 # Locale layout
    ├── 📁 page.tsx                   # 🏠 MAIN HOMEPAGE (/pt, /en, /fr, /es)
    ├── 📁 loading.tsx                # Loading UI
    ├── 📁 error.tsx                  # Error boundary
    ├── 📁 blocos/                    # Generic blocos (no city)
    │   ├── 📁 page.tsx               # All blocos listing
    │   ├── 📁 loading.tsx
    │   └── 📁 [slug]/
    │       ├── 📁 page.tsx           # Bloco detail (redirects to primary city)
    │       └── 📁 loading.tsx
    ├── 📁 events/                    # Generic events
    │   ├── 📁 page.tsx               # All events listing
    │   ├── 📁 loading.tsx
    │   ├── 📁 map/
    │   │   └── 📁 page.tsx           # Events map view
    │   └── 📁 [id]/
    │       ├── 📁 page.tsx           # Event detail
    │       └── 📁 loading.tsx
    ├── 📁 cities/                    # Cities listing
    │   ├── 📁 page.tsx               # All cities
    │   ├── 📁 loading.tsx
    │   └── 📁 compare/
    │       └── 📁 page.tsx           # City comparison
    ├── 📁 [city]/                    # 🎯 CITY-SPECIFIC ROUTES
    │   ├── 📁 page.tsx               # City carnival homepage
    │   ├── 📁 layout.tsx             # City-specific layout
    │   ├── 📁 loading.tsx
    │   ├── 📁 not-found.tsx
    │   ├── 📁 blocos/                # 🏆 MAIN BLOCO ROUTES
    │   │   ├── 📁 page.tsx           # City blocos listing
    │   │   ├── 📁 loading.tsx
    │   │   ├── 📁 map/
    │   │   │   └── 📁 page.tsx       # City blocos map
    │   │   └── 📁 [slug]/            # 🎭 BLOCO DETAIL PAGES
    │   │       ├── 📁 page.tsx       # Main bloco page
    │   │       ├── 📁 loading.tsx
    │   │       ├── 📁 events/
    │   │       │   ├── 📁 page.tsx   # Bloco events in city
    │   │       │   └── 📁 loading.tsx
    │   │       ├── 📁 media/
    │   │       │   ├── 📁 page.tsx   # Bloco media gallery
    │   │       │   └── 📁 loading.tsx
    │   │       └── 📁 followers/
    │   │           ├── 📁 page.tsx   # Bloco followers
    │   │           └── 📁 loading.tsx
    │   ├── 📁 eventos/                # 🎪 IMPROVED EVENT ROUTES (PT)
    │   │   ├── 📁 page.tsx           # All city events
    │   │   ├── 📁 loading.tsx
    │   │   ├── 📁 calendario/        # Calendar view
    │   │   │   ├── 📁 page.tsx
    │   │   │   └── 📁 loading.tsx
    │   │   ├── 📁 mapa/              # Map view
    │   │   │   ├── 📁 page.tsx
    │   │   │   └── 📁 loading.tsx
    │   │   └── 📁 [date]/            # 📅 DATE-SPECIFIC EVENTS
    │   │       ├── 📁 page.tsx       # All events on this date
    │   │       ├── 📁 loading.tsx
    │   │       └── 📁 [event-type]/  # 🎭 EVENT TYPE CATEGORY
    │   │           ├── 📁 page.tsx   # All events of this type on date
    │   │           ├── 📁 loading.tsx
    │   │           └── 📁 [bloco-slug]/ # 🎪 SPECIFIC BLOCO EVENT
    │   │               ├── 📁 page.tsx # Final event detail page
    │   │               └── 📁 loading.tsx
    │   ├── 📁 events/                # 🎪 IMPROVED EVENT ROUTES (EN)
    │   │   ├── 📁 page.tsx           # All city events
    │   │   ├── 📁 loading.tsx
    │   │   ├── 📁 calendar/          # Calendar view
    │   │   │   ├── 📁 page.tsx
    │   │   │   └── 📁 loading.tsx
    │   │   ├── 📁 map/               # Map view
    │   │   │   ├── 📁 page.tsx
    │   │   │   └── 📁 loading.tsx
    │   │   └── 📁 [date]/            # 📅 DATE-SPECIFIC EVENTS
    │   │       ├── 📁 page.tsx       # All events on this date
    │   │       ├── 📁 loading.tsx
    │   │       └── 📁 [event-type]/  # 🎭 EVENT TYPE CATEGORY
    │   │           ├── 📁 page.tsx   # All events of this type on date
    │   │           ├── 📁 loading.tsx
    │   │           └── 📁 [bloco-slug]/ # 🎪 SPECIFIC BLOCO EVENT
    │   │               ├── 📁 page.tsx # Final event detail page
    │   │               └── 📁 loading.tsx
    │   ├── 📁 evenements/            # 🎪 IMPROVED EVENT ROUTES (FR)
    │   │   └── 📁 [same structure as eventos]/
    │   ├── 📁 guide/
    │   │   ├── 📁 page.tsx           # City carnival guide
    │   │   └── 📁 loading.tsx
    │   └── 📁 live/
    │       ├── 📁 page.tsx           # Live city updates
    │       └── 📁 loading.tsx
    ├── 📁 profile/                   # User profile area
    │   ├── 📁 page.tsx               # Profile overview
    │   ├── 📁 loading.tsx
    │   ├── 📁 edit/
    │   │   ├── 📁 page.tsx           # Edit profile
    │   │   └── 📁 loading.tsx
    │   ├── 📁 agenda/
    │   │   ├── 📁 page.tsx           # Personal event agenda
    │   │   └── 📁 loading.tsx
    │   ├── 📁 following/
    │   │   ├── 📁 page.tsx           # Followed blocos
    │   │   └── 📁 loading.tsx
    │   ├── 📁 friends/
    │   │   ├── 📁 page.tsx           # Friends list
    │   │   ├── 📁 loading.tsx
    │   │   └── 📁 requests/
    │   │       ├── 📁 page.tsx       # Friend requests
    │   │       └── 📁 loading.tsx
    │   ├── 📁 notifications/
    │   │   ├── 📁 page.tsx           # User notifications
    │   │   └── 📁 loading.tsx
    │   └── 📁 settings/
    │       ├── 📁 page.tsx           # Account settings
    │       └── 📁 loading.tsx
    ├── 📁 live/                      # Real-time features
    │   ├── 📁 page.tsx               # Live carnival feed
    │   ├── 📁 loading.tsx
    │   ├── 📁 location/
    │   │   ├── 📁 page.tsx           # Location sharing
    │   │   └── 📁 loading.tsx
    │   └── 📁 chat/
    │       ├── 📁 page.tsx           # Chat rooms
    │       ├── 📁 loading.tsx
    │       └── 📁 [roomId]/
    │           ├── 📁 page.tsx       # Specific chat room
    │           └── 📁 loading.tsx
    ├── 📁 blog/                      # Editorial content
    │   ├── 📁 page.tsx               # Blog listing
    │   ├── 📁 loading.tsx
    │   ├── 📁 [slug]/
    │   │   ├── 📁 page.tsx           # Article detail
    │   │   └── 📁 loading.tsx
    │   └── 📁 category/
    │       └── 📁 [category]/
    │           ├── 📁 page.tsx       # Category articles
    │           └── 📁 loading.tsx
    ├── 📁 search/
    │   ├── 📁 page.tsx               # Global search results
    │   └── 📁 loading.tsx
    ├── 📁 auth/                      # Authentication pages
    │   ├── 📁 login/
    │   │   ├── 📁 page.tsx           # Login page
    │   │   └── 📁 loading.tsx
    │   ├── 📁 register/
    │   │   ├── 📁 page.tsx           # Registration
    │   │   └── 📁 loading.tsx
    │   └── 📁 callback/
    │       ├── 📁 page.tsx           # OAuth callback
    │       └── 📁 loading.tsx
    └── 📁 about/                     # Static pages
        ├── 📁 page.tsx               # About us
        ├── 📁 loading.tsx
        ├── 📁 privacy/
        │   ├── 📁 page.tsx           # Privacy policy
        │   └── 📁 loading.tsx
        └── 📁 terms/
            ├── 📁 page.tsx           # Terms of service
            └── 📁 loading.tsx
```

---

## **3. Components Structure (src/components/)**

### **Enhanced Modular Component Architecture**

```
src/components/
├── 📁 ui/                           # Shadcn base components
│   ├── 📁 button.tsx
│   ├── 📁 card.tsx
│   ├── 📁 dialog.tsx
│   ├── 📁 input.tsx
│   ├── 📁 badge.tsx
│   ├── 📁 avatar.tsx
│   ├── 📁 calendar.tsx
│   ├── 📁 map.tsx
│   └── 📁 ...                       # Other Shadcn components
├── 📁 layout/                       # Layout components
│   ├── 📁 header/
│   │   ├── 📁 index.tsx             # Main header (60 lines)
│   │   ├── 📁 navigation.tsx        # Main navigation (80 lines)
│   │   ├── 📁 city-selector.tsx     # City selection dropdown (90 lines)
│   │   ├── 📁 language-selector.tsx # Language switcher (45 lines)
│   │   ├── 📁 search-bar.tsx        # Global search (70 lines)
│   │   └── 📁 user-menu.tsx         # User account menu (85 lines)
│   ├── 📁 footer/
│   │   ├── 📁 index.tsx             # Main footer (80 lines)
│   │   ├── 📁 newsletter.tsx        # Newsletter signup (55 lines)
│   │   └── 📁 social-links.tsx      # Social media links (35 lines)
│   ├── 📁 sidebar/
│   │   ├── 📁 index.tsx             # Sidebar container (50 lines)
│   │   ├── 📁 filters.tsx           # Filter sidebar (120 lines)
│   │   └── 📁 mobile-menu.tsx       # Mobile navigation (90 lines)
│   └── 📁 breadcrumbs/
│       └── 📁 index.tsx             # Breadcrumb navigation (70 lines)
├── 📁 homepage/                     # 🏠 HOMEPAGE COMPONENTS
│   ├── 📁 hero-section/
│   │   ├── 📁 index.tsx             # Main hero component (80 lines)
│   │   ├── 📁 hero-banner.tsx       # Hero banner with search (90 lines)
│   │   ├── 📁 city-quick-select.tsx # Quick city selection (70 lines)
│   │   └── 📁 carnival-countdown.tsx # Countdown to carnival (60 lines)
│   ├── 📁 featured-content/
│   │   ├── 📁 featured-blocos.tsx   # Featured blocos carousel (110 lines)
│   │   ├── 📁 upcoming-events.tsx   # Next events preview (95 lines)
│   │   ├── 📁 trending-cities.tsx   # Popular cities (85 lines)
│   │   └── 📁 latest-articles.tsx   # Blog articles preview (80 lines)
│   ├── 📁 discovery/
│   │   ├── 📁 city-explorer.tsx     # Interactive city map (130 lines)
│   │   ├── 📁 bloco-categories.tsx  # Bloco type navigation (75 lines)
│   │   ├── 📁 music-genres.tsx      # Music genre filters (65 lines)
│   │   └── 📁 carnival-calendar.tsx # Calendar overview (100 lines)
│   ├── 📁 social-proof/
│   │   ├── 📁 user-testimonials.tsx # User reviews (90 lines)
│   │   ├── 📁 community-stats.tsx   # Platform statistics (55 lines)
│   │   └── 📁 social-feed.tsx       # Social media highlights (105 lines)
│   └── 📁 calls-to-action/
│       ├── 📁 newsletter-signup.tsx # Email subscription (70 lines)
│       ├── 📁 app-download.tsx      # Mobile app promotion (60 lines)
│       └── 📁 city-guide-cta.tsx    # City guide promotion (50 lines)
├── 📁 blocos/                       # Bloco components
│   ├── 📁 bloco-card/
│   │   ├── 📁 index.tsx             # Bloco card component (85 lines)
│   │   ├── 📁 card-image.tsx        # Card image handling (45 lines)
│   │   ├── 📁 card-content.tsx      # Card content (60 lines)
│   │   └── 📁 follow-button.tsx     # Follow/unfollow button (40 lines)
│   ├── 📁 bloco-profile/
│   │   ├── 📁 index.tsx             # Full bloco profile (90 lines)
│   │   ├── 📁 header.tsx            # Profile header (75 lines)
│   │   ├── 📁 description.tsx       # Bloco description (65 lines)
│   │   ├── 📁 stats.tsx             # Follower stats (35 lines)
│   │   ├── 📁 social-links.tsx      # Social media links (55 lines)
│   │   ├── 📁 music-links.tsx       # Music platform links (60 lines)
│   │   └── 📁 media-gallery.tsx     # Photo/video gallery (110 lines)
│   ├── 📁 bloco-list/
│   │   ├── 📁 index.tsx             # Bloco listing container (70 lines)
│   │   ├── 📁 list-view.tsx         # List layout (85 lines)
│   │   ├── 📁 grid-view.tsx         # Grid layout (90 lines)
│   │   ├── 📁 map-view.tsx          # Map layout (120 lines)
│   │   └── 📁 filters.tsx           # List filters (100 lines)
│   ├── 📁 bloco-search/
│   │   ├── 📁 index.tsx             # Search interface (80 lines)
│   │   ├── 📁 search-input.tsx      # Search input (50 lines)
│   │   ├── 📁 search-filters.tsx    # Advanced filters (95 lines)
│   │   └── 📁 search-results.tsx    # Results display (75 lines)
│   └── 📁 social-embeds/
│       ├── 📁 instagram-feed.tsx    # Instagram integration (85 lines)
│       ├── 📁 youtube-videos.tsx    # YouTube integration (90 lines)
│       ├── 📁 spotify-player.tsx    # Spotify integration (70 lines)
│       └── 📁 social-media-grid.tsx # Social media grid (65 lines)
├── 📁 events/                       # 🎪 ENHANCED EVENT COMPONENTS
│   ├── 📁 event-card/
│   │   ├── 📁 index.tsx             # Event card component (75 lines)
│   │   ├── 📁 event-date.tsx        # Date display (30 lines)
│   │   ├── 📁 event-time.tsx        # Time display (25 lines)
│   │   ├── 📁 event-location.tsx    # Location info (40 lines)
│   │   ├── 📁 event-bloco.tsx       # Bloco info (35 lines)
│   │   ├── 📁 event-type-badge.tsx  # Event type badge (25 lines)
│   │   ├── 📁 save-button.tsx       # Save to agenda (45 lines)
│   │   └── 📁 share-button.tsx      # Share event (35 lines)
│   ├── 📁 event-detail/
│   │   ├── 📁 index.tsx             # Event detail layout (70 lines)
│   │   ├── 📁 event-header/
│   │   │   ├── 📁 index.tsx         # Header layout (50 lines)
│   │   │   ├── 📁 title.tsx         # Event title (30 lines)
│   │   │   ├── 📁 date-time.tsx     # Date/time display (40 lines)
│   │   │   ├── 📁 type-badge.tsx    # Event type badge (25 lines)
│   │   │   └── 📁 actions.tsx       # Action buttons (55 lines)
│   │   ├── 📁 event-info/
│   │   │   ├── 📁 index.tsx         # Info section (60 lines)
│   │   │   ├── 📁 description.tsx   # Event description (45 lines)
│   │   │   ├── 📁 bloco-info.tsx    # Associated bloco (70 lines)
│   │   │   ├── 📁 location-details.tsx # Location info (65 lines)
│   │   │   └── 📁 practical-info.tsx # Practical details (50 lines)
│   │   ├── 📁 location-map/
│   │   │   ├── 📁 index.tsx         # Map container (80 lines)
│   │   │   ├── 📁 event-marker.tsx  # Event marker (35 lines)
│   │   │   ├── 📁 directions-button.tsx # Get directions (40 lines)
│   │   │   └── 📁 nearby-events.tsx # Nearby events (90 lines)
│   │   └── 📁 related-content/
│   │       ├── 📁 related-events.tsx # Similar events (95 lines)
│   │       ├── 📁 bloco-events.tsx  # Other bloco events (85 lines)
│   │       └── 📁 city-events.tsx   # Other city events (80 lines)
│   ├── 📁 event-list/
│   │   ├── 📁 index.tsx             # Event listing container (85 lines)
│   │   ├── 📁 calendar-view.tsx     # Calendar layout (120 lines)
│   │   ├── 📁 timeline-view.tsx     # Timeline layout (100 lines)
│   │   ├── 📁 grid-view.tsx         # Grid layout (90 lines)
│   │   └── 📁 filters.tsx           # Event filters (110 lines)
│   ├── 📁 event-type-listings/      # 🎯 NEW: Event type specific listings
│   │   ├── 📁 parade-listing.tsx    # Parade events listing (95 lines)
│   │   ├── 📁 rehearsal-listing.tsx # Rehearsal events listing (90 lines)
│   │   ├── 📁 party-listing.tsx     # Party events listing (85 lines)
│   │   └── 📁 type-filter-bar.tsx   # Type-specific filters (70 lines)
│   ├── 📁 calendar/
│   │   ├── 📁 index.tsx             # Calendar component (110 lines)
│   │   ├── 📁 month-view.tsx        # Monthly calendar (95 lines)
│   │   ├── 📁 week-view.tsx         # Weekly view (100 lines)
│   │   ├── 📁 day-view.tsx          # Daily view (85 lines)
│   │   └── 📁 event-overlay.tsx     # Event details overlay (60 lines)
│   └── 📁 calendar-integration/
│       ├── 📁 export-buttons.tsx    # Export to calendar (65 lines)
│       ├── 📁 google-calendar.tsx   # Google Calendar sync (80 lines)
│       └── 📁 ical-export.tsx       # iCal export (55 lines)
├── 📁 maps/                         # Map components
│   ├── 📁 interactive-map/
│   │   ├── 📁 index.tsx             # Main map component (100 lines)
│   │   ├── 📁 map-markers.tsx       # Map markers (70 lines)
│   │   ├── 📁 map-clusters.tsx      # Marker clustering (85 lines)
│   │   ├── 📁 map-controls.tsx      # Map controls (60 lines)
│   │   └── 📁 event-markers.tsx     # Event-specific markers (75 lines)
│   ├── 📁 location-picker/
│   │   └── 📁 index.tsx             # Location selection (90 lines)
│   ├── 📁 directions/
│   │   ├── 📁 index.tsx             # Directions component (80 lines)
│   │   └── 📁 route-display.tsx     # Route visualization (70 lines)
│   └── 📁 geolocation/
│       ├── 📁 user-location.tsx     # User location (65 lines)
│       └── 📁 location-sharing.tsx  # Share location (95 lines)
├── 📁 users/                        # User components
│   ├── 📁 profile/
│   │   ├── 📁 user-profile.tsx      # User profile display (90 lines)
│   │   ├── 📁 profile-edit.tsx      # Profile editing (110 lines)
│   │   ├── 📁 avatar-upload.tsx     # Avatar management (75 lines)
│   │   └── 📁 preferences.tsx       # User preferences (85 lines)
│   ├── 📁 social/
│   │   ├── 📁 friend-list.tsx       # Friends list (80 lines)
│   │   ├── 📁 friend-requests.tsx   # Friend requests (90 lines)
│   │   ├── 📁 user-connections.tsx  # Social connections (85 lines)
│   │   └── 📁 activity-feed.tsx     # User activity (100 lines)
│   ├── 📁 agenda/
│   │   ├── 📁 personal-agenda.tsx   # User's saved events (95 lines)
│   │   ├── 📁 agenda-calendar.tsx   # Calendar view (105 lines)
│   │   └── 📁 event-reminders.tsx   # Reminder settings (70 lines)
│   └── 📁 authentication/
│       ├── 📁 login-form.tsx        # Login form (80 lines)
│       ├── 📁 register-form.tsx     # Registration form (95 lines)
│       ├── 📁 social-login.tsx      # Social authentication (60 lines)
│       └── 📁 auth-guard.tsx        # Route protection (55 lines)
├── 📁 live/                         # Real-time components
│   ├── 📁 location-sharing/
│   │   ├── 📁 index.tsx             # Main location sharing (90 lines)
│   │   ├── 📁 location-map.tsx      # Real-time location map (110 lines)
│   │   ├── 📁 friend-locations.tsx  # Friends' locations (85 lines)
│   │   ├── 📁 sharing-controls.tsx  # Privacy controls (75 lines)
│   │   └── 📁 battery-optimizer.tsx # Battery management (65 lines)
│   ├── 📁 chat/
│   │   ├── 📁 chat-room.tsx         # Chat room component (100 lines)
│   │   ├── 📁 message-list.tsx      # Message display (95 lines)
│   │   ├── 📁 message-input.tsx     # Message composition (70 lines)
│   │   ├── 📁 chat-participants.tsx # Participant list (60 lines)
│   │   └── 📁 typing-indicator.tsx  # Typing status (35 lines)
│   ├── 📁 notifications/
│   │   ├── 📁 notification-center.tsx # Notification center (85 lines)
│   │   ├── 📁 notification-item.tsx # Individual notification (50 lines)
│   │   ├── 📁 push-notifications.tsx # Push notification handler (90 lines)
│   │   └── 📁 notification-settings.tsx # Notification preferences (80 lines)
│   └── 📁 live-updates/
│       ├── 📁 live-feed.tsx         # Live carnival feed (105 lines)
│       ├── 📁 real-time-events.tsx  # Real-time event updates (85 lines)
│       └── 📁 status-indicator.tsx  # Connection status (40 lines)
├── 📁 cities/                       # City components
│   ├── 📁 city-selector/
│   │   ├── 📁 index.tsx             # City selection (80 lines)
│   │   ├── 📁 city-dropdown.tsx     # Dropdown selector (70 lines)
│   │   ├── 📁 city-search.tsx       # City search (85 lines)
│   │   └── 📁 recent-cities.tsx     # Recently viewed (55 lines)
│   ├── 📁 city-profile/
│   │   ├── 📁 city-header.tsx       # City header (75 lines)
│   │   ├── 📁 city-stats.tsx        # City statistics (60 lines)
│   │   ├── 📁 carnival-info.tsx     # Carnival information (90 lines)
│   │   └── 📁 city-guide.tsx        # City guide (100 lines)
│   └── 📁 city-comparison/
│       ├── 📁 comparison-table.tsx  # Compare cities (120 lines)
│       └── 📁 city-metrics.tsx      # City metrics (65 lines)
├── 📁 search/                       # Search components
│   ├── 📁 global-search/
│   │   ├── 📁 index.tsx             # Global search (85 lines)
│   │   ├── 📁 search-input.tsx      # Search input (60 lines)
│   │   ├── 📁 search-suggestions.tsx # Auto-suggestions (75 lines)
│   │   └── 📁 search-history.tsx    # Search history (50 lines)
│   ├── 📁 search-results/
│   │   ├── 📁 index.tsx             # Results container (80 lines)
│   │   ├── 📁 result-item.tsx       # Individual result (45 lines)
│   │   ├── 📁 result-filters.tsx    # Result filtering (90 lines)
│   │   └── 📁 pagination.tsx        # Results pagination (55 lines)
│   └── 📁 advanced-search/
│       ├── 📁 filters-form.tsx      # Advanced filters (110 lines)
│       └── 📁 saved-searches.tsx    # Saved search queries (70 lines)
├── 📁 blog/                         # Blog components
│   ├── 📁 article-card/
│   │   └── 📁 index.tsx             # Article card (60 lines)
│   ├── 📁 article-detail/
│   │   ├── 📁 article-header.tsx    # Article header (70 lines)
│   │   ├── 📁 article-content.tsx   # Article content (85 lines)
│   │   ├── 📁 article-meta.tsx      # Article metadata (45 lines)
│   │   └── 📁 related-articles.tsx  # Related content (75 lines)
│   └── 📁 blog-navigation/
│       ├── 📁 category-nav.tsx      # Category navigation (65 lines)
│       └── 📁 article-pagination.tsx # Article pagination (50 lines)
└── 📁 common/                       # Common components
    ├── 📁 loading/
    │   ├── 📁 skeleton-loader.tsx   # Skeleton loading (55 lines)
    │   ├── 📁 spinner.tsx           # Loading spinner (25 lines)
    │   └── 📁 page-loader.tsx       # Full page loading (40 lines)
    ├── 📁 error/
    │   ├── 📁 error-boundary.tsx    # Error boundary (70 lines)
    │   ├── 📁 error-message.tsx     # Error display (45 lines)
    │   └── 📁 retry-button.tsx      # Retry mechanism (35 lines)
    ├── 📁 seo/
    │   ├── 📁 meta-tags.tsx         # SEO meta tags (60 lines)
    │   ├── 📁 structured-data.tsx   # Schema.org data (80 lines)
    │   └── 📁 canonical-url.tsx     # Canonical URLs (40 lines)
    ├── 📁 media/
    │   ├── 📁 image-gallery.tsx     # Image gallery (95 lines)
    │   ├── 📁 video-player.tsx      # Video player (85 lines)
    │   ├── 📁 media-upload.tsx      # Media upload (100 lines)
    │   └── 📁 lazy-image.tsx        # Lazy loading images (50 lines)
    └── 📁 forms/
        ├── 📁 form-field.tsx        # Reusable form field (65 lines)
        ├── 📁 form-validation.tsx   # Form validation (80 lines)
        └── 📁 form-submission.tsx   # Form submission (70 lines)
```

---

## **4. Lib Directory (src/lib/)**

### **Enhanced Utilities & Configurations**

```
src/lib/
├── 📁 supabase/
│   ├── 📁 client.ts                 # Supabase client setup (50 lines)
│   ├── 📁 server.ts                 # Server-side client (60 lines)
│   ├── 📁 types.ts                  # Database types (auto-generated)
│   ├── 📁 queries/                  # Database queries (60-90 lines each)
│   │   ├── 📁 blocos.ts             # Bloco queries
│   │   ├── 📁 events.ts             # Event queries
│   │   ├── 📁 events-by-url.ts      # 🆕 Event URL-based queries
│   │   ├── 📁 users.ts              # User queries
│   │   ├── 📁 cities.ts             # City queries
│   │   └── 📁 search.ts             # Search queries
│   ├── 📁 mutations/                # Database mutations (50-80 lines each)
│   │   ├── 📁 blocos.ts             # Bloco mutations
│   │   ├── 📁 events.ts             # Event mutations
│   │   └── 📁 users.ts              # User mutations
│   └── 📁 realtime/                 # Real-time subscriptions (70-100 lines each)
│       ├── 📁 location.ts           # Location sharing
│       ├── 📁 chat.ts               # Chat subscriptions
│       └── 📁 notifications.ts      # Notification subscriptions
├── 📁 auth/
│   ├── 📁 config.ts                 # Auth configuration (40 lines)
│   ├── 📁 providers.ts              # Auth providers (60 lines)
│   ├── 📁 middleware.ts             # Auth middleware (55 lines)
│   └── 📁 permissions.ts            # Permission utils (70 lines)
├── 📁 i18n/
│   ├── 📁 config.ts                 # i18n configuration (45 lines)
│   ├── 📁 middleware.ts             # i18n middleware (50 lines)
│   ├── 📁 utils.ts                  # i18n utilities (65 lines)
│   └── 📁 locales/                  # Translation files
│       ├── 📁 pt.json               # Portuguese translations
│       ├── 📁 en.json               # English translations
│       ├── 📁 fr.json               # French translations
│       └── 📁 es.json               # Spanish translations
├── 📁 maps/
│   ├── 📁 config.ts                 # Map configuration (40 lines)
│   ├── 📁 utils.ts                  # Map utilities (75 lines)
│   ├── 📁 geocoding.ts              # Geocoding functions (60 lines)
│   └── 📁 directions.ts             # Directions API (80 lines)
├── 📁 external-apis/
│   ├── 📁 instagram.ts              # Instagram API (90 lines)
│   ├── 📁 youtube.ts                # YouTube API (85 lines)
│   ├── 📁 spotify.ts                # Spotify API (95 lines)
│   ├── 📁 google-calendar.ts        # Google Calendar (100 lines)
│   └── 📁 social-embeds.ts          # Social media embeds (110 lines)
├── 📁 seo/
│   ├── 📁 metadata.ts               # SEO metadata (80 lines)
│   ├── 📁 structured-data.ts        # Schema.org data (90 lines)
│   ├── 📁 sitemap.ts                # Sitemap generation (100 lines)
│   └── 📁 urls.ts                   # 🆕 Enhanced URL generation (120 lines)
├── 📁 analytics/
│   ├── 📁 config.ts                 # Analytics setup (50 lines)
│   ├── 📁 events.ts                 # Event tracking (70 lines)
│   └── 📁 performance.ts            # Performance monitoring (60 lines)
├── 📁 utils/
│   ├── 📁 date.ts                   # Date utilities (85 lines)
│   ├── 📁 string.ts                 # String utilities (55 lines)
│   ├── 📁 url.ts                    # URL utilities (90 lines)
│   ├── 📁 event-url.ts              # 🆕 Event URL utilities (110 lines)
│   ├── 📁 validation.ts             # Validation schemas (95 lines)
│   ├── 📁 constants.ts              # App constants (60 lines)
│   └── 📁 helpers.ts                # General helpers (80 lines)
├── 📁 hooks/
│   ├── 📁 use-supabase.ts           # Supabase hooks (70 lines)
│   ├── 📁 use-auth.ts               # Authentication hooks (85 lines)
│   ├── 📁 use-location.ts           # Geolocation hooks (90 lines)
│   ├── 📁 use-realtime.ts           # Real-time hooks (95 lines)
│   ├── 📁 use-event-detail.ts       # 🆕 Event detail hook (80 lines)
│   └── 📁 use-local-storage.ts      # Local storage hooks (50 lines)
└── 📁 stores/
    ├── 📁 auth-store.ts             # Authentication state (90 lines)
    ├── 📁 city-store.ts             # City selection state (70 lines)
    ├── 📁 location-store.ts         # Location sharing state (100 lines)
    ├── 📁 chat-store.ts             # Chat state (85 lines)
    └── 📁 preferences-store.ts      # User preferences (75 lines)
```

---

## **5. Type Definitions (src/types/)**

```
src/types/
├── 📁 database.ts                   # Supabase database types (auto-generated)
├── 📁 api.ts                        # API response types (80 lines)
├── 📁 auth.ts                       # Authentication types (50 lines)
├── 📁 blocos.ts                     # Bloco-related types (70 lines)
├── 📁 events.ts                     # Event-related types (90 lines)
├── 📁 cities.ts                     # City-related types (45 lines)
├── 📁 users.ts                      # User-related types (60 lines)
├── 📁 maps.ts                       # Map-related types (40 lines)
├── 📁 chat.ts                       # Chat-related types (55 lines)
├── 📁 location.ts                   # Location-related types (65 lines)
├── 📁 i18n.ts                       # Internationalization types (35 lines)
└── 📁 common.ts                     # Common utility types (75 lines)
```

---

## **6. Configuration Files**

### **Updated Configuration Examples**

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "supabase.com",
      "instagram.com",
      "youtube.com",
      "spotify.com",
      "i.ytimg.com",
      "scontent.cdninstagram.com",
    ],
  },
  async rewrites() {
    return [
      // SEO-friendly rewrites
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

module.exports = nextConfig;

// middleware.ts
import { createI18nMiddleware } from "next-intl/middleware";

export default createI18nMiddleware({
  locales: ["pt", "en", "fr", "es"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

---

## **7. Enhanced Event URL Examples**

### **Final Event URL Structure**

```typescript
// Event URL Examples with improved structure:

🎪 PERFECT EVENT URLS:
/pt/rio-de-janeiro/eventos/2025-02-15/desfile/cordao-da-bola-preta
/en/salvador/events/2025-02-20/rehearsal/olodum
/fr/sao-paulo/evenements/2025-02-18/fete/bloco-festa
/es/rio-de-janeiro/eventos/2025-02-16/ensaio/cordao-da-bola-preta

🎯 LISTING PAGE URLS:
/pt/rio-de-janeiro/eventos/2025-02-15/desfile         # All parades on date
/en/salvador/events/2025-02-20/rehearsal              # All rehearsals on date
/pt/rio-de-janeiro/eventos/calendario                 # Calendar view
/en/salvador/events/map                               # Map view
```
