# 🛤️ Track2Act - Real-Time Shipment Tracking for Indian Logistics

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Java](https://img.shields.io/badge/Java-17+-007396?logo=java)](https://openjdk.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

**Track2Act** is a production-grade, full-stack supply chain intelligence platform designed for Indian logistics. Featuring **real-time GPS tracking**, **AI-powered decision intelligence**, **compliance guardrails**, and a **command-center style dashboard** with live India map visualization.

## 🚀 Quick Start

### Prerequisites
- Java 17+ & Maven
- Reactjs
- MySQL

### 1. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
**Backend runs on http://localhost:8080**

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
**Frontend runs on http://localhost:5173**

### Company Access Codes
Required for signup/login (shown on signup page):

| Code            | Company                  |
|-----------------|--------------------------|
| T2A-ALPHA-001   | Logistics Corp India     |
| T2A-BETA-002    | FastMove Enterprises     |
| T2A-GAMMA-003   | IndiaShip Solutions      |
| T2A-DELTA-004   | CargoTech Systems        |
| T2A-OMEGA-005   | SupplyEdge Networks      |

## 🏗️ Tech Stack

```
Frontend: React 19 + Vite 6 + shadcn/ui + TailwindCSS v4 + Framer Motion 11 + Lucide React
Backend:  Spring Boot 3.2.1 + JPA/Hibernate + Spring Security (JWT) + Lombok + Maven
Database: MySQL 8 (Flyway migrations)
Other:    Axios, Sonner (toasts), React Router, React Hook Form, Zod
```

## 📋 Folder Structure
```
track2act-new/
├── backend/          # Spring Boot API
│   ├── src/main/java/com/track2act/
│   │   ├── entity/   # Shipment, User, Location, TrackingUpdate
│   │   ├── controller/ # AuthController, ShipmentController, LocationController
│   │   ├── service/  # AuthService, ShipmentService
│   │   └── dto/      # Request/Response DTOs
│   └── pom.xml
├── frontend/         # React SPA
│   ├── src/
│   │   ├── pages/dashboard/ # DashboardPage, LiveMapPage, NewShipmentPage
│   │   ├── components/dashboard/ # StatsCards, LiveMap, DecisionIntelligence, etc.
│   │   ├── services/ # shipmentService.js
│   │   └── context/  # AuthContext
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## ✨ Core Features

### Authentication & Users
- JWT-based auth with role-based access
- Company-specific signup (5 predefined companies)
- Protected dashboard routes

### Shipment Management
| Feature | Description |
|---------|-------------|
| **CRUD** | Create/read/update shipments with cargo details, origins/destinations, GPS, driver info |
| **Statuses** | ON_TIME, DELAYED, AT_RISK with progress tracking (0-100%) |
| **Real-time Updates** | GPS coordinates, tracking history |

### **Dashboard - Command Center** ⚡ (Primary Focus)
Modern, real-time interface with 7+ interactive panels:

| Panel | Key Features |
|-------|--------------|
| **Stats Cards** | Active Shipments (2,847), In Transit (1,423), Disruptions (23), On-Time (94.7%) with trends |
| **Quick Actions** | New Shipment, Refresh Data, Export, Filters |
| **Live Map** | SVG India map w/ animated routes, ports/hubs, disruptions. Search/filter shipments by ID/status. GPS dots pulsing by progress/status. Layers (ports/hubs/disruptions), zoom. Detailed sidebar for selected shipment. |
| **Decision Intelligence** | AI recommendations for disruptions (e.g., 'Reroute via Mundra' vs Wait/Air). Cost/delay/risk/confidence scores. 'Execute' button. |
| **Compliance Panel** | Guardrails (budget/deadline/policy/approval). Compliance score (e.g., 75%). Edge cases auto-resolved. |
| **Task Execution Flow** | Pipeline viz: Detection → Impact → Decision → Action → Outcome. Live progress. |
| **Audit Log** | Real-time events (disruptions/decisions/actions). Expandable details w/ reasoning, guardrails, alternatives. Search/export. |

**Live Map Deep Dive**:
- Interactive SVG map of India (ports: Mumbai, Chennai; hubs).
- Shipment routes as curved paths (color-coded by status, dashed progress).
- Pulsing GPS markers, disruptions (weather/traffic/accident icons).
- Sidebar: Shipment list (progress bars, search/filter), selected shipment details (route, driver, actions).

### API Endpoints (Backend)
```
Auth:    POST /api/auth/register, /api/auth/login
Shipments: GET/POST /api/shipments, /api/shipments/active, /api/shipments/{id}
Locations: GET /api/locations
User:    GET /api/me
```
**Responses**: Standardized `ApiResponse<T>` with data/errors.

## 🎯 Usage Flow
1. **Signup/Login** with company code → Redirect to `/dashboard`
2. **Dashboard** loads real-time stats/map/shipments
3. **Create Shipment** → `/dashboard/new-shipment` form (cargo, locations, GPS)
4. **Monitor** live GPS on map, AI suggestions for issues
5. **Audit** all decisions/actions in log

## 🛠️ Development

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
npm run build
```

### Environment
- Backend: `application.yml` (DB config)
- Frontend: `.env` for API_BASE

## 📱 Screenshots
*(Add dashboard/map screenshots here in future)*

## 🔮 Future Integrations
- Push notifications for disruptions
- Mobile app (React Native)
- Advanced analytics & ML predictions
- Multi-company tenant isolation
- Real IoT device/GPS hardware integration

## 🤝 Contributing
Fork → Branch → PR. Follow conventional commits.

## 📄 License
MIT

---
**Built with ❤️ for Indian Logistics Revolution**

