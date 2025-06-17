# Motion AI - Productivity Calendar App

## Overview

Motion AI is a productivity calendar application that combines AI-powered task management with intelligent scheduling optimization. The app allows users to create goals, manage tasks, and receive AI-generated suggestions for optimal time management. It features a modern Next.js application with TypeScript, Tailwind CSS, and Firebase authentication.

## System Architecture

The application follows a Next.js App Router architecture with full-stack capabilities:

- **Framework**: Next.js 15 with TypeScript and App Router
- **Build Tool**: Turbopack for fast development builds
- **Authentication**: Firebase Authentication with Google OAuth
- **AI Integration**: OpenAI GPT-3.5-turbo for intelligent task generation and scheduling optimization
- **UI Framework**: Tailwind CSS with Radix UI components (shadcn/ui)
- **State Management**: TanStack Query for server state management
- **API Routes**: Next.js API routes for backend functionality

## Key Components

### Frontend Architecture
- **Component Library**: Custom UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Management**: React Hook Form with Zod validation
- **Query Management**: TanStack Query for API state management
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **API Layer**: Next.js API routes with RESTful design
- **Data Layer**: Mock data for development with Zod schema validation
- **AI Services**: OpenAI integration for task generation and schedule optimization
- **Middleware**: Built-in Next.js middleware and error handling

### Database Schema
The application uses three main entities:
- **Goals**: High-level objectives with priority, progress tracking, and due dates
- **Tasks**: Specific time-blocked activities linked to goals with duration and priority
- **AI Suggestions**: System-generated recommendations for productivity optimization

## Data Flow

1. **Authentication**: Users sign in via Google OAuth through Firebase
2. **Goal Creation**: Authenticated users create goals through the sidebar interface
3. **Task Management**: Tasks can be manually created or AI-generated from goals
4. **Schedule Optimization**: AI analyzes existing tasks and goals to suggest optimizations
5. **Real-time Updates**: Frontend updates reactively through TanStack Query invalidation
6. **Drag-and-Drop**: Calendar interface supports task repositioning (with react-beautiful-dnd)

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless`
- **Authentication**: Firebase SDK for Google OAuth integration
- **AI Service**: OpenAI API for task generation and optimization
- **UI Components**: Extensive use of Radix UI primitives
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Drag & Drop**: react-beautiful-dnd for calendar task repositioning

### Development Tools
- **Build System**: Vite with TypeScript and React plugins
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Development Server**: Express with Vite middleware integration
- **Database Migrations**: Drizzle Kit for schema management

## Deployment Strategy

The application is configured for Replit deployment with:
- **Build Process**: Vite builds client assets, esbuild bundles server code
- **Runtime**: Node.js 20 with PostgreSQL 16 module
- **Environment**: Production builds served via Express static middleware
- **Development**: Hot reload enabled through Vite middleware integration
- **Port Configuration**: Server runs on port 5000, exposed on port 80

The deployment uses Replit's autoscale deployment target with build and run commands configured in `.replit` file.

## Recent Changes

- ✓ Converted from React/Vite to Next.js 15 with App Router
- ✓ Updated to use Turbopack for fast development builds
- ✓ Migrated all components to Next.js structure
- ✓ Fixed Firebase Authentication with Google OAuth integration
- ✓ Created Next.js API routes for goals, tasks, AI suggestions, and chat
- ✓ Updated all import paths to use Next.js @ alias convention
- ✓ Configured TypeScript, ESLint, and Tailwind CSS for Next.js
- ✓ Maintained OpenAI GPT-3.5-turbo integration for AI functionality
- ✓ Fixed hydration errors by adding client-side rendering checks
- ✓ Improved sign-out UX to redirect back to landing page

## Changelog

- June 17, 2025: Converted Motion AI calendar to Next.js architecture with TypeScript, ESLint, Tailwind CSS, App Router, and Turbopack

## User Preferences

Preferred communication style: Simple, everyday language.