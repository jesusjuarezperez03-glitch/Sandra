# Barbería Pro - PWA Booking System

## Overview

Barbería Pro is a Progressive Web App (PWA) for a modern barbershop that enables customers to book appointments online, chat with an AI assistant, and browse services and barbers. The application is built as a full-stack TypeScript solution with a React frontend and Express backend, designed with a mobile-first approach following Material Design 3 principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and component-based development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- Single Page Application (SPA) architecture with code splitting support

**UI Component System**
- Shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design 3 principles with Roboto font family and Material Icons
- Responsive design with mobile-first breakpoints (mobile → md:768px → lg:1024px)
- Light/dark theme support with localStorage persistence

**State Management**
- TanStack Query (React Query) for server state management with automatic caching and refetching
- Local React state for UI-specific state
- Session storage for chat session persistence

**PWA Features**
- Service Worker (`public/sw.js`) for offline caching and asset management
- Web App Manifest for installability with shortcuts to booking and chat
- Responsive viewport configuration with proper mobile meta tags

**Key Pages & Features**
- Home: Hero section with CTAs, feature showcase, business hours
- Booking: Multi-step wizard (barber selection → service selection → date/time → customer details → confirmation)
- Chat: AI-powered chatbot interface with OpenAI integration
- Reusable components: BarberCard, ServiceCard, BookingCalendar, ChatBot

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM module system for modern JavaScript imports
- Development mode with tsx for fast TypeScript execution
- Production build with esbuild for optimized bundling

**API Design**
- RESTful API endpoints under `/api` namespace
- JSON request/response format with proper content-type headers
- Routes organized in `/server/routes.ts`:
  - GET `/api/barbers` - List all barbers
  - GET `/api/barbers/:id` - Get specific barber
  - GET `/api/services` - List all services
  - POST `/api/appointments` - Create appointment
  - GET `/api/appointments` - Query appointments by barber/date
  - POST `/api/chat` - Send chat message and get AI response

**Development Server Integration**
- Vite middleware in development for HMR and fast refresh
- Static file serving in production from `dist/public`
- Request logging middleware with duration tracking and response capture

### Data Storage Solutions

**Current Implementation**
- In-memory storage using Map data structures (`MemStorage` class in `server/storage.ts`)
- Seeded initial data for barbers, services, appointments, and chat messages
- Interface-based design (`IStorage`) allows easy migration to persistent storage

**Database Schema Design**
- Drizzle ORM configured for PostgreSQL (ready for Neon or other PostgreSQL providers)
- Schema defined in `shared/schema.ts` using drizzle-orm/pg-core:
  - `barbers`: id, name, specialty, photo, rating, available
  - `services`: id, name, description, duration, price, icon
  - `appointments`: id, customerName, customerPhone, barberId, serviceId, date, time, status, createdAt
  - `chatMessages`: id, sessionId, role (user/assistant), content, createdAt
- Zod schemas generated from Drizzle tables for runtime validation
- UUID primary keys with PostgreSQL gen_random_uuid()

**Migration Strategy**
- Database migrations configured to output to `./migrations` directory
- `drizzle-kit push` command available for schema synchronization
- Environment variable `DATABASE_URL` expected for database connection

### Authentication and Authorization

**Current State**
- No authentication system implemented
- Public access to all endpoints
- Chat sessions identified by client-generated session IDs (nanoid)

**Design Considerations**
- Application ready for session-based or JWT authentication
- User identification needed for appointment management and chat history
- Cookie-based sessions could use `connect-pg-simple` (already in dependencies)

### External Dependencies

**AI Integration**
- OpenAI API (GPT-5 model) for intelligent chatbot responses
- System prompt configured with barbershop context (services, prices, hours, barbers)
- API key expected in `OPENAI_API_KEY` environment variable
- Chat responses in Spanish tailored to barbershop domain

**Third-Party UI Libraries**
- Radix UI: Comprehensive set of unstyled, accessible component primitives
- Embla Carousel: Touch-friendly carousel implementation
- Lucide React: Icon library for consistent iconography
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation and formatting

**Database Provider**
- Configured for Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- Connection via `DATABASE_URL` environment variable
- WebSocket-based serverless driver for edge compatibility

**Development Tools**
- Replit-specific plugins for enhanced development experience:
  - Runtime error overlay
  - Cartographer for visual navigation
  - Development banner
- TypeScript with strict mode for compile-time type checking
- ESBuild for production bundling with external package handling

**Static Assets**
- Google Fonts CDN for Roboto and Roboto Condensed
- Google Material Icons CDN
- Local image assets in `attached_assets/generated_images` directory
- Barber photos served via dedicated endpoint

**Design System**
- Tailwind CSS with custom configuration extending default theme
- CSS custom properties for theme colors supporting light/dark modes
- Border radius tokens: lg (9px), md (6px), sm (3px)
- Neutral base color palette with HSL color space