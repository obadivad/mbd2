# **Backend Architecture Design Document**
## **Ministério do Bloco - Comprehensive Backend System Design**

---

## **1. Backend Architecture Overview**

### **🏗️ Service-Oriented Backend Architecture**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │  API Gateway    │  │  Core Services  │  │  Real-time      │             │
│ │                 │  │                 │  │  Services       │             │
│ │ • Route handling│  │ • Business logic│  │                 │             │
│ │ • Auth validation│  │ • Data access   │  │ • WebSockets    │             │
│ │ • Rate limiting │  │ • Validation    │  │ • Pub/Sub       │             │
│ │ • Request/Resp  │  │ • Transactions  │  │ • Live updates  │             │
│ │   transformation│  │                 │  │                 │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│          │                    │                    │                       │
│          └────────────────────┼────────────────────┘                       │
│                               │                                            │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │  Background     │  │  External       │  │  Storage &      │             │
│ │  Services       │  │  Integrations   │  │  Cache Layer    │             │
│ │                 │  │                 │  │                 │             │
│ │ • Scheduled jobs│  │ • Social APIs   │  │ • PostgreSQL    │             │
│ │ • Data sync     │  │ • Maps APIs     │  │ • Redis Cache   │             │
│ │ • Notifications │  │ • Calendar APIs │  │ • File Storage  │             │
│ │ • Content proc  │  │ • Weather APIs  │  │ • Search Index  │             │
│ │                 │  │                 │  │                 │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **🎯 Backend Service Responsibilities**
```typescript
// Backend Service Organization
interface BackendServices {
  apiGateway: {
    routing: 'Next.js API Routes';
    authentication: 'JWT validation';
    authorization: 'RLS + custom policies';
    rateLimit: '100 req/min per user';
    validation: 'Request/response schemas';
    errorHandling: 'Centralized error management';
  };
  
  coreServices: {
    blocoService: 'CRUD + business logic';
    eventService: 'Event management + URL generation';
    userService: 'Profile + preferences + social';
    searchService: 'Full-text + filtering';
    locationService: 'Real-time location sharing';
    chatService: 'Messaging + rooms + moderation';
  };
  
  backgroundServices: {
    syncService: 'External API data sync';
    notificationService: 'Push + email + in-app';
    analyticsService: 'Usage tracking + insights';
    contentModerationService: 'UGC safety';
  };
  
  externalIntegrations: {
    socialMediaAPIs: 'Instagram + YouTube + Spotify';
    mapsAPIs: 'OSM + Google Maps';
    calendarAPIs: 'Google Calendar + iCal';
    weatherAPIs: 'Event weather forecasts';
  };
}
```

---

## **2. Authentication & Authorization Architecture**

### **🔐 Multi-Layer Authentication System**
```
Authentication Flow Architecture:

┌─────────────────────────────────────────────────────────────────────────────┐
│                       AUTHENTICATION LAYERS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Layer 1: Identity Providers                                                │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ Social OAuth    │  │ Email/Password  │  │ Magic Links     │             │
│ │                 │  │                 │  │                 │             │
│ │ • Google        │  │ • Direct signup │  │ • Passwordless  │             │
│ │ • Facebook      │  │ • Local auth    │  │ • Email verify  │             │
│ │ • Instagram     │  │ • Password      │  │ • Phone verify  │             │
│ │                 │  │   reset         │  │                 │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│          │                    │                    │                       │
│          └────────────────────┼────────────────────┘                       │
│                               ▼                                            │
│ Layer 2: Supabase Auth Service                                            │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • JWT Token Generation & Validation                                     │ │
│ │ • Session Management (refresh tokens)                                   │ │
│ │ • User Identity Unification                                             │ │
│ │ • Security Policies & Rate Limiting                                     │ │
│ │ • Multi-factor Authentication (future)                                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                               ▼                                            │
│ Layer 3: Application Authorization                                         │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ Role-Based      │  │ Resource-Based  │  │ Context-Based   │             │
│ │ Access Control  │  │ Permissions     │  │ Authorization   │             │
│ │                 │  │                 │  │                 │             │
│ │ • User roles    │  │ • Own data      │  │ • Location      │             │
│ │ • Admin levels  │  │ • Friend data   │  │ • Time-based    │             │
│ │ • Bloco mgmt    │  │ • Public data   │  │ • Event context │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **🛡️ Row Level Security (RLS) Implementation**
```sql
-- Comprehensive RLS Policies for Carnival Platform

-- 1. User Profile Security
CREATE POLICY "Users can view public profiles"
ON user_profiles FOR SELECT
USING (
  profile_visibility = 'public' OR 
  (profile_visibility = 'friends' AND 
   auth.uid() IN (
     SELECT addressee_id FROM user_connections 
     WHERE requester_id = user_profiles.id AND status = 'accepted'
     UNION
     SELECT requester_id FROM user_connections 
     WHERE addressee_id = user_profiles.id AND status = 'accepted'
   )) OR
  auth.uid() = id
);

-- 2. Bloco Content Security
CREATE POLICY "Users can view published blocos"
ON blocos FOR SELECT
USING (NOT is_draft OR auth.uid() IN (
  SELECT user_id FROM bloco_managers WHERE bloco_id = blocos.id
));

-- 3. Event Management Security
CREATE POLICY "Bloco managers can edit their events"
ON events FOR ALL
USING (auth.uid() IN (
  SELECT bm.user_id FROM bloco_managers bm
  WHERE bm.bloco_id = events.bloco_id
)) WITH CHECK (auth.uid() IN (
  SELECT bm.user_id FROM bloco_managers bm
  WHERE bm.bloco_id = events.bloco_id
));

-- 4. Location Sharing Privacy
CREATE POLICY "Location sharing respects privacy settings"
ON user_locations FOR SELECT
USING (
  user_id = auth.uid() OR -- Own location
  session_id IN (
    SELECT id FROM user_location_sessions 
    WHERE visibility = 'public' OR
    (visibility = 'friends' AND user_id IN (
      SELECT friend_id FROM user_friends WHERE user_id = auth.uid()
    )) OR
    (visibility = 'specific_users' AND auth.uid() = ANY(shared_with_users))
  )
);

-- 5. Chat Message Security
CREATE POLICY "Chat participants can access messages"
ON chat_messages FOR ALL
USING (room_id IN (
  SELECT room_id FROM chat_participants 
  WHERE user_id = auth.uid()
));

-- 6. User Generated Content Moderation
CREATE POLICY "Moderated content visibility"
ON user_generated_content FOR SELECT
USING (
  moderation_status = 'approved' OR
  author_id = auth.uid() OR
  auth.uid() IN (SELECT user_id FROM content_moderators)
);
```

### **🔑 Advanced Authorization Patterns**
```typescript
// Backend Authorization Service
class AuthorizationService {
  // Context-aware authorization
  async canAccessEvent(userId: string, eventId: string): Promise {
    const event = await this.getEvent(eventId);
    
    // Public events are accessible to all
    if (!event.isDraft) return true;
    
    // Draft events only to bloco managers
    return await this.isBlocoManager(userId, event.blocoId);
  }
  
  // Location sharing authorization
  async canViewLocation(viewerId: string, targetUserId: string): Promise {
    const session = await this.getActiveLocationSession(targetUserId);
    if (!session) return false;
    
    switch (session.visibility) {
      case 'public':
        return true;
      case 'friends':
        return await this.areFriends(viewerId, targetUserId);
      case 'specific_users':
        return session.sharedWithUsers.includes(viewerId);
      default:
        return false;
    }
  }
  
  // Dynamic permission checking
  async checkPermission(
    userId: string, 
    resource: string, 
    action: string, 
    context?: any
  ): Promise {
    const userRoles = await this.getUserRoles(userId);
    const permissions = await this.getPermissions(userRoles);
    
    // Check direct permissions
    if (permissions.includes(`${resource}:${action}`)) {
      return true;
    }
    
    // Check contextual permissions
    return await this.checkContextualPermission(
      userId, 
      resource, 
      action, 
      context
    );
  }
}
```

---

## **3. Real-time Services Architecture**

### **⚡ WebSocket & Real-time Infrastructure**
```
Real-time Architecture:

┌─────────────────────────────────────────────────────────────────────────────┐
│                        REAL-TIME INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Client Layer                                                               │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ Web Clients     │  │ Mobile Apps     │  │ Admin Dashboards│             │
│ │                 │  │                 │  │                 │             │
│ │ • WebSocket     │  │ • Native WS     │  │ • Management    │             │
│ │ • Auto-reconnect│  │ • Background    │  │ • Monitoring    │             │
│ │ • State sync    │  │ • Push fallback │  │ • Real-time     │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│          │                    │                    │                       │
│          └────────────────────┼────────────────────┘                       │
│                               ▼                                            │
│ Connection Management Layer                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • WebSocket Connection Pool                                             │ │
│ │ • Authentication & Authorization                                        │ │
│ │ • Rate Limiting (100 messages/minute)                                   │ │
│ │ • Connection Health Monitoring                                          │ │
│ │ • Auto-reconnection & Backoff                                           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                               ▼                                            │
│ Message Processing Layer                                                   │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ Location Update │  │ Chat Messages   │  │ Event Updates   │             │
│ │                 │  │                 │  │                 │             │
│ │ • GPS coord     │  │ • Text/media    │  │ • Status change │             │
│ │ • Privacy check │  │ • Room mgmt     │  │ • Schedule      │             │
│ │ • Friend notify │  │ • Moderation    │  │ • Cancellation  │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│          │                    │                    │                       │
│          └────────────────────┼────────────────────┘                       │
│                               ▼                                            │
│ Supabase Real-time Engine                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • PostgreSQL LISTEN/NOTIFY                                              │ │
│ │ • Real-time subscriptions                                               │ │
│ │ • Row-level security enforcement                                        │ │
│ │ • Message broadcasting                                                  │ │
│ │ • Presence tracking                                                     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **📍 Location Sharing Service Implementation**
```typescript
// Real-time Location Service
class LocationSharingService {
  private supabase: SupabaseClient;
  private redisClient: RedisClient;
  
  // Start location sharing session
  async startLocationSession(
    userId: string, 
    sessionData: LocationSessionConfig
  ): Promise {
    // Create session in database
    const session = await this.supabase
      .from('user_location_sessions')
      .insert({
        user_id: userId,
        session_name: sessionData.name,
        expires_at: sessionData.expiresAt,
        visibility: sessionData.visibility,
        shared_with_users: sessionData.sharedWithUsers
      })
      .select()
      .single();
    
    // Set up Redis for fast lookups
    await this.redisClient.setex(
      `location_session:${session.id}`,
      3600, // 1 hour TTL
      JSON.stringify(session)
    );
    
    // Subscribe to location updates
    this.subscribeToLocationUpdates(session.id);
    
    return session.id;
  }
  
  // Update user location
  async updateLocation(
    sessionId: string,
    locationData: LocationUpdate
  ): Promise {
    // Validate session
    const session = await this.getLocationSession(sessionId);
    if (!session || session.expires_at  {
    const authorizedUsers = await this.getAuthorizedUsers(session);
    
    // Use Supabase real-time to broadcast
    await this.supabase
      .channel(`location_updates:${session.id}`)
      .send({
        type: 'location_update',
        payload: {
          userId: session.user_id,
          coordinates: locationData.coordinates,
          timestamp: new Date().toISOString(),
          batteryLevel: locationData.batteryLevel
        }
      });
    
    // Check for proximity alerts
    await this.checkProximityAlerts(session.user_id, locationData.coordinates);
  }
  
  // Proximity detection for friends
  private async checkProximityAlerts(
    userId: string,
    coordinates: Coordinates
  ): Promise {
    const nearbyFriends = await this.findNearbyFriends(userId, coordinates, 100); // 100m radius
    
    for (const friend of nearbyFriends) {
      // Send proximity notification
      await this.notificationService.sendProximityAlert(
        friend.id,
        userId,
        this.calculateDistance(coordinates, friend.coordinates)
      );
    }
  }
}
```

### **💬 Chat Service Implementation**
```typescript
// Real-time Chat Service
class ChatService {
  // Send message with real-time broadcasting
  async sendMessage(
    roomId: string,
    senderId: string,
    messageData: MessageInput
  ): Promise {
    // Validate user can send to room
    await this.validateRoomAccess(roomId, senderId);
    
    // Content moderation
    const moderatedContent = await this.moderateContent(messageData.content);
    
    // Store message
    const message = await this.supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        content: moderatedContent.content,
        message_type: messageData.type,
        metadata: messageData.metadata
      })
      .select(`
        *,
        sender:user_profiles(display_name, avatar_url)
      `)
      .single();
    
    // Real-time broadcast to room participants
    await this.broadcastMessage(roomId, message);
    
    // Update last activity
    await this.updateRoomActivity(roomId);
    
    // Send push notifications to offline users
    await this.sendMessageNotifications(roomId, message, senderId);
    
    return message;
  }
  
  // Real-time message broadcasting
  private async broadcastMessage(roomId: string, message: Message): Promise {
    await this.supabase
      .channel(`chat_room:${roomId}`)
      .send({
        type: 'new_message',
        payload: message
      });
  }
  
  // Content moderation service
  private async moderateContent(content: string): Promise {
    // Basic content filtering
    const flaggedWords = await this.getFlaggedWords();
    const hasFlaggedContent = flaggedWords.some(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasFlaggedContent) {
      // Log for manual review
      await this.logContentForReview(content);
      
      // Return sanitized content
      return {
        content: this.sanitizeContent(content, flaggedWords),
        requiresReview: true
      };
    }
    
    return {
      content: content,
      requiresReview: false
    };
  }
}
```

---

## **4. Background Services & Job Processing**

### **⏰ Background Job Architecture**
```
Background Job Processing:

┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKGROUND SERVICES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Scheduled Jobs (Cron-based)                                               │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ Data Sync       │  │ Notifications   │  │ Cleanup Tasks   │             │
│ │                 │  │                 │  │                 │             │
│ │ • Social media  │  │ • Event remind  │  │ • Old locations │             │
│ │   Every 4h      │  │ • Daily digest  │  │ • Expired sess  │             │
│ │ • Weather data  │  │ • Weekly summary│  │ • Temp files    │             │
│ │   Every 1h      │  │ • Push delivery │  │ • Cache cleanup │             │
│ │ • Cache refresh │  │                 │  │                 │             │
│ │   Every 30m     │  │                 │  │                 │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│ Event-Driven Jobs (Trigger-based)                                         │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│ │ User Actions    │  │ Content Changes │  │ System Events   │             │
│ │                 │  │                 │  │                 │             │
│ │ • New user      │  │ • Bloco update  │  │ • Error spikes  │             │
│ │ • Follow bloco  │  │ • Event create  │  │ • High traffic  │             │
│ │ • Save event    │  │ • Blog publish  │  │ • API failures  │             │
│ │ • Share content │  │                 │  │                 │             │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│ Processing Queue                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Job Queue Manager (Redis + Supabase Edge Functions)                    │ │
│ │                                                                         │ │
│ │ • High Priority: Real-time notifications, critical updates             │ │
│ │ • Medium Priority: Data sync, content processing                       │ │
│ │ • Low Priority: Analytics, cleanup, non-urgent tasks                   │ │
│ │                                                                         │ │
│ │ • Retry Logic: Exponential backoff for failed jobs                     │ │
│ │ • Dead Letter Queue: Manual intervention for persistent failures       │ │
│ │ • Monitoring: Job status, performance metrics, error tracking          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **🔄 Data Synchronization Service**
```typescript
// External Data Sync Service
class DataSyncService {
  private scheduledJobs: Map = new Map();
  
  // Initialize all sync jobs
  async initializeSyncJobs(): Promise {
    // Social media sync (every 4 hours)
    this.scheduledJobs.set('social_sync', 
      new CronJob('0 */4 * * *', () => this.syncSocialMediaData())
    );
    
    // Weather data sync (every hour)
    this.scheduledJobs.set('weather_sync',
      new CronJob('0 * * * *', () => this.syncWeatherData())
    );
    
    // Cache refresh (every 30 minutes)
    this.scheduledJobs.set('cache_refresh',
      new CronJob('*/30 * * * *', () => this.refreshCaches())
    );
    
    // Start all jobs
    this.scheduledJobs.forEach(job => job.start());
  }
  
  // Social media data synchronization
  private async syncSocialMediaData(): Promise {
    const blocos = await this.getBlocosWithSocialLinks();
    const promises = blocos.map(bloco => this.syncBlocoSocialData(bloco));
    
    // Process in batches to respect API rate limits
    const results = await this.processBatch(promises, 10);
    
    // Log sync results
    await this.logSyncResults('social_media', results);
  }
  
  // Sync individual bloco social data
  private async syncBlocoSocialData(bloco: Bloco): Promise {
    try {
      const socialData: any = {};
      
      // Instagram data
      if (bloco.instagramUrl) {
        socialData.instagram = await this.instagramAPI.getPosts(
          this.extractUsername(bloco.instagramUrl),
          { limit: 12 }
        );
      }
      
      // YouTube data
      if (bloco.youtubeChannelUrl) {
        socialData.youtube = await this.youtubeAPI.getChannelVideos(
          this.extractChannelId(bloco.youtubeChannelUrl),
          { limit: 6 }
        );
      }
      
      // Spotify data
      if (bloco.spotifyProfileUrl) {
        socialData.spotify = await this.spotifyAPI.getArtistTopTracks(
          this.extractArtistId(bloco.spotifyProfileUrl)
        );
      }
      
      // Store in cache for fast access
      await this.cacheSocialData(bloco.id, socialData);
      
      return { 
        blocoId: bloco.id, 
        status: 'success', 
        dataTypes: Object.keys(socialData) 
      };
      
    } catch (error) {
      await this.logSyncError(bloco.id, error);
      return { 
        blocoId: bloco.id, 
        status: 'error', 
        error: error.message 
      };
    }
  }
  
  // Weather data for upcoming events
  private async syncWeatherData(): Promise {
    const upcomingEvents = await this.getUpcomingEvents(7); // Next 7 days
    
    for (const event of upcomingEvents) {
      if (event.coordinates) {
        try {
          const weather = await this.weatherAPI.getForecast(
            event.coordinates.lat,
            event.coordinates.lng,
            event.startDatetime
          );
          
          await this.cacheWeatherData(event.id, weather);
        } catch (error) {
          console.error(`Weather sync failed for event ${event.id}:`, error);
        }
      }
    }
  }
}
```

### **📧 Notification Service**
```typescript
// Comprehensive Notification Service
class NotificationService {
  // Send notification with multiple channels
  async sendNotification(
    userId: string,
    notification: NotificationData
  ): Promise {
    // Get user preferences
    const userPrefs = await this.getUserNotificationPreferences(userId);
    
    // Store notification in database
    const dbNotification = await this.storeNotification(userId, notification);
    
    // Send via enabled channels
    const promises: Promise[] = [];
    
    if (userPrefs.pushNotifications) {
      promises.push(this.sendPushNotification(userId, notification));
    }
    
    if (userPrefs.emailNotifications && notification.priority !== 'low') {
      promises.push(this.sendEmailNotification(userId, notification));
    }
    
    // Real-time in-app notification
    promises.push(this.sendRealtimeNotification(userId, dbNotification));
    
    // Execute all notifications
    await Promise.allSettled(promises);
    
    // Track delivery
    await this.trackNotificationDelivery(dbNotification.id);
  }
  
  // Event reminder notifications
  async scheduleEventReminders(): Promise {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get events happening tomorrow
    const upcomingEvents = await this.getEventsByDate(tomorrow);
    
    for (const event of upcomingEvents) {
      // Get users who saved this event
      const interestedUsers = await this.getUsersInterestedInEvent(event.id);
      
      for (const user of interestedUsers) {
        await this.sendNotification(user.id, {
          type: 'event_reminder',
          title: 'Evento amanhã!',
          message: `${event.title} acontece amanhã às ${event.startTime}`,
          data: {
            eventId: event.id,
            blocoId: event.blocoId,
            eventTitle: event.title
          },
          priority: 'medium'
        });
      }
    }
  }
  
  // Proximity alerts for friends
  async sendProximityAlert(
    userId: string,
    friendId: string,
    distance: number
  ): Promise {
    const friend = await this.getUserProfile(friendId);
    
    await this.sendNotification(userId, {
      type: 'friend_proximity',
      title: 'Amigo por perto!',
      message: `${friend.displayName} está a ${distance}m de você`,
      data: {
        friendId: friendId,
        distance: distance
      },
      priority: 'high'
    });
  }
}
```

---

## **5. External API Integration Layer**

### **🌐 API Integration Architecture**
```typescript
// Centralized External API Manager
class ExternalAPIManager {
  private apiClients: Map = new Map();
  private rateLimiters: Map = new Map();
  private circuitBreakers: Map = new Map();
  
  constructor() {
    this.initializeAPIs();
  }
  
  // Initialize all external APIs
  private initializeAPIs(): void {
    // Instagram API
    this.apiClients.set('instagram', new InstagramAPI({
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      rateLimit: { requests: 200, window: 3600 } // 200 req/hour
    }));
    
    // YouTube API
    this.apiClients.set('youtube', new YouTubeAPI({
      apiKey: process.env.YOUTUBE_API_KEY,
      rateLimit: { requests: 10000, window: 86400 } // 10k req/day
    }));
    
    // Spotify API
    this.apiClients.set('spotify', new SpotifyAPI({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      rateLimit: { requests: 100, window: 60 } // 100 req/minute
    }));
    
    // Google Maps API
    this.apiClients.set('googlemaps', new GoogleMapsAPI({
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      rateLimit: { requests: 40000, window: 86400 } // 40k req/day
    }));
    
    // Weather API
    this.apiClients.set('weather', new WeatherAPI({
      apiKey: process.env.WEATHER_API_KEY,
      rateLimit: { requests: 1000, window: 86400 } // 1k req/day
    }));
  }
  
  // Enhanced API call with resilience patterns
  async callAPI(
    service: string,
    endpoint: string,
    params?: any,
    options?: APICallOptions
  ): Promise {
    const client = this.apiClients.get(service);
    if (!client) {
      throw new Error(`API client not found: ${service}`);
    }
    
    // Check rate limits
    await this.checkRateLimit(service);
    
    // Circuit breaker pattern
    const circuitBreaker = this.getCircuitBreaker(service);
    
    try {
      const result = await circuitBreaker.execute(async () => {
        return await client.call(endpoint, params, options);
      });
      
      // Cache successful responses
      if (options?.cache) {
        await this.cacheAPIResponse(service, endpoint, params, result);
      }
      
      return result;
      
    } catch (error) {
      // Log API errors for monitoring
      await this.logAPIError(service, endpoint, error);
      
      // Return cached data if available
      if (options?.fallbackToCache) {
        const cached = await this.getCachedAPIResponse(service, endpoint, params);
        if (cached) return cached;
      }
      
      throw error;
    }
  }
  
  // Rate limiting implementation
  private async checkRateLimit(service: string): Promise {
    const limiter = this.rateLimiters.get(service);
    if (limiter) {
      const allowed = await limiter.checkLimit();
      if (!allowed) {
        throw new Error(`Rate limit exceeded for ${service}`);
      }
    }
  }
  
  // Circuit breaker for API resilience
  private getCircuitBreaker(service: string): CircuitBreaker {
    if (!this.circuitBreakers.has(service)) {
      this.circuitBreakers.set(service, new CircuitBreaker({
        timeout: 10000, // 10 second timeout
        errorThreshold: 5, // Open after 5 failures
        resetTimeout: 60000 // Reset after 1 minute
      }));
    }
    return this.circuitBreakers.get(service)!;
  }
}
```

### **📱 Social Media Integration Service**
```typescript
// Instagram Integration Service
class InstagramIntegrationService {
  // Fetch and process Instagram posts
  async fetchBlocoPosts(
    instagramUrl: string,
    options: { limit?: number; refresh?: boolean } = {}
  ): Promise {
    const username = this.extractUsername(instagramUrl);
    const cacheKey = `instagram:${username}`;
    
    // Check cache first (unless refresh requested)
    if (!options.refresh) {
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }
    
    try {
      // Fetch from Instagram API
      const posts = await this.apiManager.callAPI('instagram', 'user_media', {
        username: username,
        fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink',
        limit: options.limit || 12
      }, {
        cache: true,
        fallbackToCache: true
      });
      
      // Process and enhance posts
      const processedPosts = await this.processPosts(posts.data);
      
      // Cache for 4 hours
      await this.redis.setex(cacheKey, 14400, JSON.stringify(processedPosts));
      
      return processedPosts;
      
    } catch (error) {
      console.error('Instagram fetch failed:', error);
      
      // Return empty array or cached data
      const cached = await this.redis.get(cacheKey);
      return cached ? JSON.parse(cached) : [];
    }
  }
  
  // Process and enhance Instagram posts
  private async processPosts(posts: any[]): Promise {
    return posts.map(post => ({
      id: post.id,
      imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      videoUrl: post.media_type === 'VIDEO' ? post.media_url : null,
      caption: this.truncateCaption(post.caption),
      timestamp: post.timestamp,
      likesCount: post.like_count,
      commentsCount: post.comments_count,
      permalink: post.permalink,
      mediaType: post.media_type.toLowerCase()
    }));
  }
}
```

---

## **6. Data Processing & Analytics**

### **📊 Analytics & Metrics Collection**
```typescript
// Analytics Service for Carnival Platform
class AnalyticsService {
  // Track user events
  async trackEvent(
    userId: string | null,
    event: AnalyticsEvent
  ): Promise {
    const eventData = {
      userId: userId,
      sessionId: event.sessionId,
      eventName: event.name,
      properties: event.properties,
      timestamp: new Date().toISOString(),
      userAgent: event.userAgent,
      ip: event.ip,
      country: event.country,
      city: event.city
    };
    
    // Store in analytics database
    await this.supabase
      .from('analytics_events')
      .insert(eventData);
    
    // Send to external analytics (PostHog, etc.)
    await this.postHogClient.capture({
      distinctId: userId || event.sessionId,
      event: event.name,
      properties: event.properties
    });
    
    // Update real-time metrics
    await this.updateRealTimeMetrics(event);
  }
  
  // Track carnival-specific metrics
  async trackCarnivalMetrics(): Promise {
    const metrics = {
      // Event metrics
      totalEvents: await this.countActiveEvents(),
      todaysEvents: await this.countEventsByDate(new Date()),
      popularBlocos: await this.getPopularBlocos(10),
      
      // User engagement
      activeUsers: await this.countActiveUsers(24), // Last 24h
      locationSharingUsers: await this.countLocationSharingUsers(),
      chatActiveUsers: await this.countChatActiveUsers(),
      
      // Real-time carnival activity
      liveEvents: await this.countLiveEvents(),
      proximityAlerts: await this.countProximityAlerts(),
      socialShares: await this.countSocialShares()
    };
    
    // Store metrics
    await this.storeMetrics('carnival_dashboard', metrics);
  }
  
  // Generate insights for bloco organizers
  async generateBlocoInsights(blocoId: string): Promise {
    const insights = {
      followers: {
        total: await this.getBlocoFollowerCount(blocoId),
        growth: await this.getBlocoFollowerGrowth(blocoId, 30), // Last 30 days
        demographics: await this.getBlocoFollowerDemographics(blocoId)
      },
      
      events: {
        totalEvents: await this.getBlocoEventCount(blocoId),
        averageAttendance: await this.getBlocoAverageAttendance(blocoId),
        upcomingEvents: await this.getBlocoUpcomingEvents(blocoId)
      },
      
      engagement: {
        profileViews: await this.getBlocoProfileViews(blocoId, 30),
        socialClicks: await this.getBlocoSocialClicks(blocoId, 30),
        eventSaves: await this.getBlocoEventSaves(blocoId, 30)
      }
    };
    
    return insights;
  }
}
```

### **🔍 Search & Indexing Service**
```typescript
// Advanced Search Service
class SearchService {
  // Full-text search with ranking
  async search(
    query: string,
    filters: SearchFilters,
    options: SearchOptions
  ): Promise {
    // Build search query
    const searchQuery = this.buildSearchQuery(query, filters);
    
    // Execute parallel searches
    const [blocos, events, articles] = await Promise.all([
      this.searchBlocos(searchQuery, options),
      this.searchEvents(searchQuery, options),
      this.searchArticles(searchQuery, options)
    ]);
    
    // Combine and rank results
    const combinedResults = this.combineAndRankResults(
      blocos, events, articles, query
    );
    
    // Track search for analytics
    await this.trackSearch(query, filters, combinedResults.total);
    
    return combinedResults;
  }
  
  // Intelligent search with PostgreSQL full-text search
  private async searchBlocos(
    query: string,
    options: SearchOptions
  ): Promise[]> {
    const results = await this.supabase
      .from('blocos')
      .select(`
        *,
        cities(name, slug),
        genres:blocos_musical_genres(musical_genres(name)),
        ts_rank_cd(
          to_tsvector('portuguese', name || ' ' || COALESCE(long_description_pt, '')),
          plainto_tsquery('portuguese', $1)
        ) as rank
      `)
      .textSearch('name,long_description_pt', query, {
        type: 'websearch',
        config: 'portuguese'
      })
      .eq('is_draft', false)
      .order('rank', { ascending: false })
      .limit(options.limit || 10);
    
    return results.data?.map(bloco => ({
      item: bloco,
      type: 'bloco',
      relevanceScore: bloco.rank,
      matchedFields: this.identifyMatchedFields(bloco, query)
    })) || [];
  }
  
  // Auto-complete suggestions
  async getSuggestions(
    partialQuery: string,
    options: SuggestionOptions
  ): Promise {
    const suggestions: Suggestion[] = [];
    
    // Bloco name suggestions
    const blocoSuggestions = await this.supabase
      .from('blocos')
      .select('name, slug')
      .ilike('name', `${partialQuery}%`)
      .eq('is_draft', false)
      .limit(5);
    
    suggestions.push(...blocoSuggestions.data?.map(bloco => ({
      text: bloco.name,
      type: 'bloco',
      category: 'Blocos',
      url: `/blocos/${bloco.slug}`
    })) || []);
    
    // City suggestions
    const citySuggestions = await this.supabase
      .from('cities')
      .select('name, slug')
      .ilike('name', `${partialQuery}%`)
      .limit(3);
    
    suggestions.push(...citySuggestions.data?.map(city => ({
      text: city.name,
      type: 'city',
      category: 'Cidades',
      url: `/${city.slug}`
    })) || []);
    
    return suggestions;
  }
}
```
