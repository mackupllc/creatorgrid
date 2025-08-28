# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreatorGrid is a content creator productivity app built with Next.js 14, TypeScript, and Tailwind CSS. The app provides tools for brain dumping ideas, managing content projects, and tracking publishing schedules.

## Tech Stack & Dependencies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Theme**: next-themes for light/dark mode switching
- **Storage**: localStorage for user preferences and data

## Development Commands

```bash
# Project setup (if not already initialized)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false

# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking (add to package.json)

# shadcn/ui component installation
npx shadcn-ui@latest add [component-name]
```

## Project Architecture

### Page Structure
- **Home** (`/`): Greeting with name input, navigation hub
- **Brain Dump** (`/brain-dump`): Quick note-taking interface
- **Projects** (`/projects`): Content project management with fields for title, type, status, script link, publish date, sponsor/ad info
- **Calendar** (`/calendar`): Visual calendar view synced with project dates

### Key Components
- `components/navbar.tsx`: Navigation component (appears on all pages except home)
- `components/theme-toggle.tsx`: Dark/light mode switcher
- `components/ui/`: shadcn/ui component library
- `app/layout.tsx`: Root layout with theme provider

### Data Management
- Use localStorage for persisting user data (name, projects, notes)
- All data operations should be client-side for Phase 1
- Structure data with clear TypeScript interfaces

## Development Approach

### Phase-Based Development
- **Phase 1 (MVP)**: Core functionality with basic features
- **Phase 2**: Voice input, external calendar sync, advanced tracking

### Coding Standards
- Prioritize simplicity and clarity over complexity
- Write modular, reusable components
- Ensure responsive design from the start
- Test each page thoroughly before adding complexity
- Use TypeScript interfaces for all data structures

### File Organization
```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page
├── brain-dump/page.tsx     # Note-taking interface
├── projects/page.tsx       # Project management
├── calendar/page.tsx       # Calendar view
└── globals.css             # Global styles

components/
├── ui/                     # shadcn/ui components
├── navbar.tsx              # Main navigation
└── theme-toggle.tsx        # Theme switcher
```

### Future Enhancements (Phase 2)
- Voice recording and transcription for brain dump
- External calendar API integration (Google Calendar, etc.)
- Advanced project tracking and analytics
- Export/import functionality

## Design Principles
- Clean, minimal interface focusing on productivity
- Accessibility and responsive design prioritized
- Iterative development in small, testable increments
- Future-proof architecture for planned enhancements