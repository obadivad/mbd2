# **Architecture Overview Document**
## **Ministério do Bloco - System Architecture & Component Interactions**

---

## **1. High-Level System Architecture**

### **🏗️ System Overview**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MINISTÉRIO DO BLOCO                               │
│                      Carnival Community Platform                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   User Clients   │    │   Admin Panel    │    │  Content Mgmt    │
│                  │    │                  │    │                  │
│ • Web App (PWA)  │    │ • Bloco Managers │    │ • Editorial      │
│ • Mobile Apps    │    │ • Event Admins   │    │ • Blog Posts     │
│ • Social Embeds  │    │ • City Admins    │    │ • Translations   │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    │    (Vercel Edge)        │
                    └─────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │   Next.js 15    │  │  API Gateway    │  │ Static Assets   │           │
│  │                 │  │                 │  │                 │           │
│  │ • SSR/SSG       │  │ • Route Handling│  │ • Images        │           │
│  │ • PWA Features  │  │ • Rate Limiting │  │ • Media Files   │           │
│  │ • i18n Support  │  │ • Validation    │  │ • Fonts         │           │
│  │ • SEO Optimize  │  │ • Error Handling│  │ • JS/CSS        │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVICES LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │   Supabase      │  │  Real-time      │  │ External APIs   │           │
│  │   Backend       │  │  Services       │  │                 │           │
│  │                 │  │                 │  │ • Instagram     │           │
│  │ • PostgreSQL    │  │ • WebSockets    │  │ • YouTube       │           │
│  │ • Auth Service  │  │ • Pub/Sub       │  │ • Spotify       │           │
│  │ • Storage       │  │ • Location      │  │ • Google Maps   │           │
│  │ • Edge Functions│  │ • Chat          │  │ • Calendar APIs │           │
│  │ • RLS Policies  │  │ • Notifications │  │ • Weather       │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │   PostgreSQL    │  │   File Storage  │  │   Caching       │           │
│  │                 │  │                 │  │                 │           │
│  │ • Blocos Data   │  │ • Images        │  │ • Redis Cache   │           │
│  │ • Events Data   │  │ • Videos        │  │ • CDN Cache     │           │
│  │ • Users Data    │  │ • Documents     │  │ • Browser Cache │           │
│  │ • Location Data │  │ • Backups       │  │ • API Cache     │           │
│  │ • Chat Data     │  │                 │  │                 │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## **2. Core Component Interactions**

### **🎭 User Journey: Discovering a Bloco**
```
User Flow: "I want to find blocos in Rio de Janeiro"

1. User Request
   ┌─────────────────┐
   │ User visits     │
   │ /en/rio-de-     │
   │ janeiro/blocos  │
   └─────────────────┘
           │
           ▼
2. Next.js Routing
   ┌─────────────────┐
   │ • Locale detect │
   │ • City validate │
   │ • SSG/SSR check │
   │ • SEO metadata  │
   └─────────────────┘
           │
           ▼
3. Data Fetching
   ┌─────────────────┐         ┌─────────────────┐
   │ API Route       │────────▶│ Supabase Query  │
   │ /api/blocos     │         │ • City filter   │
   │ ?city=rio       │         │ • RLS policies  │
   │                 │◀────────│ • Joins/indexes │
   └─────────────────┘         └─────────────────┘
           │
           ▼
4. External Enrichment (Async)
   ┌─────────────────┐         ┌─────────────────┐
   │ Social Media    │         │ Map Services    │
   │ • Instagram API │         │ • Coordinates   │
   │ • YouTube API   │         │ • Location data │
   │ • Spotify API   │         │ • Directions    │
   └─────────────────┘         └─────────────────┘
           │                           │
           └─────────┬─────────────────┘
                     ▼
5. Response Assembly
   ┌─────────────────┐
   │ • Combine data  │
   │ • Apply i18n    │
   │ • Generate URLs │
   │ • Cache results │
   └─────────────────┘
           │
           ▼
6. Frontend Rendering
   ┌─────────────────┐
   │ • React hydrat. │
   │ • Interactive   │
   │ • Real-time sub │
   │ • User context  │
   └─────────────────┘
```

### **🎪 Event Discovery with New URL Structure**
```
User Flow: "I want to see all parades on February 15th in Rio"

URL: /pt/rio-de-janeiro/eventos/2025-02-15/desfile

1. Enhanced Routing
   ┌─────────────────┐
   │ Next.js 15      │
   │ • Parse locale  │
   │ • Extract city  │
   │ • Parse date    │
   │ • Parse type    │
   └─────────────────┘
           │
           ▼
2. URL Validation & Translation
   ┌─────────────────┐         ┌─────────────────┐
   │ URL Components  │────────▶│ Type Translation│
   │ • city: rio-de- │         │ 'desfile' →     │
   │   janeiro       │         │ 'parade'        │
   │ • date: 2025-   │         │ • Validate date │
   │   02-15         │         │ • Validate city │
   │ • type: desfile │◀────────│ • Set locale    │
   └─────────────────┘         └─────────────────┘
           │
           ▼
3. Optimized Database Query
   ┌─────────────────┐
   │ event_url_view  │  ← Uses our specialized view
   │ WHERE:          │
   │ • city_slug =   │
   │   'rio-de-      │
   │   janeiro'      │
   │ • event_date =  │
   │   '2025-02-15'  │
   │ • event_type =  │
   │   'parade'      │
   └─────────────────┘  ← Hits idx_events_url_lookup index
           │
           ▼
4. Related Content Generation
   ┌─────────────────┐         ┌─────────────────┐
   │ Same Date/City  │         │ Same Type/City  │
   │ • Other types   │         │ • Other dates   │
   │ • Event counts  │         │ • Trends        │
   │ • Navigation    │         │ • Suggestions   │
   └─────────────────┘         └─────────────────┘
           │                           │
           └─────────┬─────────────────┘
                     ▼
5. SEO & Navigation Data
   ┌─────────────────┐
   │ • Breadcrumbs   │
   │ • Canonical URLs│
   │ • Alternate lang│
   │ • Structured    │
   │   data (events) │
   └─────────────────┘
```

---

## **3. Real-time Architecture**

### **📍 Location Sharing System (Zenly-like)**
```
Real-time Location Flow:

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Mobile App    │         │   Supabase      │         │  Friend's App   │
│                 │         │   Real-time     │         │                 │
│ 1. Share Loc    │────────▶│                 │────────▶│ 4. Receive Loc  │
│ 2. GPS Update   │         │ • WebSocket     │         │ 5. Update Map   │
│ 3. Battery Opt  │         │ • Pub/Sub       │         │ 6. Proximity    │
│                 │         │ • RLS Security  │         │    Alert        │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │                           │
         │                           ▼                           │
         │                  ┌─────────────────┐                  │
         │                  │   PostgreSQL    │                  │
         │                  │                 │                  │
         │                  │ • Location hist │                  │
         │                  │ • Session mgmt  │                  │
         │                  │ • Privacy rules │                  │
         │                  │ • Friend perms  │                  │
         │                  └─────────────────┘                  │
         │                                                       │
         └───────────────────── Proximity Calc ──────────────────┘

Technical Flow:
1. User enables location sharing
2. Create location_session record
3. Stream GPS coordinates via WebSocket
4. Supabase broadcasts to authorized friends
5. Real-time updates on friends' maps
6. Battery optimization (adaptive intervals)
7. Session expires automatically
```

### **💬 Chat System Architecture**
```
Real-time Chat Flow:

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   User A        │         │   Supabase      │         │   User B        │
│                 │         │   Real-time     │         │                 │
│ 1. Send Message │────────▶│                 │────────▶│ 3. Receive Msg  │
│ 2. Typing...    │         │ • chat_messages │         │ 4. Typing ind.  │
│                 │         │ • chat_rooms    │         │ 5. Read receipt │
│                 │         │ • participants  │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │                           │
         │                           ▼                           │
         │                  ┌─────────────────┐                  │
         │                  │   Message       │                  │
         │                  │   Processing    │                  │
         │                  │                 │                  │
         │                  │ • Content mod   │                  │
         │                  │ • Link preview  │                  │
         │                  │ • Media upload  │                  │
         │                  │ • Emoji react   │                  │
         │                  └─────────────────┘                  │
         │                                                       │
         └───────────────────── Push Notifications ──────────────┘

Message Types:
- text: Regular messages
- image: Photo sharing from carnival
- location: Share current location
- event_share: Share carnival event
- bloco_share: Share bloco information
```

### **🔔 Notification System**
```
Notification Architecture:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Trigger       │    │   Processing    │    │   Delivery      │
│                 │    │                 │    │                 │
│ • Bloco update  │───▶│ • User prefs    │───▶│ • Web Push      │
│ • Event change  │    │ • Friend perms  │    │ • Email         │
│ • Friend req    │    │ • Rate limiting │    │ • In-app        │
│ • Carnival rem  │    │ • Language sel  │    │ • SMS (opt)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   Notification  │              │
         │              │   Queue         │              │
         │              │                 │              │
         │              │ • Priority      │              │
         │              │ • Batching      │              │
         │              │ • Retry logic   │              │
         │              │ • Dead letter   │              │
         │              └─────────────────┘              │
         │                                               │
         └────────────── Analytics Tracking ─────────────┘

Database Triggers → Supabase Edge Functions → Push Services
```

---

## **4. Authentication & Security Architecture**

### **🔐 Authentication Flow**
```
Multi-Provider Authentication:

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Client        │         │   Supabase      │         │   OAuth         │
│                 │         │   Auth          │         │   Providers     │
│ 1. Login Click  │────────▶│                 │────────▶│                 │
│ 7. Redirect     │◀────────│ • JWT Generate  │◀────────│ • Google        │
│ 8. Store Token  │         │ • Session Mgmt  │         │ • Facebook      │
│ 9. API Calls    │         │ • RLS Policies  │         │ • Instagram     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │                           │
         │                           ▼                           │
         │                  ┌─────────────────┐                  │
         │                  │   User Profile  │                  │
         │                  │   Creation      │                  │
         │                  │                 │                  │
         │                  │ • Profile setup │                  │
         │                  │ • Preferences   │                  │
         │                  │ • City selection│                  │
         │                  │ • Onboarding    │                  │
         │                  └─────────────────┘                  │
         │                                                       │
         └─────── Automatic Session Refresh (JWT) ──────────────┘

Row Level Security (RLS) Flow:
1. Every database query includes user context
2. RLS policies automatically filter data
3. Users only see their own private data
4. Public data accessible to all
5. Friend data accessible based on privacy settings
```

### **🛡️ Security Layers**
```
Security Architecture:

┌─────────────────────────────────────────────────────────────────────────────┐
│                            SECURITY LAYERS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Edge Protection                                                    │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ DDoS Protection │  │ Rate Limiting   │  │ Geo Blocking    │            │
│ │ (Vercel Edge)   │  │ (100 req/min)   │  │ (Suspicious)    │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Application Security                                              │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ JWT Validation  │  │ Input Sanitize  │  │ CSRF Protection │            │
│ │ (Every Request) │  │ (XSS Prevention)│  │ (SameSite)      │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Database Security                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Row Level Sec   │  │ Prepared Stmt   │  │ Encrypted Data  │            │
│ │ (RLS Policies)  │  │ (SQL Injection) │  │ (Sensitive)     │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Layer 4: Data Protection                                                   │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Location Priv   │  │ Personal Data   │  │ Content Mod     │            │
│ │ (User Control)  │  │ (LGPD Compliant)│  │ (Community)     │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## **5. External Service Integration**

### **🌐 Third-Party Service Architecture**
```
External Integration Hub:

┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Social Media APIs        Map Services           Calendar Services          │
│ ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐        │
│ │ Instagram       │     │ OpenStreetMap   │     │ Google Calendar │        │
│ │ • Feed embed    │     │ • Base maps     │     │ • Event export  │        │
│ │ • Profile data  │     │ • Geocoding     │     │ • Sync events   │        │
│ │ • Media fetch   │     │ • Tile serving  │     │ • Reminders     │        │
│ └─────────────────┘     └─────────────────┘     └─────────────────┘        │
│ ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐        │
│ │ YouTube         │     │ Google Maps     │     │ iCal Standard   │        │
│ │ • Video embed   │     │ • Directions    │     │ • Universal     │        │
│ │ • Channel data  │     │ • Places API    │     │   export        │        │
│ │ • Playlists     │     │ • Street View   │     │ • Import/Export │        │
│ └─────────────────┘     └─────────────────┘     └─────────────────┘        │
│ ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐        │
│ │ Spotify         │     │ Weather APIs    │     │ Email Services  │        │
│ │ • Track embed   │     │ • Conditions    │     │ • Notifications │        │
│ │ • Playlist data │     │ • Forecasts     │     │ • Newsletters   │        │
│ │ • Artist info   │     │ • Alerts        │     │ • Transactional │        │
│ └─────────────────┘     └─────────────────┘     └─────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTEGRATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ API Caching     │  │ Rate Limiting   │  │ Error Handling  │             │
│ │                 │  │                 │  │                 │             │
│ │ • Redis cache   │  │ • Per service   │  │ • Retry logic   │             │
│ │ • TTL policies  │  │ • Quota mgmt    │  │ • Fallbacks     │             │
│ │ • Invalidation  │  │ • Queue system  │  │ • Circuit break │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ Data Transform  │  │ Webhook Mgmt    │  │ Security        │             │
│ │                 │  │                 │  │                 │             │
│ │ • Normalize     │  │ • Endpoint mgmt │  │ • API keys      │             │
│ │ • Validate      │  │ • Verification  │  │ • OAuth tokens  │             │
│ │ • Enrich        │  │ • Processing    │  │ • Encryption    │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **🔄 Data Synchronization Flow**
```
Social Media Data Pipeline:

1. Scheduled Jobs (Every 4 hours)
   ┌─────────────────┐
   │ Supabase Edge   │
   │ Function Cron   │
   │                 │
   │ • Fetch new     │
   │   content       │
   │ • Update cache  │
   │ • Clean old     │
   └─────────────────┘
           │
           ▼
2. API Orchestration
   ┌─────────────────┐         ┌─────────────────┐
   │ Instagram API   │         │ YouTube API     │
   │ • Get posts     │         │ • Get videos    │
   │ • Check limits  │         │ • Channel data  │
   │ • Transform     │         │ • Metadata      │
   └─────────────────┘         └─────────────────┘
           │                           │
           └─────────┬─────────────────┘
                     ▼
3. Data Processing
   ┌─────────────────┐
   │ • Merge data    │
   │ • Validate      │
   │ • Store in DB   │
   │ • Update cache  │
   │ • Notify users  │
   └─────────────────┘
           │
           ▼
4. Real-time Updates
   ┌─────────────────┐
   │ • WebSocket     │
   │   broadcast     │
   │ • UI refresh    │
   │ • Cache invalidate│
   └─────────────────┘
```

---

## **6. Performance & Scalability Architecture**

### **⚡ Caching Strategy**
```
Multi-Layer Caching:

┌─────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Browser Cache (User Device)                                                │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Static Assets   │  │ API Responses   │  │ Service Worker  │            │
│ │ • Images: 7d    │  │ • Blocos: 1h    │  │ • Offline data  │            │
│ │ • CSS/JS: 1y    │  │ • Events: 15m   │  │ • PWA cache     │            │
│ │ • Fonts: 1y     │  │ • User: 5m      │  │ • Background    │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ CDN Cache (Vercel Edge)                                                    │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Static Pages    │  │ API Responses   │  │ Media Files     │            │
│ │ • Homepage: 1h  │  │ • Public: 5m    │  │ • Images: 30d   │            │
│ │ • City pages: 4h│  │ • Dynamic: 1m   │  │ • Videos: 30d   │            │
│ │ • Bloco: 2h     │  │ • Search: 30s   │  │ • Audio: 30d    │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Application Cache (Redis)                                                  │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Database Query  │  │ External APIs   │  │ Session Data    │            │
│ │ • Bloco list: 1h│  │ • Instagram: 4h │  │ • User state    │            │
│ │ • Event list: 15m│  │ • Weather: 30m  │  │ • Location: 1m  │            │
│ │ • Search: 5m    │  │ • Maps: 6h      │  │ • Prefs: 1h     │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **📈 Scalability Architecture**
```
Horizontal Scaling Strategy:

┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRAFFIC DISTRIBUTION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Global CDN (Vercel Edge)                                                   │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ São Paulo       │  │ Rio de Janeiro  │  │ International   │            │
│ │ • Local traffic │  │ • Carnival peak │  │ • Tourist       │            │
│ │ • Low latency   │  │ • High capacity │  │ • Multi-language│            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Auto-Scaling Components                                                    │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ API Functions   │  │ Database        │  │ Real-time       │            │
│ │ • Serverless    │  │ • Read replicas │  │ • WebSocket     │            │
│ │ • Auto-scale    │  │ • Connection    │  │ • Horizontal    │            │
│ │ • Regional      │  │   pooling       │  │ • Load balance  │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Carnival Season Scaling (Feb-Mar Traffic Spike)                           │
│                                                                             │
│ Normal Traffic: 10K users/day                                             │
│ ├── Database: Single region                                               │
│ ├── Cache: Standard Redis                                                 │
│ └── Functions: Auto-scale                                                 │
│                                                                             │
│ Carnival Peak: 500K+ users/day                                           │
│ ├── Database: Read replicas + partitioning                               │
│ ├── Cache: Redis Cluster + regional                                      │
│ ├── Functions: Pre-warmed + increased limits                             │
│ └── Real-time: Multiple WebSocket servers                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## **7. Monitoring & Observability**

### **📊 System Monitoring Architecture**
```
Monitoring Stack:

┌─────────────────────────────────────────────────────────────────────────────┐
│                        OBSERVABILITY LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Application Monitoring                                                     │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Error Tracking  │  │ Performance     │  │ User Analytics  │            │
│ │ • Sentry        │  │ • Vercel        │  │ • PostHog       │            │
│ │ • Stack traces  │  │ • Core Web      │  │ • Funnels       │            │
│ │ • User context  │  │   Vitals        │  │ • Retention     │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
│ Infrastructure Monitoring                                                  │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ Database        │  │ API Performance │  │ External APIs   │            │
│ │ • Query time    │  │ • Response time │  │ • Availability  │            │
│ │ • Connection    │  │ • Error rates   │  │ • Rate limits   │            │
│ │ • Disk usage    │  │ • Throughput    │  │ • Response time │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
│ Real-time Monitoring                                                       │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│ │ WebSocket Conn  │  │ Location Acc.   │  │ Chat Messages   │            │
│ │ • Active users  │  │ • GPS accuracy  │  │ • Delivery rate │            │
│ │ • Connection    │  │ • Update freq   │  │ • Latency       │            │
│ │   quality       │  │ • Battery drain │  │ • Errors        │            │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Alert System:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Threshold       │───▶│ Alert Manager   │───▶│ Response Team   │
│ • Error rate    │    │ • Slack         │    │ • On-call dev   │
│ • Response time │    │ • Email         │    │ • DevOps        │
│ • Down services │    │ • SMS (critical)│    │ • Product team  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## **8. Deployment & DevOps Architecture**

### **🚀 CI/CD Pipeline**
```
Development to Production Flow:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Development     │    │ Staging         │    │ Production      │
│                 │    │                 │    │                 │
│ • Local dev     │───▶│ • Preview envs  │───▶│ • Live platform │
│ • Hot reload    │    │ • E2E tests     │    │ • Global CDN    │
│ • Supabase      │    │ • Performance   │    │ • Monitoring    │
│   local         │    │   testing       │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   Quality Gates │              │
         │              │                 │              │
         │              │ • Unit tests    │              │
         │              │ • Integration   │              │
         │              │ • Security scan │              │
         │              │ • Performance   │              │
         │              │ • Accessibility │              │
         │              └─────────────────┘              │
         │                                               │
         └──────────── GitHub Actions Workflow ──────────┘

Deployment Strategy:
1. Feature branch → PR → Review
2. Automatic tests on PR
3. Deploy to preview URL
4. Manual QA approval
5. Merge to main → Production deploy
6. Database migrations (if needed)
7. Cache invalidation
8. Health checks
9. Rollback capability
```

---

## **9. Data Flow Summary**

### **🌊 Complete Data Flow**
```
End-to-End Data Journey:

User Action → Next.js Router → API Route → Supabase → Database
     ↓              ↓              ↓           ↓          ↓
Response ← Component ← Data Fetch ← Result ← Query Result

External APIs ←→ Edge Functions ←→ Cache Layer ←→ Database
     ↓                  ↓             ↓           ↓
Social Data →    Processing →    Stored →    Real-time
Instagram       Validation    Database   WebSocket Updates
YouTube         Transform     Cache      Push Notifications
Spotify         Enrich        CDN        UI Updates

Real-time Features:
Location → WebSocket → Supabase → Friends' Apps
Chat     → WebSocket → Database → Participants
Notifications → Queue → Processing → Delivery

SEO & Performance:
Database → SSG/SSR → CDN → Global Edge → User
Search → Indexes → Results → Cache → Response
```

This comprehensive Architecture Overview provides your LLM assistant with a complete understanding of how all components in your carnival platform interact, from user requests to real-time features to external integrations. It serves as the foundation for all other technical documentation and development decisions.

Ready to proceed with Backend Architecture Design next?

---
Answer from Perplexity: pplx.ai/share