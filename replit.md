# Motion AI - Productivity Calendar App

## Overview

Motion AI is a productivity calendar application that combines AI-powered task management with intelligent scheduling optimization. The app allows users to create goals, manage tasks, and receive AI-generated suggestions for optimal time management. It features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and OpenAI for intelligent automation.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for intelligent task generation and scheduling optimization
- **UI Framework**: Tailwind CSS with Radix UI components (shadcn/ui)
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Custom UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Management**: React Hook Form with Zod validation
- **Query Management**: TanStack Query for API state management
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **API Layer**: RESTful Express.js server with route-based organization
- **Data Layer**: Drizzle ORM with PostgreSQL database
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development
- **AI Services**: OpenAI integration for task generation and schedule optimization
- **Middleware**: Request logging, error handling, and JSON parsing

### Database Schema
The application uses three main entities:
- **Goals**: High-level objectives with priority, progress tracking, and due dates
- **Tasks**: Specific time-blocked activities linked to goals with duration and priority
- **AI Suggestions**: System-generated recommendations for productivity optimization

## Data Flow

1. **Goal Creation**: Users create goals through the sidebar interface
2. **Task Management**: Tasks can be manually created or AI-generated from goals
3. **Schedule Optimization**: AI analyzes existing tasks and goals to suggest optimizations
4. **Real-time Updates**: Frontend updates reactively through TanStack Query invalidation
5. **Drag-and-Drop**: Calendar interface supports task repositioning (with react-beautiful-dnd)

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless`
- **AI Service**: OpenAI API for task generation and optimization
- **UI Components**: Extensive use of Radix UI primitives
- **Styling**: Tailwind CSS with class-variance-authority for component variants

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

- ✓ Fixed OpenAI API integration to use gpt-3.5-turbo model
- ✓ Resolved AI chat functionality with proper error handling  
- ✓ Fixed accessibility warning in dialog components
- ✓ Updated storage layer with proper TypeScript types
- ✓ AI chat assistant now responding correctly to user queries

## Changelog

- June 17, 2025: Initial Motion AI calendar setup with full AI integration

## User Preferences

Preferred communication style: Simple, everyday language.