# RRF Learning Platform

## Overview

RRF Learning is a comprehensive e-learning platform designed specifically for refugee and rural communities to learn permaculture and sustainable practices. The platform provides structured courses, assessments, and collaborative learning features to help build resilient communities through education.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom RRF branding colors
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Authentication**: Session-based authentication with Express sessions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Session Management**: Express sessions with PostgreSQL store
- **Password Security**: bcrypt for password hashing
- **File Structure**: Monorepo structure with shared types and schemas

### Database Architecture
- **Database**: PostgreSQL (configured for Neon/Render deployment)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Type-safe schema definitions in shared folder
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### User Management System
- **Multi-role Architecture**: Admin, Instructor, and Student roles
- **Registration System**: Comprehensive user profiles with location data
- **Authentication Middleware**: Role-based access control
- **User Profiles**: Detailed information including education level and geographic data

### Course Management
- **Course Creation**: Instructors can create structured courses
- **Content Types**: Support for text, images, videos, and documents
- **Assessment System**: Chapter-based assessments with scoring
- **Progress Tracking**: Student progress monitoring and analytics
- **Approval Workflow**: Admin approval system for course publication

### Permaculture Content System
- **Information Database**: Structured permaculture knowledge base
- **Search Functionality**: Category and text-based search
- **Content Management**: CRUD operations for permaculture information
- **Tagging System**: Organized content categorization

### File Upload System
- **Multi-format Support**: PDF, DOC, images, audio, and video files
- **Progress Tracking**: Real-time upload progress indication
- **File Management**: Course-specific file organization
- **Size Limitations**: Configurable file size limits (50MB default)

## Data Flow

### Authentication Flow
1. User registration with comprehensive profile data
2. Password hashing with bcrypt
3. Session creation and storage in PostgreSQL
4. Role-based route protection and UI rendering

### Course Learning Flow
1. Student browses published courses
2. Enrollment process with progress tracking initialization
3. Chapter-by-chapter learning progression
4. Assessment completion and scoring
5. Progress updates and completion tracking

### Content Management Flow
1. Instructors create courses with structured chapters
2. File uploads and content organization
3. Admin review and approval process
4. Course publication and student accessibility

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database (Render/Neon hosting)
- **Connection Pooling**: Neon serverless PostgreSQL with connection pooling

### File Storage
- **Local Storage**: Server-side file storage in public directory
- **Upload Processing**: Express middleware for multipart form handling

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon system
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **ESBuild**: Production build bundling for server
- **TypeScript**: Type safety across full stack
- **Drizzle Kit**: Database migration and introspection tools

## Deployment Strategy

### Replit Deployment
- **Environment**: Node.js 20 runtime with PostgreSQL 16
- **Build Process**: Vite client build + ESBuild server bundle
- **Port Configuration**: Server runs on port 5000, external port 80
- **Development Mode**: Hot reload with Vite middleware integration

### Production Configuration
- **Environment Variables**: Database URL and session secrets
- **Static Files**: Client build served from dist/public
- **Database SSL**: SSL-required connections for cloud PostgreSQL
- **Session Security**: HTTP-only cookies with secure flags in production

### Database Setup
- **Migration Strategy**: Drizzle migrations with table creation scripts
- **Seed Data**: Initial permaculture content and admin user setup
- **Backup Strategy**: Cloud provider automated backups

## Recent Changes

```
Recent Changes:
- June 15, 2025: Successfully deployed comprehensive RRF Learning Platform
- Migrated from in-memory storage to PostgreSQL database
- All database tables created and migrations applied
- Multi-role authentication system fully operational
- Course management system with instructor/student workflows
- Interactive learning modules with chapter-based progression
- Role-based dashboards (Admin, Instructor, Student)
- File upload system for course materials
- Permaculture information database with search functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```