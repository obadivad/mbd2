# **User Flow Document**
## **Ministério do Bloco - Complete User Journey Mapping**

---

## **1. User Personas**

### **🎭 Primary User Personas**

#### **Maria - The Carnival Enthusiast (Local)**
- **Age:** 28, São Paulo resident
- **Profile:** Regular carnival-goer, follows 15+ blocos
- **Goals:** Discover new blocos, plan carnival schedule, meet friends
- **Devices:** Mobile-first (80%), desktop for planning
- **Peak Usage:** January-March, weekends

#### **João - The Tourist Explorer**
- **Age:** 35, visiting Rio for first carnival
- **Profile:** International tourist, limited Portuguese
- **Goals:** Understand carnival culture, find beginner-friendly events
- **Devices:** Mobile only, needs offline capabilities
- **Peak Usage:** 1-2 weeks during carnival season

#### **Ana - The Social Connector**
- **Age:** 24, university student in Salvador
- **Profile:** Highly social, organizes group carnival activities
- **Goals:** Coordinate with friends, share experiences, discover parties
- **Devices:** Mobile primarily, heavy social feature usage
- **Peak Usage:** Year-round for planning, intensive during carnival

#### **Carlos - The Bloco Organizer**
- **Age:** 42, manages medium-sized bloco in Recife
- **Profile:** Content creator, wants to promote events
- **Goals:** Manage bloco profile, announce events, grow following
- **Devices:** Desktop for management, mobile for updates
- **Peak Usage:** Year-round with spikes during carnival preparation

---

## **2. Core User Journeys**

### **🎯 Journey 1: First-Time Discovery (Tourist)**

#### **Entry Points**
```
🌐 DISCOVERY CHANNELS:
├── Google Search: "carnival rio de janeiro 2025"
├── Social Media: Instagram/TikTok carnival content
├── Travel Blogs: "Rio carnival guide"
├── Tourism Websites: Hotel/agency recommendations
└── Word of Mouth: Friends' recommendations
```

#### **Homepage Landing Experience**
```
🏠 HOMEPAGE FLOW:

1. Landing (/en or auto-detected language)
   ├── Hero: "Discover Brazil's Carnival Magic"
   ├── City Quick Selector: "Where are you going?"
   ├── Carnival Countdown: "18 days until Rio Carnival"
   └── Featured Content Preview

2. City Selection
   ├── User clicks "Rio de Janeiro"
   ├── Redirect to: /en/rio-de-janeiro
   └── City-specific carnival homepage

3. City Homepage (/en/rio-de-janeiro)
   ├── "Rio Carnival 2025 Guide"
   ├── Top 10 Blocos for Beginners
   ├── This Weekend's Events
   ├── Interactive Map Preview
   └── "Plan Your Carnival" CTA
```

#### **Bloco Discovery Flow**
```
🎭 BLOCO DISCOVERY:

Step 1: Browse Blocos
└── /en/rio-de-janeiro/blocos
    ├── Filter by: "Beginner Friendly"
    ├── Sort by: "Most Popular"
    ├── Language: English descriptions
    └── Clear difficulty indicators

Step 2: Bloco Detail
└── /en/rio-de-janeiro/blocos/cordao-da-bola-preta
    ├── "What to Expect" section
    ├── Upcoming events preview
    ├── Instagram feed embedded
    ├── "Add to My Carnival Plan" button
    └── Related beginner-friendly blocos

Step 3: Event Details
└── /en/rio-de-janeiro/events/2025-02-15/parade/cordao-da-bola-preta
    ├── Event timeline with metro info
    ├── "What to bring" checklist
    ├── Weather forecast
    ├── Export to Google Calendar
    └── Share with travel companions
```

### **🎯 Journey 2: Carnival Planning (Local Enthusiast)**

#### **Returning User Flow**
```
📱 MOBILE APP EXPERIENCE:

1. App Launch
   ├── Personalized feed: Followed blocos updates
   ├── "This Weekend" quick access
   ├── Location-based suggestions
   └── Friends' recent activity

2. Event Discovery
   ├── Browse by date: Calendar view
   ├── Filter by followed blocos
   ├── Distance from current location
   └── Friends attending indicators

3. Agenda Management
   ├── Personal carnival calendar
   ├── Conflict detection: "2 events same time"
   ├── Travel time calculations
   ├── Reminder preferences
   └── Share agenda with friends

4. Real-time Updates
   ├── Event changes notifications
   ├── Weather alerts
   ├── Traffic/metro updates
   └── Friend location sharing
```

#### **Desktop Planning Session**
```
💻 DESKTOP EXPERIENCE:

1. Advanced Planning (/pt/rio-de-janeiro/eventos/calendario)
   ├── Month view: February 2025
   ├── Multiple event types filter
   ├── Drag & drop to personal agenda
   ├── Print carnival schedule
   └── Export to various calendar apps

2. Detailed Research
   ├── Compare multiple blocos
   ├── Read full event descriptions
   ├── Check social media feeds
   ├── Read reviews/comments
   └── Plan route optimization

3. Social Coordination
   ├── Create group for carnival squad
   ├── Share potential events for voting
   ├── Coordinate meeting points
   ├── Set up location sharing
   └── Plan pre/post-carnival activities
```

### **🎯 Journey 3: Real-time Carnival Experience**

#### **Day-of-Event Flow**
```
🎪 LIVE CARNIVAL DAY:

Morning Preparation (8:00 AM)
├── Check today's agenda
├── Weather & outfit suggestions
├── Metro/bus route updates
├── Battery optimization tips
└── Share location with friends

Pre-Event (11:00 AM)
├── Navigate to concentration point
├── Real-time crowd density
├── Friend finder: "Ana is 50m away"
├── Live event updates
└── Last-minute event changes

During Event (2:00 PM)
├── Live location sharing
├── Photo/video sharing to feed
├── Find nearby friends on map
├── Discover nearby food/drinks
├── Rate ongoing experience
└── Emergency contact access

Post-Event (6:00 PM)
├── Share photos/memories
├── Rate bloco performance
├── Discover tonight's after-parties
├── Plan next event travel
└── Recharge location sharing
```

---

## **3. Feature-Specific User Flows**

### **🔐 Authentication & Onboarding**

#### **Sign-up Flow**
```
📝 USER REGISTRATION:

Entry Point
├── "Join the Carnival Community"
├── Social login options (Google, Facebook, Instagram)
└── Email registration

Onboarding Wizard
├── Step 1: Language preference
├── Step 2: Location/Cities of interest
├── Step 3: Carnival experience level
├── Step 4: Music preferences
├── Step 5: Notification preferences
└── Step 6: Follow suggested blocos

Profile Completion
├── Upload profile photo
├── Write bio (optional)
├── Connect social accounts
├── Invite friends
└── Complete first action (follow bloco/save event)
```

#### **Returning User Recognition**
```
🔄 RETURNING USER FLOW:

Login Detection
├── Auto-login via saved credentials
├── Personalized welcome message
├── "What's new since your last visit"
├── Updated followed blocos content
└── Location-based suggestions

Seasonal Recognition
├── "Welcome back for Carnival 2025!"
├── "Here's what changed in your favorite blocos"
├── Updated calendar with new events
├── Friends who joined recently
└── New features announcement
```

### **🎭 Bloco Following & Discovery**

#### **Bloco Discovery Algorithm**
```
🎯 PERSONALIZED DISCOVERY:

Discovery Factors
├── User location & preferred cities
├── Previously followed blocos
├── Music genre preferences
├── Event attendance history
├── Friends' activity
├── Trending blocos
└── Seasonal popularity

Recommendation Display
├── "Because you followed [Bloco X]"
├── "Popular in [User's City]"
├── "Your friends are following"
├── "Rising stars this season"
├── "Based on your music taste"
└── "New blocos in your area"
```

#### **Bloco Following Flow**
```
💖 FOLLOW/UNFOLLOW PROCESS:

Follow Action
├── Click follow button
├── Instant notification setup
├── Add to personal feed
├── Calendar sync (optional)
├── Social sharing (optional)
└── Suggestion of similar blocos

Notification Settings
├── All events (default)
├── Major events only
├── Emergency changes only
├── Weekly digest
├── Push notifications toggle
└── Email preferences
```

### **📅 Event Management & Calendar**

#### **Event Save & Export Flow**
```
💾 EVENT MANAGEMENT:

Save to Agenda
├── One-click save from event page
├── Conflict detection & resolution
├── Automatic travel time calculation
├── Reminder settings
├── Privacy settings (public/private)
└── Share with friends option

Calendar Integration
├── Export to Google Calendar
├── iCal download for other apps
├── Sync with phone calendar
├── Regular sync updates
├── Calendar conflict warnings
└── Multi-device synchronization

Smart Suggestions
├── "Events you might like nearby"
├── "Similar events different dates"
├── "Friends are attending"
├── "Before/after this event"
└── "Complete your carnival day"
```

### **👥 Social Features & Connections**

#### **Friend Connection Flow**
```
🤝 SOCIAL CONNECTION:

Friend Discovery
├── Import from contacts
├── Facebook/Instagram friends
├── Mutual bloco followers
├── Location-based suggestions
├── QR code sharing
└── Username search

Connection Process
├── Send friend request
├── Request acceptance
├── Privacy settings setup
├── Notification preferences
├── Location sharing consent
└── Activity feed integration

Group Features
├── Create carnival squad
├── Invite friends to group
├── Group event planning
├── Shared location sessions
├── Group chat creation
└── Collective agenda building
```

#### **Location Sharing Flow**
```
📍 LOCATION SHARING:

Session Setup
├── "Share Location for Carnival Day"
├── Duration selection (1-12 hours)
├── Privacy level (friends/specific people)
├── Battery optimization settings
├── Emergency contact setup
└── Group session invitation

Active Sharing
├── Real-time location updates
├── Battery level monitoring
├── Friend proximity alerts
├── Venue check-ins
├── Photo/status sharing
└── Emergency features

Privacy Controls
├── Pause sharing temporarily
├── Hide from specific people
├── Accuracy level settings
├── History deletion
├── End session anytime
└── Full data control
```

---

## **4. Mobile vs Desktop Experience**

### **📱 Mobile-First Design Priorities**

#### **Mobile Core Features**
```
🚀 MOBILE ESSENTIAL FEATURES:

Primary Actions (One-tap access)
├── Today's events
├── Navigate to event
├── Find friends nearby
├── Quick bloco follow
├── Emergency contacts
└── Share current activity

Optimized Interactions
├── Swipe gestures for navigation
├── Pull-to-refresh content
├── Offline content caching
├── Voice search
├── Camera integration
└── Push notifications

Performance Features
├── Progressive Web App
├── Offline maps
├── Background location (opt-in)
├── Data usage optimization
├── Battery-friendly updates
└── Quick loading prioritization
```

#### **Desktop Enhanced Features**
```
💻 DESKTOP POWER FEATURES:

Advanced Planning
├── Multi-event comparison
├── Detailed calendar views
├── Advanced filtering options
├── Bulk event management
├── Print-friendly schedules
└── Multiple city planning

Content Management
├── Long-form content reading
├── Detailed bloco research
├── Social media integration
├── Content creation tools
├── Admin/organizer features
└── Analytics dashboards
```

---

## **5. Seasonal Usage Patterns**

### **🗓️ Carnival Season (January-March)**

#### **Peak Usage Flow**
```
🎯 HIGH-INTENSITY PERIOD:

Pre-Carnival (January)
├── Event planning surge
├── Bloco research
├── Group formation
├── Calendar building
└── Preparation content

Carnival Week (February)
├── Real-time features peak
├── Location sharing active
├── Live updates critical
├── Emergency features ready
└── Performance optimization

Post-Carnival (March)
├── Memory sharing
├── Content rating
├── Planning next year
├── Community feedback
└── Data insights
```

### **🌱 Off-Season (April-December)**

#### **Engagement Maintenance**
```
📈 YEAR-ROUND ENGAGEMENT:

Quarterly Cycles
├── Bloco rehearsal seasons
├── Off-season events
├── Community building
├── Content discovery
└── Feature development

Content Strategy
├── Historical carnival content
├── Bloco profiles & stories
├── Music discovery
├── Cultural education
└── Planning tools
```

---

## **6. Error Handling & Edge Cases**

### **🚨 Critical User Scenarios**

#### **Network Issues During Carnival**
```
📡 OFFLINE/POOR CONNECTION:

Graceful Degradation
├── Cached event information
├── Offline maps functionality
├── Stored friend locations
├── Emergency contact access
├── Basic navigation tools
└── Data sync when reconnected

User Communication
├── Clear offline indicators
├── Last update timestamps
├── Retry mechanisms
├── Data usage warnings
└── Alternative access methods
```

#### **Emergency Situations**
```
🆘 EMERGENCY PROTOCOLS:

Safety Features
├── Emergency contacts quick dial
├── Location sharing with authorities
├── Medical information access
├── Safe zones mapping
├── Emergency services numbers
└── Multi-language support

Critical Information Priority
├── Safety announcements first
├── Event cancellations
├── Weather warnings
├── Transportation alerts
└── Medical facility locations
```

---

## **7. Accessibility & Inclusivity**

### **♿ Accessibility Features**

#### **Visual Accessibility**
```
👁️ VISUAL SUPPORT:

Design Considerations
├── High contrast mode
├── Large font options
├── Screen reader compatibility
├── Color-blind friendly palette
├── Clear navigation hierarchy
└── Alt text for all images

Content Accessibility
├── Multiple language support
├── Simple language options
├── Audio descriptions
├── Video captions
├── Clear iconography
└── Consistent layouts
```

#### **Motor Accessibility**
```
🤲 MOTOR SUPPORT:

Interaction Design
├── Large touch targets
├── Voice commands
├── Alternative navigation
├── Reduced motion options
├── Simple gesture alternatives
└── Keyboard navigation support
```

---

## **8. Success Metrics & User Goals**

### **📊 User Success Indicators**

#### **Discovery Success**
```
🎯 DISCOVERY METRICS:

New User Success
├── City selection within 30 seconds
├── First bloco followed < 2 minutes
├── First event saved < 5 minutes
├── Return visit within 24 hours
└── Friend connection within first week

Engagement Success
├── 3+ events saved per session
├── 5+ blocos followed total
├── Location sharing activation
├── Calendar export usage
└── Social feature adoption
```

#### **Carnival Day Success**
```
🎪 REAL-TIME SUCCESS:

Event Day Metrics
├── Morning agenda check
├── Navigation to event location
├── Location sharing activation
├── Friend discovery usage
├── Post-event content sharing
└── Next event discovery
```

This comprehensive user flow document maps out every major interaction users will have with your carnival platform, ensuring a smooth, intuitive experience that matches real-world carnival behavior patterns. The flows are designed to be mobile-first while providing enhanced desktop features for detailed planning.

Ready to proceed with the Styling Guide document next!

---
Answer from Perplexity: pplx.ai/share