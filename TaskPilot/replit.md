# AI Calendar - Intelligent Scheduling Assistant

## Overview

AI Calendar is an intelligent, AI-powered calendar application that combines natural language processing with beautiful Apple-inspired design. The app enables users to generate, modify, and manage their schedules through conversational AI interactions, making calendar management intuitive and effortless.

The application follows a clean, modern architecture with a React frontend, Express backend, and PostgreSQL database, leveraging OpenAI's GPT models for intelligent schedule generation and natural language understanding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **Shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Framer Motion** for smooth animations and transitions
- Apple Calendar-inspired design system with custom color palette and spacing

**State Management**
- React Query for server state (events, conversations, templates)
- React Context for theme management (light/dark mode)
- Local component state with hooks for UI interactions

**Design Philosophy**
- Apple Calendar aesthetic with clean, minimal interface
- Responsive three-panel layout: sidebar (280px), main calendar view, AI copilot panel
- Custom color system with chart colors (chart-1 through chart-5) for event categorization
- SF Pro Rounded typography (with Inter fallback)
- Smooth micro-animations for state transitions

### Backend Architecture

**Core Framework**
- **Express.js** server with TypeScript
- Session-based authentication using Replit Auth (OpenID Connect)
- RESTful API design with consistent error handling

**API Structure**
- `/api/auth/*` - Authentication endpoints (user session, login/logout)
- `/api/events` - CRUD operations for calendar events
- `/api/ai/generate` - AI schedule generation from natural language prompts
- `/api/ai/apply-template` - Apply predefined scenario templates
- `/api/ai/conversations` - Retrieve conversation history
- `/api/templates` - Manage scenario templates

**Business Logic Layers**
- **Storage Layer** (`storage.ts`) - Data access abstraction with IStorage interface
- **AI Service Layer** (`aiService.ts`) - OpenAI integration for schedule generation
- **Route Layer** (`routes.ts`) - Request handling and validation

**Authentication & Sessions**
- Replit Auth (OpenID Connect) for user authentication
- Express sessions stored in PostgreSQL using connect-pg-simple
- Session middleware protecting all authenticated routes
- Automatic user profile synchronization (email, name, profile image)

### Data Storage

**Database: PostgreSQL via Neon**
- **Drizzle ORM** for type-safe database operations and migrations
- Connection pooling with @neondatabase/serverless
- WebSocket support for serverless environments

**Schema Design**

*Core Tables:*
- `users` - User profiles synchronized from Replit Auth (id, email, firstName, lastName, profileImageUrl)
- `events` - Calendar events with user relationship, timestamps, colors, and descriptions
- `ai_conversations` - Chat history between user and AI for context-aware responses
- `scenario_templates` - Predefined scheduling templates (Focus Week, Wellness Week, etc.)
- `sessions` - Express session storage (required for Replit Auth)

*Key Relationships:*
- Events cascade delete with users (one-to-many)
- Conversations cascade delete with users (one-to-many)
- Templates are global, seeded with defaults

**Data Validation**
- Zod schemas derived from Drizzle tables for runtime validation
- Type-safe insert/update operations with createInsertSchema

### External Dependencies

**AI & Machine Learning**
- **OpenAI API** - GPT-5 model for natural language schedule generation and conversational AI
- Structured JSON responses for event creation
- Conversation history for context-aware interactions
- System prompts for scheduling intelligence (time allocation, color coding, smart defaults)

**Authentication**
- **Replit Auth (OpenID Connect)** - Complete authentication solution
- Automatic user profile management
- Secure session handling with httpOnly cookies
- OAuth2/OIDC flow with passport.js integration

**Database & Infrastructure**
- **Neon PostgreSQL** - Serverless PostgreSQL database
- Connection string configured via DATABASE_URL environment variable
- WebSocket support for real-time features

**UI & Design Libraries**
- **Radix UI** - Headless component primitives (dialogs, popovers, dropdowns, etc.)
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Icon library for consistent UI elements
- **date-fns** - Date manipulation and formatting

**Development Tools**
- **Drizzle Kit** - Database migrations and schema management
- **ESBuild** - Fast JavaScript bundler for production builds
- **TypeScript** - Type safety across frontend and backend
- **Vite Plugins** - Development tooling (error overlay, cartographer, dev banner)

**Environment Configuration**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `OPENAI_API_KEY` - OpenAI API authentication (required)
- `SESSION_SECRET` - Express session encryption key (required)
- `REPL_ID` - Replit deployment identifier for auth
- `ISSUER_URL` - OpenID Connect issuer URL (defaults to replit.com/oidc)