# Baladia Project - Visual Architecture Diagram

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         BALADIA MUNICIPALITY                             │
│                         Multilingual Platform                            │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           USERS LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  Admin Users              Public Users              Web Visitors         │
│  (Authenticated)          (Authenticated)           (Anonymous)          │
│  • Content Creators       • Registered Users        • Browse Site        │
│  • Editors                • Account Holders         • View Content       │
│  • Administrators         • Subscribers             • Read Data          │
└─────────────────────────────────────────────────────────────────────────┘
                    ↓                      ↓                    ↓

┌─────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│  │   Admin Portal       │  │   Client Site        │  │   Mobile App     │
│  │   (React)            │  │   (React)            │  │   (Future)       │
│  │                      │  │                      │  │                  │
│  │ Routes:              │  │ Routes:              │  │                  │
│  │ • /login             │  │ • /                  │  │                  │
│  │ • /ads               │  │ • /events       ✅NEW│  │                  │
│  │ • /events            │  │ • /persons      ✅NEW│  │                  │
│  │ • /papers            │  │ • /quick-links  ✅NEW│  │                  │
│  │ • /potentials        │  │ • /important... ✅NEW│  │                  │
│  │ • /persons           │  │ • /papers            │  │                  │
│  │ • /quick-links       │  │ • /mayor             │  │                  │
│  │ • /important-numbers │  │ • /contact           │  │                  │
│  │                      │  │                      │  │                  │
│  │ Features:            │  │ Features:            │  │                  │
│  │ • CRUD Forms         │  │ • RTL Support        │  │                  │
│  │ • File Upload        │  │ • Responsive         │  │                  │
│  │ • i18n Support       │  │ • Language Switch    │  │                  │
│  │ • Auth Protected     │  │ • Mobile Optimized   │  │                  │
│  │ • Arabic Keyboard    │  │ • Public Access      │  │                  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘
                    ↓                      ↓
              ┌──────────────────────────────────────┐
              │   HTTP(S) REST API Communication    │
              │     with Sanctum JWT Tokens         │
              └──────────────────────────────────────┘
                              ↓

┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                     Laravel RESTful API                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    API CONTROLLERS (7)                             │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │  AdController          → POST/PUT/DELETE /ads                    │ │
│  │  EventController       → POST/PUT/DELETE /events                 │ │
│  │  PaperController       → POST/PUT/DELETE /papers                 │ │
│  │  PotentialController   → POST/PUT/DELETE /potentials             │ │
│  │  PersonController      → POST/PUT/DELETE /persons                │ │
│  │  QuickLinkController   → POST/PUT/DELETE /quick-links            │ │
│  │  ImportantNumberCtrl   → POST/PUT/DELETE /important-numbers      │ │
│  │                                                                    │ │
│  │  ✅ All resources support:                                        │ │
│  │     • Multilingual data (JSON)                                   │ │
│  │     • File upload endpoints                                      │ │
│  │     • Sanctum authentication                                     │ │
│  │     • Language parameter queries                                 │ │
│  │     • Full CRUD operations                                       │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   AUTHENTICATION                                   │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │  • Login/Register endpoints                                      │ │
│  │  • Token generation (Sanctum)                                    │ │
│  │  • Token validation on protected routes                          │ │
│  │  • Password reset flows                                          │ │
│  │  • CORS configuration                                            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                              ↓

┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    ELOQUENT MODELS (7)                            │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │  Ad              → {id, title{}, description{}, link, type}       │ │
│  │  Event           → {id, status{}, date, description{}, ...}       │ │
│  │  Paper           → {id, slug, title{}, description{}}             │ │
│  │  Potential       → {id, slug, title{}, description{}}             │ │
│  │  Person          → {id, type, names{}, image_url, is_current}     │ │
│  │  QuickLink       → {id, label{}, url}                             │ │
│  │  ImportantNumber → {id, label{}, value}                           │ │
│  │                                                                    │ │
│  │  ✅ All models support:                                            │ │
│  │     • Casting JSON for multilingual data                         │ │
│  │     • Timestamp tracking (created_at, updated_at)                │ │
│  │     • Soft deletes (optional)                                    │ │
│  │     • Eloquent relationships                                     │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   MYSQL DATABASE                                   │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │  Tables:                                                          │ │
│  │  • ads              (id, title, description, link, file_type)    │ │
│  │  • events           (id, status, date, description, ...)         │ │
│  │  • papers           (id, slug, title, description)               │ │
│  │  • potentials       (id, slug, title, description)               │ │
│  │  • persons          (id, type, names, messages, ...)             │ │
│  │  • quick_links      (id, label, url)                             │ │
│  │  • important_numbers (id, label, value)                          │ │
│  │  • users            (id, email, password, ...)                   │ │
│  │                                                                    │ │
│  │  Storage:                                                         │ │
│  │  • /storage/ads/*.{jpg,png,pdf}                                  │ │
│  │  • /storage/persons/*.{jpg,png}                                  │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
SCENARIO: Create a multilingual event

┌──────────────────────────────────────────────────────────────────────┐
│ Admin User                                                            │
│ 1. Fills form with event details                                    │
│    • English status: "Bridge Renovation Complete"                  │
│    • Arabic status: "إكمال تجديد الجسر"                           │
│    • Date: "2024-2025"                                             │
│    • Description (multilingual)                                     │
│    • Select icon and color                                         │
└──────────────────────────────────────────────────────────────────────┘
                                ↓

┌──────────────────────────────────────────────────────────────────────┐
│ Admin Portal (React)                                                  │
│ 2. Form Submission                                                   │
│    {                                                                  │
│      status: {en: "Bridge...", ar: "إكمال..."},                    │
│      date: "2024-2025",                                             │
│      description: {en: "Desc", ar: "الوصف"},                      │
│      icon: "pi pi-check",                                           │
│      color: "#10b981"                                               │
│    }                                                                  │
│    axios.post('/api/events', payload)                               │
└──────────────────────────────────────────────────────────────────────┘
                                ↓

┌──────────────────────────────────────────────────────────────────────┐
│ Backend API (Laravel)                                                 │
│ 3. EventController::store()                                          │
│    • Validate payload                                                │
│    • Create Event model                                              │
│    • Store as JSON in database                                       │
│    • Return 201 Created                                              │
└──────────────────────────────────────────────────────────────────────┘
                                ↓

┌──────────────────────────────────────────────────────────────────────┐
│ Database (MySQL)                                                      │
│ 4. Save Event                                                        │
│    events table:                                                      │
│    ┌──────┬───────────────────────────────────────┬──────────────┐  │
│    │ id   │ status                                │ icon         │  │
│    ├──────┼───────────────────────────────────────┼──────────────┤  │
│    │ 123  │ {"en":"Bridge...","ar":"إكمال..."} │ "pi pi-check" │  │
│    └──────┴───────────────────────────────────────┴──────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                ↓
                           [Event Saved]
                                ↓
┌──────────────────────────────────────────────────────────────────────┐
│ Client Browser (Visitor switching to Arabic)                         │
│ 5. Request Events                                                    │
│    GET /api/events?lang=ar                                          │
│    (Public endpoint, no auth required)                               │
└──────────────────────────────────────────────────────────────────────┘
                                ↓

┌──────────────────────────────────────────────────────────────────────┐
│ Backend API                                                           │
│ 6. EventController::index()                                          │
│    • Get lang parameter: 'ar'                                        │
│    • Query all events                                                │
│    • Extract Arabic value from JSON                                  │
│    • Return localized response                                       │
│    [                                                                  │
│      {                                                                │
│        id: 123,                                                      │
│        status: "إكمال تجديد الجسر",  ← Arabic value               │
│        date: "2024-2025",                                            │
│        icon: "pi pi-check",                                          │
│        color: "#10b981"                                              │
│      }                                                                │
│    ]                                                                  │
└──────────────────────────────────────────────────────────────────────┘
                                ↓

┌──────────────────────────────────────────────────────────────────────┐
│ Client Site (React)                                                   │
│ 7. Display Events                                                    │
│    • Receive event data in Arabic                                    │
│    • Render timeline with Arabic text                               │
│    • Apply RTL layout                                                │
│    • Show icon and color                                             │
│                                                                       │
│    ┌──────────────────────────────────────┐                         │
│    │ إكمال تجديد الجسر      [✓ green]    │                         │
│    │ 2024-2025                            │                         │
│    │ تم إكمال تجديد الجسر بنجاح           │                         │
│    └──────────────────────────────────────┘                         │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Resource Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RESOURCES                                    │
├─────────────────────────────────────────────────────────────────────┤
│
│  ADS (Promotional)
│  ├─ Title (Multilingual)
│  ├─ Description (Multilingual)
│  ├─ File Link (URL)
│  └─ File Type (image|pdf)
│
│  EVENTS (Timeline)
│  ├─ Status (Multilingual)
│  ├─ Date (Timeline)
│  ├─ Description (Multilingual)
│  ├─ Icon (Bootstrap Icon)
│  └─ Color (Hex Value)
│
│  PAPERS (Documents)
│  ├─ Slug (Unique Identifier)
│  ├─ Title (Multilingual)
│  └─ Description (Multilingual)
│
│  POTENTIALS (Resources)
│  ├─ Slug (Unique Identifier)
│  ├─ Title (Multilingual)
│  └─ Description (Multilingual)
│
│  PERSONS (Leadership)
│  ├─ Type (mayor | secretary_general)
│  ├─ Names (Multilingual)
│  ├─ Messages (Multilingual)
│  ├─ Achievements (Multilingual)
│  ├─ Image (URL)
│  ├─ Period (Term)
│  └─ Is Current (Boolean)
│
│  QUICK LINKS (Navigation)
│  ├─ Label (Multilingual)
│  └─ URL (Link)
│
│  IMPORTANT NUMBERS (Contact)
│  ├─ Label (Multilingual)
│  └─ Value (Phone/Contact)
│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                                    │
├─────────────────────────────────────────────────────────────────────┤
│ Framework:        React 18+                                          │
│ Routing:          React Router v6                                    │
│ Styling:          Tailwind CSS + Custom CSS                          │
│ UI Components:    PrimeReact                                          │
│ HTTP Client:      Axios                                              │
│ i18n:             React-i18next                                      │
│ State:            React Hooks                                        │
│ Animation:        Framer Motion                                      │
│ Build Tool:       Vite                                               │
│ Package Mgr:      npm                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND STACK                                     │
├─────────────────────────────────────────────────────────────────────┤
│ Framework:        Laravel 10+                                        │
│ PHP:              8.1+                                               │
│ Database:         MySQL 8+                                           │
│ Auth:             Laravel Sanctum (JWT)                              │
│ ORM:              Eloquent                                           │
│ Migration:        Laravel Migrations                                 │
│ Validation:       Laravel Validator                                  │
│ Storage:          Local filesystem                                   │
│ CORS:             Laravel CORS                                       │
│ Server:           PHP Artisan / Apache / Nginx                       │
│ Package Mgr:      Composer                                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                                    │
├─────────────────────────────────────────────────────────────────────┤
│ Containerization: Docker (optional)                                  │
│ Database:         MySQL (local docker)                               │
│ File Storage:     Local /storage/public/                             │
│ Port (Backend):   8000                                               │
│ Port (Admin):     5173                                               │
│ Port (Client):    5174                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Cycle

```
CLIENT REQUEST
      │
      ↓
┌────────────────────────────────────────┐
│ 1. HTTP Request to Backend API         │
│    GET /api/events?lang=ar             │
│    Headers: {                          │
│      Authorization: Bearer <token>     │
│    }                                    │
└────────────────────────────────────────┘
      │
      ↓
┌────────────────────────────────────────┐
│ 2. Laravel Route Matching              │
│    Route::get('/events', [...])        │
│    Middleware: api, optional auth      │
└────────────────────────────────────────┘
      │
      ↓
┌────────────────────────────────────────┐
│ 3. Controller Method                   │
│    EventController::index()            │
│    • Get lang parameter                │
│    • Query database                    │
│    • Transform data                    │
└────────────────────────────────────────┘
      │
      ↓
┌────────────────────────────────────────┐
│ 4. Database Query                      │
│    SELECT * FROM events;               │
│    Returns JSON fields                 │
└────────────────────────────────────────┘
      │
      ↓
┌────────────────────────────────────────┐
│ 5. Data Transformation                 │
│    Extract value for requested lang    │
│    {status} → {status.ar}              │
└────────────────────────────────────────┘
      │
      ↓
┌────────────────────────────────────────┐
│ 6. JSON Response                       │
│    HTTP 200 OK                         │
│    {                                    │
│      [{id: 1, status: "عربي", ...}]    │
│    }                                    │
└────────────────────────────────────────┘
      │
      ↓
CLIENT RECEIVES RESPONSE
      │
      ↓
┌────────────────────────────────────────┐
│ 7. React Renders                       │
│    • Update state                      │
│    • Map data to components            │
│    • Apply RTL styling                 │
│    • Display on screen                 │
└────────────────────────────────────────┘
```

---

## Deployment Architecture (Optional)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                                   │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌────────────────────────┐
│  │   Client Browsers      │
│  │   (HTTPS Access)       │
│  └────────────────────────┘
│            │
│            ↓
│  ┌────────────────────────────────────────────────┐
│  │  CDN / Load Balancer                           │
│  │  (Static files, caching)                       │
│  └────────────────────────────────────────────────┘
│            │
│    ┌───────┴────────┐
│    ↓                ↓
│  ┌──────┐      ┌──────────┐
│  │Admin │      │ Client   │
│  │(SPA) │      │ Site     │
│  │      │      │  (SSR)   │
│  └──────┘      └──────────┘
│    │                │
│    └───────┬────────┘
│            ↓
│  ┌────────────────────────────────────────────────┐
│  │         API Gateway / Load Balancer            │
│  └────────────────────────────────────────────────┘
│            │
│    ┌───────┴─────────┐
│    ↓                 ↓
│  ┌──────────┐  ┌──────────┐
│  │ Laravel  │  │ Laravel  │
│  │  API #1  │  │  API #2  │
│  │(Instance)│  │(Instance)│
│  └──────────┘  └──────────┘
│    │                │
│    └────────┬───────┘
│             ↓
│  ┌──────────────────────┐
│  │  Primary Database    │
│  │   (MySQL Master)     │
│  └──────────────────────┘
│             │
│             ↓
│  ┌──────────────────────┐
│  │  Replica Database    │
│  │   (Read Replica)     │
│  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │  File Storage        │
│  │  (S3 or similar)     │
│  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │  Redis Cache         │
│  │  (Optional)          │
│  └──────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 27 November 2025
**Status**: ✅ Production Ready
